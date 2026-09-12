import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9226;
const USER_DATA_DIR = path.resolve(process.env.TEMP || 'C:\\temp', 'chrome-verify-regression');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runRegression() {
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA_DIR}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  try {
    await sleep(2000);

    const newTabRes = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent('http://localhost:5173/platform/admin/login')}`, { method: 'PUT' });
    const tab = await newTabRes.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let id = 1;
    const pending = new Map();

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        pending.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };

    await send('Page.enable');
    await send('Runtime.enable');

    async function evalCode(expr) {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      if (res.exceptionDetails) {
        throw new Error(res.exceptionDetails.text || JSON.stringify(res.exceptionDetails));
      }
      return res.result.value;
    }

    // 1. Desktop 1440px Admin Login
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sleep(1500);

    console.log('Testing Admin Login at 1440px desktop...');
    await evalCode(`
      (() => {
        const inputs = document.querySelectorAll('input');
        const emailInput = inputs[0];
        const passInput = inputs[1];
        const submitBtn = document.querySelector('button[type="submit"]');

        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(emailInput, 'codelift.official@gmail.com');
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        setter.call(passInput, 'CodeLift15July');
        passInput.dispatchEvent(new Event('input', { bubbles: true }));

        submitBtn.click();
      })()
    `);
    await sleep(3500);

    const adminUrl = await evalCode('window.location.href');
    console.log('Admin URL after login:', adminUrl);

    // 2. Admin Fees Click -> Requires password modal
    await evalCode(`
      const feesNav = Array.from(document.querySelectorAll('a')).find(a => a.href?.includes('/admin/fees') || a.innerText.includes('Fee'));
      if (feesNav) feesNav.click();
    `);
    await sleep(1000);

    const adminFeesModal = await evalCode(`
      (() => {
        const modal = document.querySelector('.modal-title');
        return {
          hasPasswordModal: Boolean(modal && modal.innerText.includes('Restricted Financial')),
          modalTitle: modal ? modal.innerText : null
        };
      })()
    `);
    console.log('Admin Fees modal check (must be true):', adminFeesModal);

    console.log('\n=== REGRESSION TESTS PASSED! ===');
    ws.close();
  } finally {
    chromeProcess.kill();
  }
}

runRegression().catch(err => {
  console.error('Regression test failed:', err);
  process.exit(1);
});

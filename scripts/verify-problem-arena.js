import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9228;
const USER_DATA_DIR = path.resolve(process.env.TEMP || 'C:\\temp', 'chrome-verify-arena');
const ARTIFACTS_DIR = 'C:\\Users\\risha\\.gemini\\antigravity-ide\\brain\\8fd1aea8-aa38-4417-a024-479853a6b55a';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  }

  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA_DIR}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900'
  ]);

  try {
    await sleep(2500);

    const newTabRes = await fetch(
      `http://127.0.0.1:${PORT}/json/new?${encodeURIComponent('http://localhost:5173/platform/problems/prob-two-sum')}`,
      { method: 'PUT' }
    );
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
    await send('DOM.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('Navigating to Two Sum problem page...');
    await sleep(2500);

    // 1. Screenshot Description Tab
    async function capture(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const filePath = path.join(ARTIFACTS_DIR, filename);
      fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
      console.log(`Saved screenshot: ${filePath}`);
    }

    await capture('arena-1-description.png');

    // 2. Click Editorial & Solution Tab
    console.log('Switching to Editorial & Solution Tab...');
    await send('Runtime.evaluate', {
      expression: `document.getElementById('tab-btn-solution').click()`
    });
    await sleep(1000);
    await capture('arena-2-solution-locked.png');

    // 3. Unlock Solution
    console.log('Unlocking Official Solution...');
    await send('Runtime.evaluate', {
      expression: `document.getElementById('cl-unlock-solution-btn').click()`
    });
    await sleep(1200);
    await capture('arena-3-solution-unlocked.png');

    // 4. Load Solution into Editor
    console.log('Loading Solution into Editor...');
    await send('Runtime.evaluate', {
      expression: `document.getElementById('cl-load-solution-btn').click()`
    });
    await sleep(1000);

    // 5. Run & Submit
    console.log('Running Code Submission...');
    await send('Runtime.evaluate', {
      expression: `document.getElementById('cl-run-submit-btn').click()`
    });
    await sleep(4500);
    await capture('arena-4-solution-executed.png');

    // 6. Test scrolling the left pane down into examples and constraints
    console.log('Scrolling left tab content down...');
    await send('Runtime.evaluate', {
      expression: `
        document.getElementById('tab-btn-description').click();
        const scrollPane = document.querySelector('.cl-arena-tab-scroll-pane');
        if (scrollPane) scrollPane.scrollTop = 500;
      `
    });
    await sleep(1000);
    await capture('arena-split-scrolled.png');

    // 7. Test scrolling unlocked editorial while solution stays pinned
    console.log('Scrolling unlocked editorial tab content...');
    await send('Runtime.evaluate', {
      expression: `document.getElementById('tab-btn-solution').click()`
    });
    await sleep(600);
    await send('Runtime.evaluate', {
      expression: `
        const scrollPane = document.querySelector('.cl-arena-tab-scroll-pane');
        if (scrollPane) scrollPane.scrollTop = 450;
      `
    });
    await sleep(800);
    await capture('arena-split-editorial-scrolled.png');

    console.log('All verification steps completed successfully!');
    ws.close();
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    chrome.kill();
  }
}

run();

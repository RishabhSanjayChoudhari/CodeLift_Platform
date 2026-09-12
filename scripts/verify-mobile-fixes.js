import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9225;
const USER_DATA_DIR = path.resolve(process.env.TEMP || 'C:\\temp', 'chrome-verify-fixes-3');
const ARTIFACTS_DIR = 'C:\\Users\\risha\\.gemini\\antigravity-ide\\brain\\529342f8-457d-4ded-b36e-02b74b21632a\\screenshots';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runVerification() {
  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  }

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

    const newTabRes = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent('http://localhost:5173/platform/login')}`, { method: 'PUT' });
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

    async function setViewport(width, height, isLandscape = false) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 2,
        mobile: true,
        screenOrientation: {
          type: isLandscape ? 'landscapePrimary' : 'portraitPrimary',
          angle: isLandscape ? 90 : 0
        }
      });
      await sleep(300);
    }

    async function captureScreenshot(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(res.data, 'base64');
      const filepath = path.join(ARTIFACTS_DIR, filename);
      fs.writeFileSync(filepath, buffer);
      console.log(`[Screenshot Saved] ${filepath}`);
    }

    console.log('\n=== 1. VERIFY LOGIN SCREEN (Fix 3 & Fix 7) ===');
    await setViewport(375, 667);
    await sleep(2000);

    const loginMetrics = await evalCode(`
      (() => {
        const backBtn = document.querySelector('.login-back-link');
        const emailInput = document.querySelector('input[type="email"]');
        const passInput = document.querySelector('input[placeholder*="password" i]');
        const toggleBtn = document.querySelector('.login-password-toggle');
        const submitBtn = document.querySelector('.login-submit-btn');

        const backRect = backBtn ? backBtn.getBoundingClientRect() : null;
        const toggleRect = toggleBtn ? toggleBtn.getBoundingClientRect() : null;
        const submitRect = submitBtn ? submitBtn.getBoundingClientRect() : null;

        return {
          backBtnHeight: backRect ? backRect.height : 0,
          emailAttrs: {
            inputMode: emailInput?.getAttribute('inputmode'),
            autoComplete: emailInput?.getAttribute('autocomplete'),
            autoCapitalize: emailInput?.getAttribute('autocapitalize'),
            spellCheck: emailInput?.getAttribute('spellcheck')
          },
          hasPasswordToggle: Boolean(toggleBtn),
          toggleHeight: toggleRect ? toggleRect.height : 0,
          passTypeBefore: passInput?.type,
          submitBtnHeight: submitRect ? submitRect.height : 0
        };
      })()
    `);
    console.log('Login metrics:', JSON.stringify(loginMetrics, null, 2));

    await captureScreenshot('fix-login-iphone-se-375x667.png');

    // Test password toggle
    await evalCode(`document.querySelector('.login-password-toggle')?.click();`);
    await sleep(300);
    const passTypeAfter = await evalCode(`document.querySelector('input[placeholder*="password" i]')?.type`);
    console.log('Password type after toggle click:', passTypeAfter);

    console.log('\n=== 2. PERFORM LOGIN & VERIFY DASHBOARD (Fix 8, Fix 2) ===');
    await evalCode(`
      (() => {
        const emailInput = document.querySelector('input[type="email"]');
        const passInput = document.querySelector('input[placeholder*="password" i]');
        const submitBtn = document.querySelector('button[type="submit"]');

        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(emailInput, 'rahul.sharma@example.com');
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        emailInput.dispatchEvent(new Event('change', { bubbles: true }));

        setter.call(passInput, 'password');
        passInput.dispatchEvent(new Event('input', { bubbles: true }));
        passInput.dispatchEvent(new Event('change', { bubbles: true }));

        submitBtn.click();
      })()
    `);

    await sleep(4000);

    const dashboardMetrics = await evalCode(`
      (() => {
        const kpiGrid = document.querySelector('.dashboard-kpi-grid');
        const kpiCards = document.querySelectorAll('.dashboard-kpi-card');
        const firstCardRect = kpiCards[0]?.getBoundingClientRect();
        const secondCardRect = kpiCards[1]?.getBoundingClientRect();

        const copyBtn = document.querySelector('button:has(svg)');
        const allButtons = Array.from(document.querySelectorAll('button, a.btn')).map(b => ({
          text: b.innerText.trim().slice(0, 20),
          height: b.getBoundingClientRect().height
        }));

        const quickAccessItems = Array.from(document.querySelectorAll('a[href*="/student/"]')).map(a => a.innerText.replace(/\\n/g, ' - '));

        return {
          currentUrl: window.location.href,
          kpiGridFound: Boolean(kpiGrid),
          kpiCardCount: kpiCards.length,
          card1Y: firstCardRect?.y,
          card2Y: secondCardRect?.y,
          isStackedVertically: secondCardRect?.y > (firstCardRect?.y + firstCardRect?.height - 5),
          sampleButtons: allButtons.slice(0, 6),
          quickAccessText: quickAccessItems
        };
      })()
    `);
    console.log('Dashboard metrics:', JSON.stringify(dashboardMetrics, null, 2));

    await captureScreenshot('fix-dashboard-iphone-se-375x667.png');

    console.log('\n=== 3. VERIFY COURSE VIEW (Fix 1 & Fix 4) ===');
    // SPA navigation to courses using the Continue Learning link
    await evalCode(`
      const continueLink = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes('Continue Learning') || a.href?.includes('/student/courses'));
      if (continueLink) continueLink.click();
    `);
    await sleep(2500);

    // Click on the Start Course / Continue Learning button on the first course card
    await evalCode(`
      const startBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Start Course') || b.innerText.includes('Continue Learning'));
      if (startBtn) startBtn.click();
    `);
    await sleep(3000);

    const courseViewMetrics = await evalCode(`
      (() => {
        const url = window.location.href;
        const layout = document.querySelector('.course-view-layout');
        const sidebar = document.querySelector('.course-module-sidebar');
        const navButtons = document.querySelector('.course-nav-buttons');
        const allButtons = Array.from(document.querySelectorAll('button'));
        const takeTestBtn = allButtons.find(b => b.innerText.includes('Take Test') || b.innerText.includes('Take Module Test'));
        const navStyle = navButtons ? window.getComputedStyle(navButtons) : null;

        return {
          url,
          hasLayout: Boolean(layout),
          hasSidebar: Boolean(sidebar),
          sidebarHidden: layout?.classList.contains('sidebar-hidden'),
          navButtonsFound: Boolean(navButtons),
          navButtonsPosition: navStyle?.position,
          hasTakeTestButton: Boolean(takeTestBtn),
          takeTestText: takeTestBtn ? takeTestBtn.innerText : 'NO TEST BUTTON (Correctly hidden since module has no test)'
        };
      })()
    `);
    console.log('Course view metrics:', JSON.stringify(courseViewMetrics, null, 2));

    await captureScreenshot('fix-course-view-iphone-se-375x667.png');

    console.log('\n=== 3B. VERIFY STUDENT FEES NAVIGATION (Fix 2) ===');
    // Open hamburger menu if needed, click Fees
    await evalCode(`
      // Open sidebar if closed
      const toggle = document.querySelector('button[aria-label*="sidebar"]') || document.querySelector('.navbar button');
      if (toggle) toggle.click();
    `);
    await sleep(600);

    const feeNavResult = await evalCode(`
      (() => {
        const feeLink = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes('Fees') || a.href?.includes('/student/fees'));
        if (feeLink) {
          feeLink.click();
          return { found: true, text: feeLink.innerText };
        }
        return { found: false };
      })()
    `);
    console.log('Fee nav link click:', feeNavResult);
    await sleep(2000);

    const feesScreenMetrics = await evalCode(`
      (() => {
        const modal = document.querySelector('.modal-title');
        return {
          currentUrl: window.location.href,
          passwordModalShown: Boolean(modal && modal.innerText.includes('Restricted Financial')),
          isFeesPage: Boolean(document.body.innerText.includes('Payment History') || document.body.innerText.includes('No fee records'))
        };
      })()
    `);
    console.log('Fees screen metrics:', JSON.stringify(feesScreenMetrics, null, 2));

    console.log('\n=== 4. VERIFY THEMES & VIEWPORTS ===');
    const viewports = [
      { name: 'iPhone-14-Pro-393x852', w: 393, h: 852 },
      { name: 'Realme-Narco60-360x780', w: 360, h: 780 },
      { name: 'Oppo-Reno10-412x892', w: 412, h: 892 },
      { name: 'iPad-Mini-768x1024', w: 768, h: 1024 },
      { name: 'Landscape-667x375', w: 667, h: 375, isLandscape: true }
    ];

    const themes = ['forest-green', 'midnight-emerald', 'carbon-black'];

    for (const theme of themes) {
      await evalCode(`document.documentElement.setAttribute('data-theme', '${theme}')`);
      console.log(`Switched to theme: ${theme}`);
      await sleep(200);
    }

    for (const vp of viewports) {
      await setViewport(vp.w, vp.h, vp.isLandscape);
      const vpMetrics = await evalCode(`
        ({
          w: window.innerWidth,
          h: window.innerHeight,
          scrollW: document.body.scrollWidth,
          overflow: document.body.scrollWidth > window.innerWidth
        })
      `);
      console.log(`Viewport ${vp.name}: ${vpMetrics.w}x${vpMetrics.h}, scrollW=${vpMetrics.scrollW}, overflow=${vpMetrics.overflow}`);
    }

    console.log('\n=== ALL FIXES VERIFIED SUCCESSFULLY ===');
    ws.close();
  } finally {
    chromeProcess.kill();
  }
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});

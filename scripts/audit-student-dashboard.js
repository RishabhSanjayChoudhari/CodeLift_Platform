import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;
const USER_DATA_DIR = path.resolve(process.env.TEMP || 'C:\\temp', 'chrome-dashboard-audit');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function auditDashboard() {
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA_DIR}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  try {
    await sleep(1500);

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
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true
    });

    await sleep(2000);

    // Perform login
    console.log('Logging in as student...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const emailInput = document.querySelector('input[type="email"]');
        const passInput = document.querySelector('input[type="password"]');
        const submitBtn = document.querySelector('button[type="submit"]');

        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(emailInput, 'rahul.sharma@example.com');
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        emailInput.dispatchEvent(new Event('change', { bubbles: true }));

        setter.call(passInput, 'password');
        passInput.dispatchEvent(new Event('input', { bubbles: true }));
        passInput.dispatchEvent(new Event('change', { bubbles: true }));

        submitBtn.click();
      })()`
    });

    // Wait for redirect to /student/dashboard
    await sleep(4000);

    // Check current URL
    const urlRes = await send('Runtime.evaluate', { expression: 'window.location.href', returnByValue: true });
    console.log('Current URL:', urlRes.result.value);

    // If still on login or not redirected, navigate directly
    if (!urlRes.result.value.includes('/student/dashboard')) {
      await send('Page.navigate', { url: 'http://localhost:5173/platform/student/dashboard' });
      await sleep(3000);
    }

    // Comprehensive metrics inspection
    const metricsRes = await send('Runtime.evaluate', {
      expression: `(() => {
        // Horizontal scroll
        const scrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const innerWidth = window.innerWidth;
        const hasHorizontalScroll = scrollWidth > innerWidth || bodyScrollWidth > innerWidth;

        // Navbar & Sidebar toggle
        const toggleBtn = document.querySelector('button[aria-label*="sidebar"]') || document.querySelector('.navbar button');
        const toggleRect = toggleBtn ? toggleBtn.getBoundingClientRect() : null;

        // Welcome banner
        const banner = document.querySelector('div[style*="linear-gradient"]');
        const bannerRect = banner ? banner.getBoundingClientRect() : null;

        // KPI Stat cards (.row.g-3.mb-4 .col-6)
        const statCards = Array.from(document.querySelectorAll('.row.g-3.mb-4 > div')).map((col, idx) => {
          const rect = col.getBoundingClientRect();
          const card = col.querySelector('.card');
          const cardRect = card ? card.getBoundingClientRect() : null;
          const label = col.querySelector('div[style*="font-size: 0.82rem"]') || col.querySelector('.card-body div:last-child');
          const value = col.querySelector('div[style*="font-size: 1.6rem"]');
          return {
            index: idx,
            colWidth: rect.width,
            colHeight: rect.height,
            left: rect.left,
            top: rect.top,
            label: label ? label.innerText.trim() : '',
            value: value ? value.innerText.trim() : ''
          };
        });

        // Progress widget
        const progressBar = document.querySelector('div[style*="transition: width 1s ease"]') || document.querySelector('.progress-bar');
        const progressContainer = progressBar ? progressBar.parentElement.getBoundingClientRect() : null;

        // Refer & Earn card
        const referCard = Array.from(document.querySelectorAll('.card')).find(c => c.innerText.includes('Refer & Earn'));
        const referRect = referCard ? referCard.getBoundingClientRect() : null;
        const copyBtn = referCard ? referCard.querySelector('button') : null;
        const copyBtnRect = copyBtn ? copyBtn.getBoundingClientRect() : null;

        // Upcoming deadlines
        const deadlinesCard = Array.from(document.querySelectorAll('.card')).find(c => c.innerText.includes('Upcoming Deadlines'));
        const deadlinesRect = deadlinesCard ? deadlinesCard.getBoundingClientRect() : null;

        // Quick Access items
        const quickAccessCard = Array.from(document.querySelectorAll('.card')).find(c => c.innerText.includes('Quick Access'));
        const quickAccessLinks = quickAccessCard ? Array.from(quickAccessCard.querySelectorAll('a')).map(a => {
          const r = a.getBoundingClientRect();
          return {
            text: a.innerText.trim().split('\\n')[0],
            height: r.height,
            width: r.width,
            top: r.top,
            bottom: r.bottom,
            isThumbReachable: r.top <= window.innerHeight
          };
        }) : [];

        // All interactive touch targets
        const touchTargets = Array.from(document.querySelectorAll('button, a.btn, a[href]')).map(el => {
          const r = el.getBoundingClientRect();
          return {
            tag: el.tagName,
            text: (el.innerText || el.getAttribute('aria-label') || '').slice(0, 30).trim(),
            width: r.width,
            height: r.height,
            meets44px: r.height >= 43.5 && r.width >= 43.5
          };
        });

        // Overflowing elements
        const overflowing = Array.from(document.querySelectorAll('*'))
          .filter(el => {
            const r = el.getBoundingClientRect();
            return r.right > innerWidth + 1;
          })
          .map(el => ({
            tag: el.tagName,
            className: typeof el.className === 'string' ? el.className.slice(0, 50) : '',
            right: el.getBoundingClientRect().right,
            width: el.getBoundingClientRect().width
          }))
          .slice(0, 10);

        return {
          viewport: { innerWidth, innerHeight: window.innerHeight, scrollWidth, hasHorizontalScroll },
          sidebarToggle: toggleRect ? { width: toggleRect.width, height: toggleRect.height, meets44px: toggleRect.height >= 44 && toggleRect.width >= 44 } : null,
          banner: bannerRect ? { top: bannerRect.top, bottom: bannerRect.bottom, height: bannerRect.height, width: bannerRect.width } : null,
          statCards,
          progressWidget: progressContainer ? { width: progressContainer.width, height: progressContainer.height } : null,
          referCard: referRect ? {
            top: referRect.top,
            bottom: referRect.bottom,
            height: referRect.height,
            visibleAboveFold: referRect.bottom <= window.innerHeight,
            copyBtn: copyBtnRect ? { width: copyBtnRect.width, height: copyBtnRect.height, meets44px: copyBtnRect.height >= 44 } : null
          } : null,
          deadlinesCard: deadlinesRect ? { top: deadlinesRect.top, bottom: deadlinesRect.bottom, height: deadlinesRect.height } : null,
          quickAccessLinks,
          touchTargetsSummary: {
            total: touchTargets.length,
            below44px: touchTargets.filter(t => !t.meets44px)
          },
          overflowing
        };
      })()`,
      returnByValue: true
    });

    // Capture top fold screenshot
    const shotTop = await send('Page.captureScreenshot', { format: 'png' });
    const topPath = path.resolve('C:\\Users\\risha\\.gemini\\antigravity-ide\\brain\\529342f8-457d-4ded-b36e-02b74b21632a\\screenshots\\dashboard-iphone-se-top.png');
    fs.writeFileSync(topPath, Buffer.from(shotTop.data, 'base64'));
    console.log(`📸 Top screenshot saved to: ${topPath}`);

    // Scroll down to see lower fold
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 500)' });
    await sleep(1000);

    const shotBottom = await send('Page.captureScreenshot', { format: 'png' });
    const botPath = path.resolve('C:\\Users\\risha\\.gemini\\antigravity-ide\\brain\\529342f8-457d-4ded-b36e-02b74b21632a\\screenshots\\dashboard-iphone-se-scrolled.png');
    fs.writeFileSync(botPath, Buffer.from(shotBottom.data, 'base64'));
    console.log(`📸 Scrolled screenshot saved to: ${botPath}`);

    // Capture full page screenshot
    const fullMetrics = await send('Page.getLayoutMetrics');
    const fullHeight = Math.ceil(fullMetrics.contentSize.height);
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: fullHeight,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(500);

    const shotFull = await send('Page.captureScreenshot', { format: 'png' });
    const fullPath = path.resolve('C:\\Users\\risha\\.gemini\\antigravity-ide\\brain\\529342f8-457d-4ded-b36e-02b74b21632a\\screenshots\\dashboard-iphone-se-full.png');
    fs.writeFileSync(fullPath, Buffer.from(shotFull.data, 'base64'));
    console.log(`📸 Full page screenshot saved to: ${fullPath}`);

    await send('Page.close');
    ws.close();

    return metricsRes.result.value;
  } finally {
    chromeProcess.kill('SIGTERM');
  }
}

auditDashboard().then((metrics) => {
  console.log('\n📊 DASHBOARD AUDIT METRICS (iPhone SE 375x667):');
  console.log(JSON.stringify(metrics, null, 2));
}).catch((err) => {
  console.error('Dashboard audit failed:', err);
  process.exit(1);
});

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;
const USER_DATA_DIR = path.resolve(process.env.TEMP || 'C:\\temp', 'chrome-mobile-audit');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function auditScreen({
  url = 'http://localhost:5173/platform/login',
  width = 375,
  height = 667,
  deviceScaleFactor = 2,
  outputScreenshot = 'login-iphone-se-375x667.png'
}) {
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

    // Create a new tab
    const newTabRes = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
    const tab = await newTabRes.json();
    const wsUrl = tab.webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);

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

    // Enable Page and set device emulation
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor,
      mobile: true
    });

    // Wait for page to render
    await sleep(2500);

    // Evaluate checks
    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('.login-card-col') || document.querySelector('.login-grid-container > div:last-child');
        const cardRect = card ? card.getBoundingClientRect() : null;
        const cardStyle = card ? window.getComputedStyle(card) : null;

        const inputs = Array.from(document.querySelectorAll('input')).map(inp => {
          const rect = inp.getBoundingClientRect();
          const style = window.getComputedStyle(inp);
          return {
            id: inp.id || inp.name || inp.type,
            placeholder: inp.placeholder,
            width: rect.width,
            height: rect.height,
            fontSize: style.fontSize,
            padding: style.padding,
            boxSizing: style.boxSizing
          };
        });

        const buttons = Array.from(document.querySelectorAll('button')).map(btn => {
          const rect = btn.getBoundingClientRect();
          const style = window.getComputedStyle(btn);
          return {
            text: btn.innerText.trim(),
            width: rect.width,
            height: rect.height,
            top: rect.top,
            bottom: rect.bottom,
            visibleInViewport: rect.bottom <= window.innerHeight,
            fontSize: style.fontSize
          };
        });

        const backLink = document.querySelector('.login-back-link') || document.querySelector('a[href="/platform/"]');
        const backLinkRect = backLink ? backLink.getBoundingClientRect() : null;
        const backLinkStyle = backLink ? window.getComputedStyle(backLink) : null;

        let backLinkOverlapsCard = false;
        if (backLinkRect && cardRect) {
          backLinkOverlapsCard = !(
            backLinkRect.right < cardRect.left ||
            backLinkRect.left > cardRect.right ||
            backLinkRect.bottom < cardRect.top ||
            backLinkRect.top > cardRect.bottom
          );
        }

        // Check horizontal overflow
        const docWidth = document.documentElement.offsetWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const hasHorizontalScroll = scrollWidth > window.innerWidth || bodyScrollWidth > window.innerWidth;

        // Find elements that overflow 375px
        const allElements = Array.from(document.querySelectorAll('*'));
        const overflowing = allElements
          .filter(el => {
            const r = el.getBoundingClientRect();
            return r.right > window.innerWidth + 1;
          })
          .map(el => ({
            tag: el.tagName,
            className: el.className,
            right: el.getBoundingClientRect().right,
            width: el.getBoundingClientRect().width
          }))
          .slice(0, 10);

        return {
          window: {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            docWidth,
            scrollWidth,
            bodyScrollWidth,
            hasHorizontalScroll
          },
          card: cardRect ? {
            left: cardRect.left,
            right: cardRect.right,
            top: cardRect.top,
            bottom: cardRect.bottom,
            width: cardRect.width,
            height: cardRect.height,
            marginLeft: cardStyle ? cardStyle.marginLeft : null,
            marginRight: cardStyle ? cardStyle.marginRight : null,
            isHorizontallyCentered: Math.abs((window.innerWidth - cardRect.width) / 2 - cardRect.left) < 4,
            isVerticallyCentered: cardRect.top > 0 && cardRect.bottom <= window.innerHeight
          } : null,
          inputs,
          buttons,
          backLink: backLinkRect ? {
            top: backLinkRect.top,
            left: backLinkRect.left,
            width: backLinkRect.width,
            height: backLinkRect.height,
            fontSize: backLinkStyle ? backLinkStyle.fontSize : null,
            overlapsCard: backLinkOverlapsCard
          } : null,
          overflowing
        };
      })()`,
      returnByValue: true
    });

    // Capture screenshot
    const screenshotRes = await send('Page.captureScreenshot', {
      format: 'png'
    });

    const targetArtifactPath = path.resolve(
      'C:\\Users\\risha\\.gemini\\antigravity-ide\\brain\\529342f8-457d-4ded-b36e-02b74b21632a\\screenshots',
      outputScreenshot
    );
    fs.writeFileSync(targetArtifactPath, Buffer.from(screenshotRes.data, 'base64'));
    console.log(`📸 Screenshot saved to: ${targetArtifactPath}`);

    // Close tab
    await send('Page.close');
    ws.close();

    return {
      metrics: evalResult.result.value,
      screenshotPath: targetArtifactPath
    };
  } finally {
    chromeProcess.kill('SIGTERM');
  }
}

// Direct execution
if (process.argv[1]?.endsWith('audit-mobile.js')) {
  auditScreen({
    url: 'http://localhost:5173/platform/login',
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    outputScreenshot: 'login-iphone-se-375x667.png'
  }).then((res) => {
    console.log('\n📊 AUDIT REPORT (iPhone SE 375x667):');
    console.log(JSON.stringify(res.metrics, null, 2));
  }).catch((err) => {
    console.error('Audit failed:', err);
    process.exit(1);
  });
}

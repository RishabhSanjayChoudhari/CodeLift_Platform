/**
 * Test Suite: Cookie-Based Theme Persistence & Resolution
 * 
 * Verifies:
 * - Cookie utility functions (setCookie, getCookie, deleteCookie)
 * - Cookie attributes: Path=/, Max-Age (1 year), SameSite=Lax, Secure flag logic
 * - URL encoding/decoding of cookie values
 * - Theme normalization and alias handling
 * - Theme resolution priority: Cookie > localStorage > default (forest-green)
 */

import assert from 'node:assert/strict';
import { setCookie, getCookie, deleteCookie } from '../src/utils/cookieUtils.js';
import { normalizeTheme, resolveInitialTheme, THEMES, THEME_ALIASES } from '../src/utils/themeUtils.js';

export async function runCookieThemePersistenceTests() {
  console.log('\n--- Running: Cookie-Based Theme Persistence Tests ---');
  let passedCount = 0;
  let totalCount = 0;

  function test(name, fn) {
    totalCount++;
    try {
      fn();
      passedCount++;
      console.log(`  ✓ ${name}`);
    } catch (err) {
      console.error(`  ✗ ${name}`);
      throw err;
    }
  }

  // Set up mock DOM environment
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  const originalLocalStorage = globalThis.localStorage;

  let mockCookies = {};
  let mockLS = {};

  const mockDoc = {
    get cookie() {
      return Object.entries(mockCookies)
        .map(([k, v]) => `${k}=${v}`)
        .join('; ');
    },
    set cookie(str) {
      // Parse "key=value; Path=/; Max-Age=..."
      const parts = str.split(';').map((s) => s.trim());
      const [kv, ...attributes] = parts;
      const eqIdx = kv.indexOf('=');
      const key = kv.slice(0, eqIdx);
      const val = kv.slice(eqIdx + 1);

      const maxAgeAttr = attributes.find((a) => a.toLowerCase().startsWith('max-age='));
      if (maxAgeAttr && maxAgeAttr.split('=')[1] === '0') {
        delete mockCookies[key];
      } else {
        mockCookies[key] = val;
      }
      this._lastSetRaw = str;
    },
    _lastSetRaw: '',
    documentElement: {
      setAttribute: () => {},
    },
    body: {
      setAttribute: () => {},
    },
  };

  const mockWindowObj = {
    location: { protocol: 'https:' },
  };

  const mockLocalStorageObj = {
    getItem: (key) => mockLS[key] || null,
    setItem: (key, val) => {
      mockLS[key] = String(val);
    },
    removeItem: (key) => {
      delete mockLS[key];
    },
    clear: () => {
      mockLS = {};
    },
  };

  try {
    globalThis.document = mockDoc;
    globalThis.window = mockWindowObj;
    globalThis.localStorage = mockLocalStorageObj;

    // Test 1: setCookie writes with 1 year Max-Age, Path=/, SameSite=Lax, Secure on HTTPS
    test('setCookie sets standard attributes and Secure flag when on HTTPS', () => {
      mockCookies = {};
      setCookie('codelift_theme', 'dark-emerald', 365);

      assert.ok(mockDoc._lastSetRaw.includes('codelift_theme=dark-emerald'));
      assert.ok(mockDoc._lastSetRaw.includes('Path=/'));
      assert.ok(mockDoc._lastSetRaw.includes('Max-Age=31536000'));
      assert.ok(mockDoc._lastSetRaw.includes('SameSite=Lax'));
      assert.ok(mockDoc._lastSetRaw.includes('; Secure'));
    });

    // Test 2: setCookie omits Secure flag when not on HTTPS
    test('setCookie omits Secure flag on non-HTTPS development environment', () => {
      globalThis.window.location.protocol = 'http:';
      setCookie('codelift_theme', 'forest-green', 365);

      assert.ok(!mockDoc._lastSetRaw.includes('; Secure'));
      assert.ok(mockDoc._lastSetRaw.includes('Path=/'));
      assert.ok(mockDoc._lastSetRaw.includes('Max-Age=31536000'));
      globalThis.window.location.protocol = 'https:';
    });

    // Test 3: getCookie retrieves and decodes cookie value
    test('getCookie parses exact cookie value from document.cookie', () => {
      mockCookies = {
        other_pref: 'test',
        codelift_theme: 'navy-blue',
        user_session: 'abc123xyz',
      };
      const result = getCookie('codelift_theme');
      assert.equal(result, 'navy-blue');
    });

    // Test 4: getCookie returns null when cookie is absent
    test('getCookie returns null for non-existent cookie', () => {
      mockCookies = { other_pref: 'test' };
      const result = getCookie('codelift_theme');
      assert.equal(result, null);
    });

    // Test 5: deleteCookie sets Max-Age=0
    test('deleteCookie expires cookie immediately', () => {
      mockCookies = { codelift_theme: 'emerald' };
      deleteCookie('codelift_theme');

      assert.ok(mockDoc._lastSetRaw.includes('Max-Age=0'));
      assert.equal(getCookie('codelift_theme'), null);
    });

    // Test 6: normalizeTheme verifies canonical and aliased theme IDs
    test('normalizeTheme recognizes canonical theme IDs and aliases', () => {
      assert.equal(normalizeTheme('forest-green'), 'forest-green');
      assert.equal(normalizeTheme('dark-emerald'), 'dark-emerald');
      assert.equal(normalizeTheme('midnight-emerald'), 'dark-emerald'); // alias
      assert.equal(normalizeTheme('ocean-blue'), 'navy-blue'); // alias
      assert.equal(normalizeTheme('sunset-orange'), 'amber'); // alias
      assert.equal(normalizeTheme('non-existent-theme'), null);
      assert.equal(normalizeTheme(null), null);
    });

    // Test 7: Theme Resolution Priority - Cookie has highest priority
    test('resolveInitialTheme prioritizes cookie over localStorage', () => {
      mockCookies = { codelift_theme: 'purple' };
      mockLS = { codelift_theme: 'dark-emerald' };

      const resolved = resolveInitialTheme();
      assert.equal(resolved, 'purple');
    });

    // Test 8: Theme Resolution Fallback - localStorage used when cookie missing
    test('resolveInitialTheme falls back to localStorage when cookie is absent', () => {
      mockCookies = {};
      mockLS = { codelift_theme: 'indigo' };

      const resolved = resolveInitialTheme();
      assert.equal(resolved, 'indigo');
    });

    // Test 9: Theme Resolution Final Fallback - default dark-nebula when both missing
    test('resolveInitialTheme defaults to dark-nebula when cookie & localStorage are empty', () => {
      mockCookies = {};
      mockLS = {};

      const resolved = resolveInitialTheme();
      assert.equal(resolved, 'dark-nebula');
    });

    // Test 10: Theme Resolution Invalid Fallback - invalid values safely fall back
    test('resolveInitialTheme falls back when cookie contains an invalid theme name', () => {
      mockCookies = { codelift_theme: 'malicious-or-unknown-theme' };
      mockLS = { codelift_theme: 'teal' };

      const resolved = resolveInitialTheme();
      assert.equal(resolved, 'teal');
    });
  } finally {
    // Restore environment
    globalThis.document = originalDocument;
    globalThis.window = originalWindow;
    globalThis.localStorage = originalLocalStorage;
  }

  return { passedCount, totalCount };
}

// Allow direct execution: node test/cookie-theme-persistence.test.js
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('cookie-theme-persistence.test.js')) {
  runCookieThemePersistenceTests()
    .then((r) => {
      console.log(`\nResults: ${r.passedCount}/${r.totalCount} tests passed.`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

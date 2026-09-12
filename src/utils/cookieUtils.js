/**
 * Cookie Utilities for CodeLift
 * Dependency-free helpers for setting, getting, and deleting browser cookies.
 */

/**
 * Set a cookie with standard options.
 * @param {string} name - Cookie key
 * @param {string} value - Cookie value
 * @param {number} days - Lifespan in days (default 365)
 */
export function setCookie(name, value, days = 365) {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${name}=${encodeURIComponent(value)}` +
    `; Path=/` +
    `; Max-Age=${maxAge}` +
    `; SameSite=Lax` +
    secure;
}

/**
 * Read a cookie by name.
 * @param {string} name - Cookie key
 * @returns {string|null} Decoded cookie value, or null if not found
 */
export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Delete a cookie by expiring it immediately.
 * @param {string} name - Cookie key
 */
export function deleteCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

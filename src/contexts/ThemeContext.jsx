import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getCookie, setCookie } from '../utils/cookieUtils';
import {
  THEMES,
  THEME_ALIASES,
  DEFAULT_THEME,
  COOKIE_NAME,
  LS_KEY,
  normalizeTheme,
  resolveInitialTheme,
  applyTheme,
} from '../utils/themeUtils';

export { THEMES, THEME_ALIASES, normalizeTheme, resolveInitialTheme, applyTheme };

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(resolveInitialTheme);

  // Apply on mount + on change: sync to DOM, cookie, and localStorage
  useEffect(() => {
    applyTheme(theme);
    setCookie(COOKIE_NAME, theme, 365);
    try {
      localStorage.setItem(LS_KEY, theme);
    } catch (e) {}
  }, [theme]);

  // Cross-tab sync via localStorage storage event
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_KEY && e.newValue) {
        const validated = normalizeTheme(e.newValue);
        if (validated) {
          setThemeState(validated);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Poll cookie every 5s to catch cookie-only changes across sessions/tabs
  useEffect(() => {
    const interval = setInterval(() => {
      const cookieTheme = normalizeTheme(getCookie(COOKIE_NAME));
      if (cookieTheme && cookieTheme !== theme) {
        setThemeState(cookieTheme);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [theme]);

  const setTheme = useCallback((next) => {
    const validated = normalizeTheme(next);
    if (!validated) return;
    setThemeState(validated);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentTheme: theme,
        setTheme,
        themes: THEMES,
        availableThemes: THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

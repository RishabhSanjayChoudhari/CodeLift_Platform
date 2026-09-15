import { supabase, isSupabaseConfigured } from './supabaseClient';

const LOCAL_STORAGE_LOGS_KEY = 'codelift_error_logs_cache';
const MAX_LOCAL_LOGS = 100;

function getLocalLogs() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalLog(entry) {
  try {
    const logs = getLocalLogs();
    const updated = [entry, ...logs].slice(0, MAX_LOCAL_LOGS);
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('[Logger] Failed to write local log:', err);
  }
}

const isConfigured = () => (typeof isSupabaseConfigured === 'function' ? isSupabaseConfigured() : Boolean(isSupabaseConfigured));

let isLoggingInternal = false;
const errorThrottleMap = new Map(); // key -> { timestamp, count }
const THROTTLE_WINDOW_MS = 2500;

/**
 * Log an error to Supabase database with local storage backup.
 */
export async function logError(error, context = {}) {
  // Prevent infinite loop if logging itself triggers an unhandled error/rejection
  if (isLoggingInternal) {
    return null;
  }

  const message = error?.message || (typeof error === 'string' ? error : 'Unknown error');
  const stack = error?.stack || null;
  const level = context.level || 'error';
  const source = context.source || 'client';
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const userId = context.userId || null;
  const userRole = context.userRole || null;

  // Throttle identical error spam (prevents 26k identical loop crashes)
  const throttleKey = `${level}:${message}:${source}`;
  const now = Date.now();
  const existingThrottle = errorThrottleMap.get(throttleKey);
  if (existingThrottle && (now - existingThrottle.timestamp) < THROTTLE_WINDOW_MS) {
    existingThrottle.count += 1;
    return null;
  }
  errorThrottleMap.set(throttleKey, { timestamp: now, count: 1 });

  // Clean old throttle keys periodically
  if (errorThrottleMap.size > 200) {
    for (const [k, v] of errorThrottleMap.entries()) {
      if (now - v.timestamp > 10000) errorThrottleMap.delete(k);
    }
  }

  const logEntry = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    level,
    message,
    stack,
    context: typeof context === 'object' ? context : { detail: context },
    source,
    url,
    user_id: userId,
    user_role: userRole,
    created_at: new Date().toISOString()
  };

  try {
    isLoggingInternal = true;

    // Always save locally first
    saveLocalLog(logEntry);

    // Sync to Supabase if configured
    if (isConfigured()) {
      try {
        const { error: dbError } = await supabase
          .from('error_logs')
          .insert({
            level: logEntry.level,
            message: logEntry.message,
            stack: logEntry.stack,
            context: logEntry.context,
            source: logEntry.source,
            url: logEntry.url,
            user_id: logEntry.user_id,
            user_role: logEntry.user_role,
            created_at: logEntry.created_at
          });

        if (dbError) {
          console.warn('[Logger] Supabase error_logs write deferred:', dbError.message);
        }
      } catch (err) {
        console.warn('[Logger] Could not send log to Supabase:', err);
      }
    }
  } catch (outerErr) {
    console.warn('[Logger] logError internal failure:', outerErr);
  } finally {
    isLoggingInternal = false;
  }

  return logEntry;
}

/**
 * Log a warning to Supabase database.
 */
export async function logWarn(message, context = {}) {
  return logError(new Error(message), { ...context, level: 'warn' });
}

/**
 * Fetch error logs from Supabase with local fallback.
 */
export async function fetchErrorLogs() {
  const localLogs = getLocalLogs();

  if (!isConfigured()) {
    return localLogs;
  }

  try {
    const { data, error } = await supabase
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      console.warn('[Logger] Failed to fetch error_logs from Supabase:', error.message);
      return localLogs;
    }

    if (Array.isArray(data) && data.length > 0) {
      // Merge unique by message + created_at
      const map = new Map();
      data.forEach(item => map.set(item.id || `${item.created_at}-${item.message}`, item));
      localLogs.forEach(item => {
        const key = item.id || `${item.created_at}-${item.message}`;
        if (!map.has(key)) map.set(key, item);
      });
      return Array.from(map.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return localLogs;
  } catch (err) {
    console.warn('[Logger] Error fetching logs from Supabase:', err);
    return localLogs;
  }
}

/**
 * Clear all error logs from Supabase and local cache.
 */
export async function clearErrorLogs() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_LOGS_KEY);
  } catch {}

  if (isConfigured()) {
    try {
      const { error } = await supabase
        .from('error_logs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all rows

      if (error) {
        console.warn('[Logger] Clear Supabase error_logs failed:', error.message);
      }
    } catch (err) {
      console.warn('[Logger] Could not clear Supabase error logs:', err);
    }
  }

  return true;
}

/**
 * Delete a single error log by ID.
 */
export async function deleteErrorLog(id) {
  try {
    const logs = getLocalLogs().filter(l => l.id !== id);
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(logs));
  } catch {}

  if (isConfigured() && id) {
    try {
      await supabase.from('error_logs').delete().eq('id', id);
    } catch (err) {
      console.warn('[Logger] Could not delete single log from Supabase:', err);
    }
  }

  return true;
}

// Global unhandled error listeners
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // Avoid recursion or logging from within loggerService
    if (isLoggingInternal) return;
    if (event.filename && event.filename.includes('loggerService')) return;
    logError(event.error || event.message, {
      source: 'uncaught-error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (isLoggingInternal) return;
    const reason = event.reason;
    if (reason && typeof reason.message === 'string' && reason.message.includes('loggerService')) return;
    logError(reason || 'Unhandled Promise Rejection', {
      source: 'unhandled-promise-rejection'
    });
  });
}

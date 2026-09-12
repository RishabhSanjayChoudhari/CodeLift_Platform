// ── GitHub Data Service (Data Layer Abstraction) ───────────────────────────

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
const REPO_OWNER = import.meta.env.VITE_REPO_OWNER || '';
const REPO_NAME = import.meta.env.VITE_REPO_NAME || '';

export const COLLECTIONS = [
  'users',
  'students',
  'categories',
  'courses',
  'enrollments',
  'coupons',
  'reviews',
  'discussions',
  'payments',
  'batches',
  'fees',
  'tests',
  'attempts',
  'assignments',
  'submissions',
  'certificates',
  'certificateTemplates',
  'completedBatches',
  'problemAttempts',
  'notifications'
];

/**
 * Base64 helper for UTF-8 compatibility
 */
function utf8ToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(str) {
  return decodeURIComponent(escape(atob(str)));
}

/**
 * Retrieves storage key for local caching
 */
function getStorageKey(collectionName) {
  return `codelift_data_${collectionName}`;
}

/**
 * Retrieves current SHA of a file on GitHub repository
 */
export async function getFileSHA(collectionName) {
  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) return null;
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/${collectionName}.json`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    if (res.ok) {
      const json = await res.json();
      return json.sha;
    }
  } catch (err) {
    console.warn(`[GitHubDataService] getFileSHA error for ${collectionName}:`, err);
  }
  return null;
}

/**
 * Reads a single collection from GitHub API with fallback to localStorage
 */
export async function readCollection(collectionName) {
  const localKey = getStorageKey(collectionName);
  
  // Try fetching from GitHub API if configured
  if (GITHUB_TOKEN && REPO_OWNER && REPO_NAME) {
    try {
      const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/${collectionName}.json`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });

      if (res.ok) {
        const fileData = await res.json();
        const decodedContent = base64ToUtf8(fileData.content.replace(/\n/g, ''));
        const parsed = JSON.parse(decodedContent);
        // Cache to localStorage
        localStorage.setItem(localKey, JSON.stringify(parsed));
        return parsed;
      }
    } catch (err) {
      console.warn(`[GitHubDataService] GitHub fetch failed for ${collectionName}, falling back to localStorage:`, err);
    }
  }

  // LocalStorage fallback
  try {
    const cached = localStorage.getItem(localKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (_) {}

  return [];
}

/**
 * Writes updated data to a collection in localStorage and syncs with GitHub API asynchronously
 */
export async function writeCollection(collectionName, data) {
  const localKey = getStorageKey(collectionName);
  
  // 1. Immediately update localStorage cache
  try {
    localStorage.setItem(localKey, JSON.stringify(data));
  } catch (err) {
    console.error(`[GitHubDataService] LocalStorage write failed for ${collectionName}:`, err);
  }

  // 2. Sync with GitHub API if credentials exist
  if (GITHUB_TOKEN && REPO_OWNER && REPO_NAME) {
    try {
      const sha = await getFileSHA(collectionName);
      const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/${collectionName}.json`;
      
      const contentStr = JSON.stringify(data, null, 2);
      const base64Content = utf8ToBase64(contentStr);

      const body = {
        message: `update: data/${collectionName}.json via CodeLift App [auto-sync]`,
        content: base64Content,
        branch: 'main'
      };

      if (sha) {
        body.sha = sha;
      }

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        console.log(`[GitHubDataService] Synced ${collectionName}.json to GitHub successfully.`);
      } else {
        const errorRes = await res.json();
        console.warn(`[GitHubDataService] GitHub PUT ${collectionName} warning:`, errorRes);
      }
    } catch (err) {
      console.error(`[GitHubDataService] GitHub write error for ${collectionName}:`, err);
    }
  }
}

/**
 * Synchronizes all collections across GitHub and local storage
 */
export async function syncData() {
  const result = {};
  for (const name of COLLECTIONS) {
    result[name] = await readCollection(name);
  }
  return result;
}

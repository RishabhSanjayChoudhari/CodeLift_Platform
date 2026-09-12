import fs from 'fs';
import path from 'path';
import { supabaseAdmin, BUCKET_NAME } from './supabase.js';

/**
 * Check if the bucket exists; if not, create it
 */
export async function ensureBucketExists() {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (buckets && !buckets.some((b) => b.name === BUCKET_NAME)) {
      await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 52428800
      });
    }
  } catch (err) {
    console.warn(`[Storage] Could not ensure bucket exists:`, err.message);
  }
}

/**
 * Fallback to read default seed JSON from filesystem if storage is unpopulated
 */
function getLocalSeed(fileName) {
  try {
    const localPath = path.resolve(process.cwd(), 'supabase/storage', fileName);
    if (fs.existsSync(localPath)) {
      const content = fs.readFileSync(localPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    // Ignore fallback errors
  }
  return [];
}

/**
 * Read and parse JSON file from Supabase Storage 'app-data' bucket.
 * Automatically provisions missing files with seed defaults.
 */
export async function readJSON(fileName, { withMeta = false } = {}) {
  try {
    const { data, error } = await supabaseAdmin.storage.from(BUCKET_NAME).download(fileName);

    if (error) {
      console.warn(`[Storage] File not found in bucket: ${fileName}. Checking local seed...`);
      const defaultData = getLocalSeed(fileName);
      // Auto-initialize in storage so subsequent calls find it
      await writeJSON(fileName, defaultData).catch(() => {});
      return withMeta ? { data: defaultData, version: 1, etag: null } : defaultData;
    }

    const text = await data.text();
    const parsed = JSON.parse(text);

    if (withMeta) {
      const etag = data.type || null;
      return {
        data: parsed,
        version: Date.now(),
        etag
      };
    }

    return parsed;
  } catch (err) {
    console.error(`[Storage] Error reading ${fileName}:`, err.message);
    const defaultData = getLocalSeed(fileName);
    return withMeta ? { data: defaultData, version: 1, etag: null } : defaultData;
  }
}

/**
 * Write JSON file to Supabase Storage 'app-data' bucket with optimistic concurrency control.
 *
 * @param {string} fileName - Target file in bucket (e.g. 'students.json')
 * @param {any} data - Array or object to store
 * @param {object} options - Options including optimistic lock retries
 */
export async function writeJSON(fileName, data, { maxRetries = 3, expectedEtag = null } = {}) {
  let attempts = 0;

  while (attempts < maxRetries) {
    attempts++;
    try {
      const jsonString = JSON.stringify(data, null, 2);

      const uploadOptions = {
        cacheControl: '0',
        upsert: true,
        contentType: 'application/json'
      };

      const { error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(fileName, jsonString, uploadOptions);

      if (error) {
        // If bucket does not exist, create it and retry
        if (error.message?.toLowerCase().includes('bucket not found') || error.statusCode === 404) {
          await ensureBucketExists();
          continue;
        }
        throw error;
      }

      return true;
    } catch (err) {
      console.warn(`[Storage] Write attempt ${attempts} failed for ${fileName}:`, err.message);
      if (attempts >= maxRetries) {
        throw new Error(`Failed to write ${fileName} after ${maxRetries} attempts: ${err.message}`);
      }
      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, attempts)));
    }
  }

  return false;
}

/**
 * Read raw markdown or text from Storage
 */
export async function readText(fileName) {
  try {
    const { data, error } = await supabaseAdmin.storage.from(BUCKET_NAME).download(fileName);
    if (error) {
      // Check local seed
      const localPath = path.resolve(process.cwd(), 'supabase/storage', fileName);
      if (fs.existsSync(localPath)) {
        return fs.readFileSync(localPath, 'utf-8');
      }
      return '';
    }
    return await data.text();
  } catch (err) {
    console.error(`[Storage] Error reading text ${fileName}:`, err.message);
    return '';
  }
}

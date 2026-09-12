import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { readJSON } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const batches = await readJSON('batches.json').catch(() => []);
    return jsonResponse(res, 200, {
      batches
    });
  } catch (err) {
    return errorResponse(res, 500, 'Failed to fetch batches', err.message);
  }
}

import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { readJSON, readText } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const { batchId, descriptionUrl } = req.query || {};

    if (descriptionUrl) {
      const description = await readText(descriptionUrl);
      return jsonResponse(res, 200, {
        description
      });
    }

    let assignments = await readJSON('assignments.json').catch(() => []);

    if (batchId) {
      assignments = assignments.filter(
        (a) => !a.batchIds || a.batchIds.length === 0 || a.batchIds.includes(batchId)
      );
    }

    return jsonResponse(res, 200, {
      assignments
    });
  } catch (err) {
    return errorResponse(res, 500, 'Failed to fetch assignments', err.message);
  }
}

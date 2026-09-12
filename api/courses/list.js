import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { readJSON, readText } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const { contentUrl } = req.query || {};

    // If client requested specific markdown content
    if (contentUrl) {
      const markdown = await readText(contentUrl);
      return jsonResponse(res, 200, {
        content: markdown
      });
    }

    const courses = await readJSON('courses.json').catch(() => []);
    return jsonResponse(res, 200, {
      courses
    });
  } catch (err) {
    return errorResponse(res, 500, 'Failed to fetch courses', err.message);
  }
}

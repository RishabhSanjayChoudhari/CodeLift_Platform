import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { requireAdmin } from '../_lib/auth.js';
import { readJSON, writeJSON } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  return requireAdmin(async (req, res) => {
    try {
      const { courses } = req.body || {};

      if (!Array.isArray(courses)) {
        return errorResponse(res, 400, 'Invalid courses array');
      }

      await writeJSON('courses.json', courses);

      return jsonResponse(res, 200, {
        message: 'Courses saved successfully',
        courses
      });
    } catch (err) {
      return errorResponse(res, 500, 'Failed to update courses', err.message);
    }
  })(req, res);
}

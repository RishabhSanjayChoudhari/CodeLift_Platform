import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { requireAdmin } from '../_lib/auth.js';
import { readJSON } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  return requireAdmin(async (req, res) => {
    try {
      const { batchId } = req.query || {};
      let students = await readJSON('students.json').catch(() => []);

      if (batchId) {
        students = students.filter((s) => s.batchId === batchId);
      }

      return jsonResponse(res, 200, {
        students,
        total: students.length
      });
    } catch (err) {
      return errorResponse(res, 500, 'Failed to fetch students', err.message);
    }
  })(req, res);
}

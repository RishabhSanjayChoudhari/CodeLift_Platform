import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { requireAuth } from '../_lib/auth.js';
import { readJSON } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  return requireAuth(async (req, res) => {
    try {
      const { studentId } = req.query || {};
      const fees = await readJSON('fees.json').catch(() => []);

      let filteredFees;
      if (req.user.isAdmin) {
        filteredFees = studentId ? fees.filter((f) => f.studentId === studentId) : fees;
      } else {
        filteredFees = fees.filter((f) => f.studentId === req.user.id);
      }

      return jsonResponse(res, 200, {
        fees: filteredFees
      });
    } catch (err) {
      return errorResponse(res, 500, 'Failed to fetch fees', err.message);
    }
  })(req, res);
}

import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  return requireAuth(async (req, res) => {
    return jsonResponse(res, 200, {
      user: req.user,
      isAdmin: req.user.isAdmin,
      student: req.user.student
    });
  })(req, res);
}

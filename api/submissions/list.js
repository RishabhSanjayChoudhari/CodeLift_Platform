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
      const { assignmentId, studentId } = req.query || {};
      let submissions = await readJSON('submissions.json').catch(() => []);

      if (req.user.isAdmin) {
        if (assignmentId) {
          submissions = submissions.filter((s) => s.assignmentId === assignmentId);
        }
        if (studentId) {
          submissions = submissions.filter((s) => s.studentId === studentId);
        }
      } else {
        // Normal student only views their own submissions
        submissions = submissions.filter((s) => s.studentId === req.user.id);
        if (assignmentId) {
          submissions = submissions.filter((s) => s.assignmentId === assignmentId);
        }
      }

      return jsonResponse(res, 200, {
        submissions
      });
    } catch (err) {
      return errorResponse(res, 500, 'Failed to fetch submissions', err.message);
    }
  })(req, res);
}

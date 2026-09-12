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
      const { submissionId, grade, feedback } = req.body || {};

      if (!submissionId || grade === undefined) {
        return errorResponse(res, 400, 'Missing submissionId or grade');
      }

      const submissions = await readJSON('submissions.json').catch(() => []);
      const index = submissions.findIndex((s) => s.id === submissionId);

      if (index === -1) {
        return errorResponse(res, 404, 'Submission not found');
      }

      submissions[index] = {
        ...submissions[index],
        grade: Number(grade),
        feedback: feedback || submissions[index].feedback || '',
        gradedAt: new Date().toISOString()
      };

      await writeJSON('submissions.json', submissions);

      return jsonResponse(res, 200, {
        message: 'Grade published successfully',
        submission: submissions[index]
      });
    } catch (err) {
      return errorResponse(res, 500, 'Failed to publish grade', err.message);
    }
  })(req, res);
}

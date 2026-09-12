import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { requireAuth } from '../_lib/auth.js';
import { readJSON, writeJSON } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  return requireAuth(async (req, res) => {
    try {
      const { assignmentId, fileUrls } = req.body || {};

      if (!assignmentId || !fileUrls || !Array.isArray(fileUrls) || fileUrls.length === 0) {
        return errorResponse(res, 400, 'Missing required fields: assignmentId and at least one fileUrl');
      }

      // Check assignment and verify deadline
      const assignments = await readJSON('assignments.json').catch(() => []);
      const assignment = assignments.find((a) => a.id === assignmentId);

      if (!assignment) {
        return errorResponse(res, 404, 'Assignment not found');
      }

      const now = new Date();
      const deadline = new Date(assignment.deadline);
      if (now > deadline) {
        return errorResponse(
          res,
          400,
          `Submission deadline has passed. Deadline was ${deadline.toLocaleString()}`
        );
      }

      const submissions = await readJSON('submissions.json').catch(() => []);
      const existingIndex = submissions.findIndex(
        (s) => s.studentId === req.user.id && s.assignmentId === assignmentId
      );

      let submissionRecord;

      if (existingIndex >= 0) {
        // Re-submission before deadline
        submissionRecord = {
          ...submissions[existingIndex],
          fileUrls,
          submittedAt: now.toISOString(),
          grade: null, // Reset grade on new submission
          feedback: null
        };
        submissions[existingIndex] = submissionRecord;
      } else {
        submissionRecord = {
          id: `sub-${Date.now()}-${req.user.id.slice(0, 8)}`,
          studentId: req.user.id,
          assignmentId,
          fileUrls,
          submittedAt: now.toISOString(),
          grade: null,
          feedback: null
        };
        submissions.push(submissionRecord);
      }

      await writeJSON('submissions.json', submissions);

      return jsonResponse(res, 201, {
        message: 'Assignment submitted successfully',
        submission: submissionRecord
      });
    } catch (err) {
      return errorResponse(res, 500, 'Failed to submit assignment', err.message);
    }
  })(req, res);
}

import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { readJSON } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const feedbackList = await readJSON('feedback.json').catch(() => []);
    // For public consumption, hide anonymous names
    const sanitized = feedbackList.map((f) => ({
      id: f.id,
      rating: f.rating,
      comment: f.comment,
      studentName: f.isAnonymous ? 'Verified Student' : (f.studentName || 'Student'),
      createdAt: f.createdAt || f.submittedAt
    }));

    return jsonResponse(res, 200, {
      feedback: sanitized
    });
  } catch (err) {
    return errorResponse(res, 500, 'Failed to fetch feedback', err.message);
  }
}

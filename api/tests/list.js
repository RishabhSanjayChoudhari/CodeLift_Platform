import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { readJSON } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const { testId, loadQuestions } = req.query || {};
    const tests = await readJSON('tests.json').catch(() => []);

    if (testId && loadQuestions) {
      const test = tests.find((t) => t.id === testId);
      if (!test) {
        return errorResponse(res, 404, 'Test not found');
      }

      const questionsBank = await readJSON(test.questionsUrl).catch(() => null);
      if (!questionsBank) {
        return errorResponse(res, 404, 'Questions bank not found');
      }

      // Strip correct answers when sending to client test taker
      const sanitizedQuestions = (questionsBank.questions || []).map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options
      }));

      return jsonResponse(res, 200, {
        test,
        questions: sanitizedQuestions,
        totalQuestions: sanitizedQuestions.length
      });
    }

    return jsonResponse(res, 200, {
      tests
    });
  } catch (err) {
    return errorResponse(res, 500, 'Failed to fetch tests', err.message);
  }
}

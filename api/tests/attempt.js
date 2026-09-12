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
      const { testId, answers = {} } = req.body || {};

      if (!testId) {
        return errorResponse(res, 400, 'Missing testId');
      }

      const tests = await readJSON('tests.json').catch(() => []);
      const test = tests.find((t) => t.id === testId);

      if (!test) {
        return errorResponse(res, 404, 'Test not found');
      }

      const questionsBank = await readJSON(test.questionsUrl).catch(() => null);
      if (!questionsBank || !Array.isArray(questionsBank.questions)) {
        return errorResponse(res, 500, 'Test question paper could not be loaded');
      }

      const questions = questionsBank.questions;
      let correctCount = 0;
      const breakdown = [];

      for (const q of questions) {
        const studentChoice = answers[q.id];
        const isCorrect = studentChoice !== undefined && Number(studentChoice) === Number(q.correctIndex);
        if (isCorrect) correctCount++;

        breakdown.push({
          questionId: q.id,
          selected: studentChoice,
          correct: q.correctIndex,
          isCorrect,
          explanation: q.explanation || ''
        });
      }

      const percentage = Math.round((correctCount / questions.length) * 100);
      const attemptId = `att-${Date.now()}-${req.user.id.slice(0, 6)}`;
      const attemptUrl = `content/attempts/${attemptId}.json`;

      // Save detailed attempt payload to Storage
      await writeJSON(attemptUrl, {
        attemptId,
        studentId: req.user.id,
        testId,
        score: percentage,
        correctCount,
        totalQuestions: questions.length,
        breakdown,
        submittedAt: new Date().toISOString()
      });

      // Append to attempts.json matching schema
      const attempts = await readJSON('attempts.json').catch(() => []);
      const attemptRecord = {
        id: attemptId,
        studentId: req.user.id,
        testId,
        attemptUrl,
        score: percentage,
        submittedAt: new Date().toISOString()
      };

      attempts.push(attemptRecord);
      await writeJSON('attempts.json', attempts);

      return jsonResponse(res, 201, {
        message: 'Test evaluated successfully',
        attempt: attemptRecord,
        correctCount,
        totalQuestions: questions.length,
        score: percentage,
        breakdown
      });
    } catch (err) {
      return errorResponse(res, 500, 'Failed to process test attempt', err.message);
    }
  })(req, res);
}

import crypto from 'crypto';
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
      const { title, descriptionUrl, deadline, maxMarks, type, batchIds } = req.body || {};

      if (!title || !deadline) {
        return errorResponse(res, 400, 'Missing required fields: title, deadline');
      }

      const assignments = await readJSON('assignments.json').catch(() => []);

      const newAssignment = {
        id: `asgn-${Date.now()}`,
        title,
        descriptionUrl: descriptionUrl || '',
        deadline,
        maxMarks: Number(maxMarks || 10),
        type: type || 'CODING',
        batchIds: Array.isArray(batchIds) ? batchIds : []
      };

      assignments.push(newAssignment);
      await writeJSON('assignments.json', assignments);

      return jsonResponse(res, 201, {
        message: 'Assignment created successfully',
        assignment: newAssignment
      });
    } catch (err) {
      return errorResponse(res, 500, 'Failed to create assignment', err.message);
    }
  })(req, res);
}

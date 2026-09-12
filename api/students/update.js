import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { requireAuth } from '../_lib/auth.js';
import { readJSON, writeJSON } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST' && req.method !== 'PUT') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  return requireAuth(async (req, res) => {
    try {
      const { studentId, updates } = req.body || {};
      const targetId = studentId || req.user.id;

      // If updating someone else, must be admin
      if (targetId !== req.user.id && !req.user.isAdmin) {
        return errorResponse(res, 403, 'Forbidden: Cannot update another student profile');
      }

      const students = await readJSON('students.json').catch(() => []);
      const index = students.findIndex((s) => s.id === targetId);

      if (index === -1) {
        return errorResponse(res, 404, 'Student record not found');
      }

      // Merge allowed fields
      const current = students[index];
      const updated = {
        ...current,
        name: updates.name !== undefined ? updates.name : current.name,
        phone: updates.phone !== undefined ? updates.phone : current.phone,
        progress: updates.progress !== undefined ? { ...current.progress, ...updates.progress } : current.progress,
        ...(req.user.isAdmin && {
          batchId: updates.batchId !== undefined ? updates.batchId : current.batchId,
          isActive: updates.isActive !== undefined ? updates.isActive : current.isActive
        })
      };

      students[index] = updated;
      await writeJSON('students.json', students);

      return jsonResponse(res, 200, {
        message: 'Student record updated successfully',
        student: updated
      });
    } catch (err) {
      return errorResponse(res, 500, 'Failed to update student', err.message);
    }
  })(req, res);
}

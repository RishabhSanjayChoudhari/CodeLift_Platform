import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { readJSON, writeJSON } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const { id, email, name, phone, batchId } = req.body || {};

    if (!id || !email) {
      return errorResponse(res, 400, 'Missing required fields: id and email');
    }

    const students = await readJSON('students.json').catch(() => []);
    const existingIndex = students.findIndex((s) => s.id === id || s.email?.toLowerCase() === email.toLowerCase());

    let studentRecord;

    if (existingIndex >= 0) {
      // Update existing record
      studentRecord = {
        ...students[existingIndex],
        id, // ensure correct auth id
        email: email.toLowerCase(),
        name: name || students[existingIndex].name || email.split('@')[0],
        phone: phone || students[existingIndex].phone || '',
        batchId: batchId || students[existingIndex].batchId || 'batch-alpha-2026'
      };
      students[existingIndex] = studentRecord;
    } else {
      // Create new student record
      studentRecord = {
        id,
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        phone: phone || '',
        batchId: batchId || 'batch-alpha-2026',
        progress: {},
        isActive: true,
        joinedAt: new Date().toISOString()
      };
      students.push(studentRecord);
    }

    await writeJSON('students.json', students);

    return jsonResponse(res, 200, {
      message: 'Student profile synced successfully',
      student: studentRecord
    });
  } catch (err) {
    console.error('[Sync Error]:', err);
    return errorResponse(res, 500, 'Failed to sync student profile', err.message);
  }
}

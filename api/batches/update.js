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
      const { id, name, capacity, fee, startDate, isActive } = req.body || {};

      if (!name || fee === undefined) {
        return errorResponse(res, 400, 'Missing required batch fields: name, fee');
      }

      const batches = await readJSON('batches.json').catch(() => []);
      let batchRecord;

      if (id) {
        const index = batches.findIndex((b) => b.id === id);
        if (index === -1) {
          return errorResponse(res, 404, 'Batch not found');
        }
        batchRecord = {
          ...batches[index],
          name,
          capacity: capacity !== undefined ? Number(capacity) : batches[index].capacity,
          fee: Number(fee),
          startDate: startDate || batches[index].startDate,
          isActive: isActive !== undefined ? isActive : batches[index].isActive
        };
        batches[index] = batchRecord;
      } else {
        batchRecord = {
          id: `batch-${Date.now()}`,
          name,
          capacity: Number(capacity || 30),
          fee: Number(fee),
          startDate: startDate || new Date().toISOString(),
          isActive: isActive !== undefined ? isActive : true
        };
        batches.push(batchRecord);
      }

      await writeJSON('batches.json', batches);

      return jsonResponse(res, 200, {
        message: 'Batch saved successfully',
        batch: batchRecord
      });
    } catch (err) {
      return errorResponse(res, 500, 'Failed to update batch', err.message);
    }
  })(req, res);
}

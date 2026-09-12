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
      const { amount, couponCode, studentId } = req.body || {};
      const targetStudentId = req.user.isAdmin && studentId ? studentId : req.user.id;

      let payableAmount = Number(amount || 5000);

      // Validate and apply coupon if provided
      if (couponCode) {
        const coupons = await readJSON('coupons.json').catch(() => []);
        const cIndex = coupons.findIndex(
          (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && !c.usedBy
        );

        if (cIndex >= 0) {
          payableAmount = Math.max(0, payableAmount - coupons[cIndex].discount);
          coupons[cIndex].usedBy = targetStudentId;
          await writeJSON('coupons.json', coupons);
        }
      }

      const fees = await readJSON('fees.json').catch(() => []);
      const feeRecord = {
        id: `fee-${Date.now()}-${targetStudentId.slice(0, 6)}`,
        studentId: targetStudentId,
        amount: payableAmount,
        paidAt: new Date().toISOString(),
        status: 'PAID'
      };

      fees.push(feeRecord);
      await writeJSON('fees.json', fees);

      return jsonResponse(res, 201, {
        message: 'Fee payment recorded successfully',
        fee: feeRecord
      });
    } catch (err) {
      return errorResponse(res, 500, 'Failed to record fee payment', err.message);
    }
  })(req, res);
}

import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { readJSON } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const { code } = req.body || {};

    if (!code) {
      return errorResponse(res, 400, 'Missing coupon code');
    }

    const coupons = await readJSON('coupons.json').catch(() => []);
    const normalizedCode = code.trim().toUpperCase();

    const coupon = coupons.find((c) => c.code.toUpperCase() === normalizedCode);

    if (!coupon) {
      return errorResponse(res, 404, 'Invalid coupon code');
    }

    if (coupon.usedBy) {
      return errorResponse(res, 400, 'This coupon code has already been redeemed');
    }

    if (coupon.expiry && new Date() > new Date(coupon.expiry)) {
      return errorResponse(res, 400, 'This coupon code has expired');
    }

    return jsonResponse(res, 200, {
      valid: true,
      code: coupon.code,
      discount: coupon.discount
    });
  } catch (err) {
    return errorResponse(res, 500, 'Failed to validate coupon', err.message);
  }
}

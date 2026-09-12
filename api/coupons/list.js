import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { requireAdmin } from '../_lib/auth.js';
import { readJSON, writeJSON } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    return requireAdmin(async (req, res) => {
      try {
        const coupons = await readJSON('coupons.json').catch(() => []);
        return jsonResponse(res, 200, { coupons });
      } catch (err) {
        return errorResponse(res, 500, 'Failed to fetch coupons', err.message);
      }
    })(req, res);
  }

  if (req.method === 'POST') {
    return requireAdmin(async (req, res) => {
      try {
        const { code, discount, expiry } = req.body || {};

        if (!code || !discount) {
          return errorResponse(res, 400, 'Missing code or discount');
        }

        const coupons = await readJSON('coupons.json').catch(() => []);
        const newCoupon = {
          id: `cpn-${Date.now()}`,
          code: code.trim().toUpperCase(),
          discount: Number(discount),
          expiry: expiry || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: req.user.id,
          usedBy: null
        };

        coupons.push(newCoupon);
        await writeJSON('coupons.json', coupons);

        return jsonResponse(res, 201, {
          message: 'Coupon created successfully',
          coupon: newCoupon
        });
      } catch (err) {
        return errorResponse(res, 500, 'Failed to create coupon', err.message);
      }
    })(req, res);
  }

  return errorResponse(res, 405, 'Method not allowed');
}

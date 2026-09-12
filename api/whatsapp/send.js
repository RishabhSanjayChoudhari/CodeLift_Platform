import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  return requireAdmin(async (req, res) => {
    try {
      const { to, templateName = 'batch_welcome', params = {} } = req.body || {};

      if (!to) {
        return errorResponse(res, 400, 'Missing recipient phone number "to"');
      }

      const token = process.env.WHATSAPP_API_TOKEN;

      if (!token) {
        console.log(`[WhatsApp Simulator] Sent template "${templateName}" to ${to} with params:`, params);
        return jsonResponse(res, 200, {
          success: true,
          simulated: true,
          message: `WhatsApp message queued to ${to} (Simulated mode: WHATSAPP_API_TOKEN not set)`
        });
      }

      // External Meta WhatsApp Cloud API call implementation
      // const response = await fetch(`https://graph.facebook.com/v19.0/.../messages`, { ... })

      return jsonResponse(res, 200, {
        success: true,
        recipient: to,
        templateName
      });
    } catch (err) {
      return errorResponse(res, 500, 'Failed to send WhatsApp message', err.message);
    }
  })(req, res);
}

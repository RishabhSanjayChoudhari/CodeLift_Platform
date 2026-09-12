import { handleCors, jsonResponse, errorResponse } from '../_lib/cors.js';
import { requireAuth } from '../_lib/auth.js';
import { supabaseAdmin, BUCKET_NAME } from '../_lib/supabase.js';
import { ensureBucketExists } from '../_lib/storage.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  return requireAuth(async (req, res) => {
    try {
      const { folder = 'submissions', filename = 'file.pdf' } = req.query || {};

      // Sanitize file path
      const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${folder}/${Date.now()}_${safeFilename}`;

      await ensureBucketExists().catch(() => {});

      // If Supabase URL is not configured (e.g. initial dev preview), provide mock upload URL
      if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('your-project')) {
        return jsonResponse(res, 200, {
          signedUrl: `https://mock-storage.codelift.local/upload/${filePath}`,
          path: filePath,
          token: 'mock-token',
          fileUrl: `https://mock-storage.codelift.local/${BUCKET_NAME}/${filePath}`,
          mock: true
        });
      }

      const { data, error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .createSignedUploadUrl(filePath);

      if (error) {
        console.error('[Storage Signed Upload URL Error]:', error);
        return errorResponse(res, 500, 'Failed to create signed upload URL', error.message);
      }

      // Supabase public URL structure (or signed read URL)
      const { data: publicData } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(filePath);

      return jsonResponse(res, 200, {
        signedUrl: data.signedUrl,
        path: filePath,
        token: data.token,
        fileUrl: publicData?.publicUrl || filePath
      });
    } catch (err) {
      return errorResponse(res, 500, 'Error creating upload URL', err.message);
    }
  })(req, res);
}

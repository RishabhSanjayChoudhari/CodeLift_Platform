import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const basePath = process.env.VITE_BASE_PATH || '/CodeLift_Platform/';
const cleanBase = basePath.endsWith('/') ? basePath : `${basePath}/`;

if (!process.env.VITE_SUPABASE_URL) {
  process.env.VITE_SUPABASE_URL = 'https://yuznthzgyrkrxhzldmdi.supabase.co';
}
if (!process.env.VITE_SUPABASE_ANON_KEY) {
  process.env.VITE_SUPABASE_ANON_KEY = 'sb_publishable_4fRM66XdHhcZ__c1jnuj3g_hCD4Litw';
}

export default defineConfig({
  base: cleanBase,
  plugins: [
    react(),
    {
      name: 'dev-base-redirect',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const baseNoSlash = cleanBase.replace(/\/$/, '');
          const url = req.url || '';
          if (
            baseNoSlash &&
            !url.startsWith(cleanBase) &&
            !url.startsWith(baseNoSlash) &&
            !url.startsWith('/@') &&
            !url.startsWith('/src') &&
            !url.startsWith('/node_modules')
          ) {
            const dest = `${baseNoSlash}${url.startsWith('/') ? url : '/' + url}`;
            res.writeHead(302, { Location: dest });
            res.end();
            return;
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 5173,
    open: false
  }
});

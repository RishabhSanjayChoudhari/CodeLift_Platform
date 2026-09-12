import fs from 'node:fs';
import path from 'node:path';

const distIndex = path.resolve('dist', 'index.html');
const dist404 = path.resolve('dist', '404.html');

if (fs.existsSync(distIndex)) {
  fs.copyFileSync(distIndex, dist404);
  console.log('✅ Generated dist/404.html for GitHub Pages SPA routing');
} else {
  console.error('❌ dist/index.html not found');
  process.exit(1);
}

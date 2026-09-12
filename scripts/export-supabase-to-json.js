import fs from 'fs';
import path from 'path';
import pg from 'pg';

function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          let val = match[2].trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is required in .env.local to run export script.');
  process.exit(1);
}

async function exportBackup() {
  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const dateStr = new Date().toISOString().split('T')[0];
    const backupDir = path.resolve(process.cwd(), 'backups', `backup-${dateStr}`);
    fs.mkdirSync(backupDir, { recursive: true });

    console.log(`📦 Exporting database tables to ${backupDir}...`);

    const tables = [
      'users',
      'students',
      'categories',
      'batches',
      'courses',
      'course_modules',
      'course_topics',
      'batch_courses',
      'tests',
      'test_questions',
      'test_attempts',
      'batch_tests',
      'assignments',
      'submissions',
      'batch_assignments',
      'fees',
      'payments',
      'coupons',
      'enrollments',
      'certificates',
      'certificate_templates',
      'reviews',
      'discussions',
      'discussion_answers',
      'notifications',
      'problem_attempts',
      'completed_batches'
    ];

    for (const table of tables) {
      const res = await client.query(`SELECT * FROM public.${table};`);
      const targetFile = path.join(backupDir, `${table}.json`);
      fs.writeFileSync(targetFile, JSON.stringify(res.rows, null, 2), 'utf8');
      console.log(`  ✓ Exported ${res.rows.length} rows from ${table}`);
    }

    console.log(`\n🎉 Export complete! Backed up ${tables.length} tables.`);
  } catch (err) {
    console.error('❌ Export failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

exportBackup();

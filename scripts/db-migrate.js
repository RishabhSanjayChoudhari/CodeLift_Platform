import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { runJsonSeedMigration, loadEnv } from './migrate-json-to-supabase.js';

loadEnv();

const DATABASE_URL = process.env.DATABASE_URL;

function printUsage() {
  console.log(`
===============================================================
🚀 CodeLift Supabase PostgreSQL Migration CLI
===============================================================

Usage:
  node scripts/db-migrate.js [options]
  npm run db:migrate [-- options]

Options:
  (no option)   Apply all pending SQL migrations in supabase/migrations/
  --status      Display applied vs pending SQL migrations table
  --seed        Migrate seed data from data/*.json into Supabase Postgres
  --verify      Verify schema completeness, row counts & foreign key integrity
  --all         Execute Schema DDL + Seed Data + Verification in one command
  --reset       Drop and recreate public schema (requires --force)
  --help, -h    Display this usage guide

Environment Configuration (in .env.local):
  DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

Supabase Setup Instructions:
  1. Open Supabase Dashboard: https://supabase.com/dashboard
  2. Navigate to: Project Settings -> Database -> Connection String
  3. Select URI format and copy the connection string into .env.local
  4. Replace [YOUR-PASSWORD] with your database password (percent-encoded if special chars)
===============================================================
`);
}

async function verifyDatabase(client) {
  console.log('\n===============================================================');
  console.log('🔍 VERIFYING DATABASE SCHEMA & DATA INTEGRITY');
  console.log('===============================================================');

  const expectedTables = [
    'users', 'students', 'categories', 'batches', 'courses', 'course_modules',
    'course_topics', 'batch_courses', 'tests', 'test_questions', 'test_attempts',
    'batch_tests', 'assignments', 'submissions', 'batch_assignments', 'fees',
    'payments', 'coupons', 'enrollments', 'certificates', 'certificate_templates',
    'problem_attempts', 'completed_batches'
  ];

  const { rows: existingRows } = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
  `);
  const existingSet = new Set(existingRows.map((r) => r.table_name));

  let missingCount = 0;
  for (const t of expectedTables) {
    if (!existingSet.has(t)) {
      console.error(`  ❌ Missing table: ${t}`);
      missingCount++;
    }
  }

  if (missingCount > 0) {
    console.error(`\n❌ Verification failed: ${missingCount} required table(s) missing from public schema.`);
    return false;
  }
  console.log(`  ✅ All ${expectedTables.length} core tables verified in public schema.`);

  // Row counts
  console.log('\n---------------------------------------------------------------');
  console.log('📊 DATABASE ROW COUNTS');
  console.log('---------------------------------------------------------------');
  for (const t of expectedTables) {
    const { rows } = await client.query(`SELECT count(*)::int as cnt FROM public."${t}";`);
    console.log(`  • ${t.padEnd(25)} : ${rows[0].cnt} rows`);
  }

  // Referential Integrity / Orphan Checks
  console.log('\n---------------------------------------------------------------');
  console.log('🔗 REFERENTIAL INTEGRITY (ORPHAN CHECKS)');
  console.log('---------------------------------------------------------------');

  const checks = [
    { name: 'Students without auth.users', q: 'SELECT count(*)::int as c FROM public.students s LEFT JOIN auth.users u ON s.id = u.id WHERE u.id IS NULL' },
    { name: 'Fees with invalid student_id', q: 'SELECT count(*)::int as c FROM public.fees f LEFT JOIN public.students s ON f.student_id = s.id WHERE s.id IS NULL' },
    { name: 'Course modules with invalid course_id', q: 'SELECT count(*)::int as c FROM public.course_modules m LEFT JOIN public.courses c ON m.course_id = c.id WHERE c.id IS NULL' },
    { name: 'Course topics with invalid module_id', q: 'SELECT count(*)::int as c FROM public.course_topics t LEFT JOIN public.course_modules m ON t.module_id = m.id WHERE m.id IS NULL' },
    { name: 'Test questions with invalid test_id', q: 'SELECT count(*)::int as c FROM public.test_questions q LEFT JOIN public.tests t ON q.test_id = t.id WHERE t.id IS NULL' },
    { name: 'Test attempts with invalid student_id', q: 'SELECT count(*)::int as c FROM public.test_attempts a LEFT JOIN public.students s ON a.student_id = s.id WHERE s.id IS NULL' },
    { name: 'Submissions with invalid student_id', q: 'SELECT count(*)::int as c FROM public.submissions sub LEFT JOIN public.students s ON sub.student_id = s.id WHERE s.id IS NULL' },
    { name: 'Submissions with invalid assignment_id', q: 'SELECT count(*)::int as c FROM public.submissions sub LEFT JOIN public.assignments a ON sub.assignment_id = a.id WHERE a.id IS NULL' },
    { name: 'Enrollments with invalid student_id', q: 'SELECT count(*)::int as c FROM public.enrollments e LEFT JOIN public.students s ON e.student_id = s.id WHERE s.id IS NULL' },
    { name: 'Certificates with invalid student_id', q: 'SELECT count(*)::int as c FROM public.certificates c LEFT JOIN public.students s ON c.student_id = s.id WHERE s.id IS NULL' }
  ];

  let orphanErrors = 0;
  for (const check of checks) {
    try {
      const { rows } = await client.query(check.q);
      const count = rows[0].c;
      if (count === 0) {
        console.log(`  ✅ ${check.name}: 0 orphans`);
      } else {
        console.error(`  ❌ ${check.name}: ${count} orphan records found!`);
        orphanErrors++;
      }
    } catch (e) {
      console.warn(`  ⚠️ Could not verify "${check.name}":`, e.message);
    }
  }

  console.log('===============================================================');
  if (orphanErrors === 0) {
    console.log('🎉 VERIFICATION COMPLETED: Database is 100% healthy and referentially intact!\n');
    return true;
  } else {
    console.error(`❌ VERIFICATION FAILED: ${orphanErrors} referential integrity issue(s) detected.\n`);
    return false;
  }
}

async function applyMigrations(client, migrationsDir) {
  // Ensure _migrations tracking table exists
  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT now()
    );
  `);

  const { rows: appliedRows } = await client.query(`
    SELECT name, applied_at FROM _migrations ORDER BY id ASC;
  `);
  const appliedSet = new Set(appliedRows.map((r) => r.name));

  const sqlFiles = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const pendingFiles = sqlFiles.filter((f) => !appliedSet.has(f));

  if (pendingFiles.length === 0) {
    console.log('✨ All migrations are up to date! (0 pending migrations)');
    return;
  }

  console.log(`📦 Found ${pendingFiles.length} pending migration(s):\n`);

  for (const file of pendingFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    const start = Date.now();

    process.stdout.write(`  ⏳ Applying ${file}... `);

    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(
        `INSERT INTO _migrations (name, applied_at) VALUES ($1, now());`,
        [file]
      );
      await client.query('COMMIT');

      const elapsed = Date.now() - start;
      process.stdout.write(`✅ Done (${elapsed}ms)\n`);
    } catch (err) {
      await client.query('ROLLBACK');
      process.stdout.write(`❌ Failed\n`);
      console.error(`\n[Migration Error in ${file}]:\n${err.message}\n`);
      throw err;
    }
  }

  console.log('\n🎉 Successfully applied all pending migrations!');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  if (!DATABASE_URL) {
    console.error(`
❌ Error: DATABASE_URL environment variable is missing.

Please create or update your .env.local file with:
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

To obtain your connection string:
1. Open https://supabase.com/dashboard
2. Go to: Project Settings -> Database -> Connection String
3. Copy URI format and paste it into .env.local
`);
    process.exit(1);
  }

  if (DATABASE_URL.includes('YOUR_DB_PASSWORD_HERE') || DATABASE_URL.includes('[YOUR-PASSWORD]')) {
    console.error(`
⚠️  Placeholder Password Detected in .env.local!

DATABASE_URL is currently using a placeholder password.
Please open .env.local and replace YOUR_DB_PASSWORD_HERE with your real Supabase database password:

  DATABASE_URL=postgresql://postgres:YOUR_REAL_PASSWORD@db.[PROJECT-REF].supabase.co:5432/postgres

* Tip: If your password contains special characters (e.g. @, #, $, %, !), make sure to URL-encode them.
`);
    process.exit(1);
  }

  const migrationsDir = path.resolve(process.cwd(), 'supabase/migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.error(`❌ Error: Migrations directory not found at: ${migrationsDir}`);
    process.exit(1);
  }

  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL database.\n');

    // ── 1. RESET MODE ──────────────────────────────────────────────────────────
    if (args.includes('--reset')) {
      if (!args.includes('--force')) {
        console.warn('⚠️ WARNING: --reset drops all tables in public schema!');
        console.warn('To confirm, run with: node scripts/db-migrate.js --reset --force\n');
        await client.end();
        process.exit(0);
      }
      console.log('⚠️ Resetting public schema (--reset --force)...');
      await client.query(`
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO postgres;
        GRANT ALL ON SCHEMA public TO public;
      `);
      console.log('✅ Public schema reset. Re-applying all migrations...\n');
    }

    // ── 2. STATUS CHECK ────────────────────────────────────────────────────────
    if (args.includes('--status')) {
      await client.query(`
        CREATE TABLE IF NOT EXISTS _migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          applied_at TIMESTAMPTZ DEFAULT now()
        );
      `);

      const { rows: appliedRows } = await client.query(`
        SELECT name, applied_at FROM _migrations ORDER BY id ASC;
      `);
      const appliedSet = new Set(appliedRows.map((r) => r.name));

      const sqlFiles = fs
        .readdirSync(migrationsDir)
        .filter((f) => f.endsWith('.sql'))
        .sort();

      console.log('===============================================================');
      console.log('📊 DATABASE MIGRATION STATUS');
      console.log('===============================================================');
      for (const file of sqlFiles) {
        const isApplied = appliedSet.has(file);
        const record = appliedRows.find((r) => r.name === file);
        const dateStr = record ? new Date(record.applied_at).toLocaleString() : '-';
        console.log(` ${isApplied ? '✅ APPLIED' : '⏳ PENDING'} | ${file.padEnd(30)} | ${dateStr}`);
      }
      console.log('===============================================================\n');
      await client.end();
      process.exit(0);
    }

    // ── 3. VERIFY ONLY ─────────────────────────────────────────────────────────
    if (args.includes('--verify')) {
      const ok = await verifyDatabase(client);
      await client.end();
      process.exit(ok ? 0 : 1);
    }

    // ── 4. SEED ONLY ───────────────────────────────────────────────────────────
    if (args.includes('--seed') && !args.includes('--all')) {
      console.log('🌱 Running JSON seed migration...\n');
      await runJsonSeedMigration(client, { skipDdl: true });
      await client.end();
      process.exit(0);
    }

    // ── 5. RUN SCHEMA DDL MIGRATIONS ───────────────────────────────────────────
    console.log('🔵 Running pending database schema migrations...');
    await applyMigrations(client, migrationsDir);

    // ── 6. RUN SEED & VERIFY IF --all ──────────────────────────────────────────
    if (args.includes('--all')) {
      console.log('\n🌱 Running JSON data seeder (--all)...');
      await runJsonSeedMigration(client, { skipDdl: true });
      await verifyDatabase(client);
    }

    await client.end();
  } catch (err) {
    console.error('\n❌ Database error:', err.message);
    process.exit(1);
  }
}

main();

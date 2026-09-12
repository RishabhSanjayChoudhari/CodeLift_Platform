import pg from 'pg';
import { loadEnv } from './migrate-json-to-supabase.js';

loadEnv();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('❌ Missing DATABASE_URL');
  process.exit(1);
}

async function run() {
  const client = new pg.Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('✅ Connected to PostgreSQL database');

  await client.query('create extension if not exists pgcrypto;');

  // 1. Update rishabh in auth.users
  const authUpdate = await client.query(`
    UPDATE auth.users
    SET email = 'codelift.official@gmail.com',
        encrypted_password = crypt('admin1245', gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now()
    WHERE id = 'a64e3fab-f4b6-4dfc-9064-581d7e536e98'
       OR lower(email) = 'rishabh@codelift.local'
       OR lower(email) = 'codelift.official@gmail.com';
  `);
  console.log(`✅ Auth users updated for rishabh: ${authUpdate.rowCount} row(s)`);

  // 2. Update rishabh in public.users
  const publicUpdate = await client.query(`
    UPDATE public.users
    SET email = 'codelift.official@gmail.com',
        username = 'rishabh',
        role = 'admin'
    WHERE id = 'a64e3fab-f4b6-4dfc-9064-581d7e536e98'
       OR lower(email) = 'rishabh@codelift.local'
       OR username = 'rishabh';
  `);
  console.log(`✅ Public users updated for rishabh: ${publicUpdate.rowCount} row(s)`);

  // 3. Update admin@codelift.dev password to CodeLift15July
  const adminUpdate = await client.query(`
    UPDATE auth.users
    SET encrypted_password = crypt('CodeLift15July', gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        raw_user_meta_data = jsonb_build_object('name', 'Administrator', 'role', 'admin', 'email_verified', true),
        updated_at = now()
    WHERE lower(email) = 'admin@codelift.dev';
  `);
  console.log(`✅ Admin (admin@codelift.dev) auth updated: ${adminUpdate.rowCount} row(s)`);

  // 4. Update all student passwords to 'password'
  const studentUpdate = await client.query(`
    UPDATE auth.users
    SET encrypted_password = crypt('password', gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now()
    WHERE id IN (SELECT id FROM public.students)
       OR raw_user_meta_data->>'role' = 'student'
       OR lower(email) IN ('rahul.sharma@example.com', 'priya.patel@example.com', 'amit.v@example.com', 'sneha.r@example.com');
  `);
  console.log(`✅ All students auth password updated to "password": ${studentUpdate.rowCount} row(s)`);

  // 5. Create Trigger function: Every student created in public.students automatically gets auth.users record with password 'password'
  await client.query(`
    CREATE OR REPLACE FUNCTION public.handle_student_auth_provisioning()
    RETURNS TRIGGER AS $$
    DECLARE
      v_user_id uuid;
    BEGIN
      -- Check if user already exists in auth.users by email
      SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(NEW.email) LIMIT 1;

      IF v_user_id IS NOT NULL THEN
        -- User exists; ensure password is 'password' and email confirmed
        UPDATE auth.users
        SET encrypted_password = crypt('password', gen_salt('bf')),
            email_confirmed_at = COALESCE(email_confirmed_at, now()),
            updated_at = now()
        WHERE id = v_user_id;

        NEW.id := v_user_id;
      ELSE
        -- Create auth user with default password 'password'
        v_user_id := COALESCE(NEW.id, gen_random_uuid());
        INSERT INTO auth.users (
          id,
          instance_id,
          email,
          encrypted_password,
          email_confirmed_at,
          role,
          aud,
          raw_app_meta_data,
          raw_user_meta_data,
          created_at,
          updated_at
        ) VALUES (
          v_user_id,
          '00000000-0000-0000-0000-000000000000',
          NEW.email,
          crypt('password', gen_salt('bf')),
          now(),
          'authenticated',
          'authenticated',
          '{"provider":"email","providers":["email"]}',
          jsonb_build_object('name', NEW.name, 'role', 'student', 'email_verified', true),
          now(),
          now()
        );

        NEW.id := v_user_id;
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

    DROP TRIGGER IF EXISTS trg_provision_student_auth ON public.students;
    CREATE TRIGGER trg_provision_student_auth
      BEFORE INSERT ON public.students
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_student_auth_provisioning();
  `);
  console.log('✅ Created trigger trg_provision_student_auth (auto-provisions password="password" for all new students)');

  // 6. Print verification rows
  const verifyUsers = await client.query(`
    SELECT u.id, u.email, u.username, u.role, u.name
    FROM public.users u
    WHERE u.role = 'admin';
  `);
  console.log('\n🔍 Admin users in public.users:');
  console.table(verifyUsers.rows);

  const verifyStudents = await client.query(`
    SELECT s.id, s.name, s.email, s.fee_status
    FROM public.students s;
  `);
  console.log('\n🔍 Students in public.students:');
  console.table(verifyStudents.rows);

  await client.end();
}

run().catch((e) => {
  console.error('❌ Error executing update:', e);
  process.exit(1);
});

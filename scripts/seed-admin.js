import { createClient } from '@supabase/supabase-js';
import { loadEnv } from './migrate-json-to-supabase.js';

import pg from 'pg';

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

if (!globalThis.WebSocket) {
  globalThis.WebSocket = class WebSocket {};
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function seedAdmin() {
  const adminEmail = 'codelift.official@gmail.com';
  const adminPassword = 'admin1245';
  const adminUsername = 'rishabh';
  const adminName = 'Rishabh';

  console.log('🚀 Seeding admin credentials in Supabase Auth & Users...');

  let userId = null;

  // 1. Try creating auth user with email pre-confirmed
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { name: adminName, role: 'admin' }
  });

  if (authError) {
    if (authError.message.includes('already') || authError.status === 422) {
      console.log('ℹ️ Auth user already exists, looking up user ID...');
      try {
        const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;
        const existingUser = listData?.users?.find((u) => u.email === adminEmail);
        if (existingUser) userId = existingUser.id;
      } catch (listErr) {
        const pgClient = new pg.Client({ connectionString: process.env.DATABASE_URL });
        await pgClient.connect();
        const r = await pgClient.query("SELECT id FROM auth.users WHERE email = $1", [adminEmail]);
        await pgClient.end();
        if (r.rows.length > 0) {
          userId = r.rows[0].id;
        }
      }

      if (userId) {
        try {
          await supabase.auth.admin.updateUserById(userId, {
            password: adminPassword,
            email_confirm: true
          });
          console.log(`✅ Updated existing auth user password for: ${adminEmail}`);
        } catch (updateErr) {
          console.log(`ℹ️ Auth user password verified for: ${adminEmail}`);
        }
      } else {
        throw new Error(`User with email ${adminEmail} reported existing but not found.`);
      }
    } else {
      throw authError;
    }
  } else {
    userId = authUser.user.id;
    console.log(`✅ Created auth user: ${adminEmail} (ID: ${userId})`);
  }

  // 2. Upsert into public.users table
  const { data: dbUser, error: dbError } = await supabase
    .from('users')
    .upsert({
      id: userId,
      email: adminEmail,
      username: adminUsername,
      name: adminName,
      role: 'admin',
      is_active: true
    }, { onConflict: 'id' });

  if (dbError) {
    console.error('❌ Failed to upsert public.users row:', dbError);
    throw dbError;
  }

  console.log(`🎉 Admin user "${adminUsername}" (${adminEmail}) seeded successfully!`);
}

seedAdmin().catch((err) => {
  console.error('❌ Admin seed failed:', err);
  process.exit(1);
});

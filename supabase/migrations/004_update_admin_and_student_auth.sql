-- ==============================================================================
-- Migration 004: Standardize Admin Email & Student Auto-Provisioning
-- ==============================================================================

-- 1. Ensure pgcrypto extension
create extension if not exists pgcrypto;

-- 2. Update Primary Admin email to codelift.official@gmail.com
update public.users
set email = 'codelift.official@gmail.com',
    username = 'rishabh',
    role = 'admin'
where username = 'rishabh'
   or email in ('rishabh@codelift.local', 'codelift.official@gmail.com');

update auth.users
set email = 'codelift.official@gmail.com',
    encrypted_password = crypt('admin1245', gen_salt('bf')),
    email_confirmed_at = coalesce(email_confirmed_at, now()),
    updated_at = now()
where id in (select id from public.users where username = 'rishabh')
   or lower(email) in ('rishabh@codelift.local', 'codelift.official@gmail.com');

-- 3. Standardize all student passwords to 'password'
update auth.users
set encrypted_password = crypt('password', gen_salt('bf')),
    email_confirmed_at = coalesce(email_confirmed_at, now()),
    updated_at = now()
where id in (select id from public.students)
   or raw_user_meta_data->>'role' = 'student';

-- 4. Function & Trigger: Automatically provision auth.users with password='password' for all newly created students
create or replace function public.handle_student_auth_provisioning()
returns trigger as $$
declare
  v_user_id uuid;
begin
  -- Check if user already exists in auth.users by email
  select id into v_user_id from auth.users where lower(email) = lower(new.email) limit 1;

  if v_user_id is not null then
    -- Existing user: set password to 'password' and ensure confirmed
    update auth.users
    set encrypted_password = crypt('password', gen_salt('bf')),
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        updated_at = now()
    where id = v_user_id;

    new.id := v_user_id;
  else
    -- Create auth user with default password 'password'
    v_user_id := coalesce(new.id, gen_random_uuid());
    insert into auth.users (
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
    ) values (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      new.email,
      crypt('password', gen_salt('bf')),
      now(),
      'authenticated',
      'authenticated',
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('name', new.name, 'role', 'student', 'email_verified', true),
      now(),
      now()
    );

    new.id := v_user_id;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public, auth;

drop trigger if exists trg_provision_student_auth on public.students;
create trigger trg_provision_student_auth
  before insert on public.students
  for each row
  execute function public.handle_student_auth_provisioning();

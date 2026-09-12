-- ==============================================================================
-- CodeLift Platform - Refinements & Archival Migration
-- Migration: 002_refinements_and_archival.sql
-- ==============================================================================

-- Block 1: Course Type Column
alter table courses 
  add column if not exists course_type text default 'elective'
  check (course_type in ('cohort', 'elective'));

update courses set course_type = 'elective' where course_type is null;

-- Block 1.5: Remove FK constraints referencing courses (prevents cascade deletion)
alter table enrollments 
  drop constraint if exists enrollments_course_id_fkey;

alter table batch_courses 
  drop constraint if exists batch_courses_course_id_fkey;

alter table payments 
  drop constraint if exists payments_course_id_fkey;

-- Remove cohort course rows from DB — enrollments and batch_courses preserve their course_id values
delete from courses where id in ('course-fswd', 'course-da', 'course-python-free', 'python-core');

-- Block 2: Remove Video Column from Course Topics
alter table course_topics drop column if exists video_url;

-- Block 3: Users Table Schema Adjustments (Supabase Auth unified)
alter table users add column if not exists username text unique;
alter table users drop column if exists password_hash;

-- Block 4: Drop Discontinued Tables
drop table if exists reviews cascade;
drop table if exists discussion_answers cascade;
drop table if exists discussions cascade;
drop table if exists notifications cascade;

-- Block 5: Admin Login Email Resolution RPC (Bypasses RLS for Anon)
create or replace function get_admin_email(p_username text)
returns text as $$
  select email from users
  where username = p_username and role = 'admin'
  limit 1;
$$ language sql security definer set search_path = public;

-- Block 6: Storage Delete Policies for Batch Cleanup (Idempotent)
drop policy if exists "admins_delete_submissions_storage" on storage.objects;
create policy "admins_delete_submissions_storage" on storage.objects
  for delete using (
    bucket_id = 'submissions' 
    and exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

drop policy if exists "students_delete_own_submissions_storage" on storage.objects;
create policy "students_delete_own_submissions_storage" on storage.objects
  for delete using (
    bucket_id = 'submissions' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

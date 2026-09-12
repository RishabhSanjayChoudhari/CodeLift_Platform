-- ==============================================================================
-- CodeLift Platform - Initial Schema Migration (Supabase PostgreSQL)
-- Migration: 001_initial_schema.sql
-- ==============================================================================

-- 1. EXTENSIONS & UTILITY FUNCTIONS
create extension if not exists "uuid-ossp";

-- Timestamp updater
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Security Definer helper for role checks (with fixed search_path)
create or replace function is_admin() returns boolean as $$
begin
  return exists (
    select 1 from users where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer set search_path = public;

-- ==============================================================================
-- 2. CORE IDENTITY & COHORTS
-- ==============================================================================

-- Admin & Staff users (PII Protected)
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  phone text,
  role text default 'student' check (role in ('admin', 'student')),
  is_active boolean default true,
  bio text,
  profile_picture text,
  skills text[] default '{}',
  created_at timestamptz default now(),
  approved_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists set_updated_at_users on users;
create trigger set_updated_at_users
  before update on users
  for each row execute function update_updated_at();

-- Course Categories
create table if not exists categories (
  id text primary key,
  name text not null,
  slug text unique not null,
  icon text,
  description text,
  created_at timestamptz default now()
);

-- Cohorts / Batches
create table if not exists batches (
  id text primary key,
  name text not null,
  description text,
  capacity integer default 30,
  fee_amount numeric default 0,
  start_date timestamptz,
  is_active boolean default true,
  is_completed boolean default false,
  completed_at timestamptz,
  archived_students jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists set_updated_at_batches on batches;
create trigger set_updated_at_batches
  before update on batches
  for each row execute function update_updated_at();

-- Students (Linked to auth.users)
create table if not exists students (
  id uuid primary key references auth.users(id) on delete cascade,
  legacy_id text unique, -- Temporary migration bridge column; drop 30 days post-stabilization
  name text not null,
  email text unique not null,
  phone text,
  batch_id text references batches(id) on delete set null,
  enrolled_date timestamptz default now(),
  total_fee numeric default 0,
  paid_fee numeric default 0,
  fee_status text default 'PENDING',
  is_graduated boolean default false,
  is_active boolean default true,
  completed_batch_ids text[] default '{}',
  progress jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists set_updated_at_students on students;
create trigger set_updated_at_students
  before update on students
  for each row execute function update_updated_at();

-- ==============================================================================
-- 3. CURRICULUM
-- ==============================================================================

create table if not exists courses (
  id text primary key,
  title text not null,
  slug text unique not null,
  description text,
  category_id text references categories(id) on delete set null,
  price numeric default 0,
  is_free boolean default false,
  is_published boolean default true,
  is_approved boolean default true,
  thumbnail text,
  promo_video text,
  rating numeric default 5.0,
  num_reviews integer default 0,
  students_enrolled integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists set_updated_at_courses on courses;
create trigger set_updated_at_courses
  before update on courses
  for each row execute function update_updated_at();

create table if not exists course_modules (
  id text primary key,
  course_id text references courses(id) on delete cascade,
  title text not null,
  order_index integer default 0,
  created_at timestamptz default now()
);

create table if not exists course_topics (
  id text primary key,
  module_id text references course_modules(id) on delete cascade,
  title text not null,
  video_url text,
  content_md text,
  order_index integer default 0,
  created_at timestamptz default now()
);

create table if not exists batch_courses (
  batch_id text references batches(id) on delete cascade,
  course_id text references courses(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (batch_id, course_id)
);

-- ==============================================================================
-- 4. ASSESSMENTS & SUBMISSIONS
-- ==============================================================================

create table if not exists tests (
  id text primary key,
  title text not null,
  description text,
  time_limit integer default 30,
  passing_percentage integer default 70,
  allow_retake boolean default true,
  created_at timestamptz default now()
);

create table if not exists test_questions (
  id text primary key,
  test_id text references tests(id) on delete cascade,
  text text not null,
  options jsonb not null,
  correct_answer integer not null,
  explanation text,
  order_index integer default 0,
  created_at timestamptz default now()
);

create table if not exists test_attempts (
  id text primary key,
  student_id uuid references students(id) on delete cascade,
  test_id text references tests(id) on delete cascade,
  batch_id text references batches(id) on delete set null,
  answers jsonb default '[]'::jsonb,
  score numeric default 0,
  total_questions integer default 0,
  submitted_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists batch_tests (
  batch_id text references batches(id) on delete cascade,
  test_id text references tests(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (batch_id, test_id)
);

create table if not exists assignments (
  id text primary key,
  title text not null,
  description text,
  deadline timestamptz,
  max_marks integer default 100,
  type text default 'PROJECT',
  created_at timestamptz default now()
);

create table if not exists submissions (
  id text primary key,
  student_id uuid references students(id) on delete cascade,
  assignment_id text references assignments(id) on delete cascade,
  batch_id text references batches(id) on delete set null,
  file_urls jsonb default '[]'::jsonb,
  notes text,
  submitted_at timestamptz default now(),
  grade numeric,
  feedback text,
  created_at timestamptz default now()
);

create table if not exists batch_assignments (
  batch_id text references batches(id) on delete cascade,
  assignment_id text references assignments(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (batch_id, assignment_id)
);

-- ==============================================================================
-- 5. FINANCIAL & CREDENTIALS
-- ==============================================================================

create table if not exists fees (
  id text primary key,
  student_id uuid references students(id) on delete cascade,
  amount numeric not null,
  paid_at timestamptz,
  due_date timestamptz,
  mode text default 'UPI',
  status text default 'PENDING',
  payment_proof text,
  payment_note text,
  created_at timestamptz default now()
);

create table if not exists payments (
  id text primary key,
  enrollment_id text,
  student_id uuid references students(id) on delete cascade,
  student_name text,
  course_id text references courses(id) on delete set null,
  course_title text,
  amount numeric not null,
  mode text,
  status text,
  payment_proof text,
  payment_note text,
  verified_by text,
  verified_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists coupons (
  id text primary key,
  code text unique not null,
  type text default 'flat',
  value numeric default 0,
  expiry timestamptz,
  usage_limit integer default 100,
  used_count integer default 0,
  course_ids jsonb default '[]'::jsonb,
  created_by text,
  used_by text,
  created_at timestamptz default now()
);

create table if not exists enrollments (
  id text primary key,
  student_id uuid references students(id) on delete cascade,
  course_id text references courses(id) on delete cascade,
  coupon_id text references coupons(id) on delete set null,
  status text default 'PENDING',
  payment_proof text,
  payment_note text,
  verified_by text,
  verified_at timestamptz,
  amount numeric default 0,
  discount_applied numeric default 0,
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists certificates (
  id text primary key,
  student_id uuid references students(id) on delete cascade,
  student_name text not null,
  course_name text not null,
  issued_at timestamptz default now(),
  certificate_id text unique not null,
  is_issued boolean default true,
  is_revoked boolean default false,
  institute_name text,
  signatory_name text,
  signatory_title text,
  cert_title text,
  pdf_url text,
  created_at timestamptz default now()
);

create table if not exists certificate_templates (
  id text primary key,
  name text not null,
  is_active boolean default false,
  institute_name text,
  signatory_name text,
  signatory_title text,
  cert_title text,
  design jsonb not null,
  created_at timestamptz default now()
);

-- ==============================================================================
-- 6. ENGAGEMENT, REVIEWS, DISCUSSIONS & NOTIFICATIONS
-- ==============================================================================

create table if not exists reviews (
  id text primary key,
  student_id uuid references students(id) on delete cascade,
  student_name text not null,
  course_id text references courses(id) on delete cascade,
  rating integer not null,
  comment text,
  is_published boolean default true,
  admin_reply text,
  created_at timestamptz default now()
);

create table if not exists discussions (
  id text primary key,
  course_id text references courses(id) on delete cascade,
  topic_id text,
  student_id uuid references students(id) on delete cascade,
  student_name text not null,
  question text not null,
  created_at timestamptz default now()
);

create table if not exists discussion_answers (
  id text primary key,
  discussion_id text references discussions(id) on delete cascade,
  author_id text,
  author_name text,
  content text not null,
  upvotes integer default 0,
  created_at timestamptz default now()
);

create table if not exists notifications (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists problem_attempts (
  id text primary key,
  student_id uuid references students(id) on delete cascade,
  problem_id text not null,
  code_submitted text,
  passed boolean default false,
  score numeric default 0,
  test_results jsonb default '[]'::jsonb,
  attempted_at timestamptz default now(),
  time_taken integer default 0,
  hints_used integer default 0,
  status text,
  created_at timestamptz default now()
);

create table if not exists completed_batches (
  id text primary key,
  original_batch_id text,
  name text not null,
  description text,
  start_date timestamptz,
  end_date timestamptz,
  completed_at timestamptz default now(),
  student_ids jsonb default '[]'::jsonb,
  test_ids jsonb default '[]'::jsonb,
  assignment_ids jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- ==============================================================================
-- 7. PERFORMANCE INDEXES
-- ==============================================================================

create index if not exists idx_students_batch_id on students(batch_id);
create index if not exists idx_students_email on students(email);
create index if not exists idx_students_legacy_id on students(legacy_id);
create index if not exists idx_courses_category_id on courses(category_id);
create index if not exists idx_course_modules_course_id on course_modules(course_id);
create index if not exists idx_course_topics_module_id on course_topics(module_id);
create index if not exists idx_batch_courses_batch_id on batch_courses(batch_id);
create index if not exists idx_batch_courses_course_id on batch_courses(course_id);
create index if not exists idx_test_questions_test_id on test_questions(test_id);
create index if not exists idx_test_attempts_student_id on test_attempts(student_id);
create index if not exists idx_test_attempts_test_id on test_attempts(test_id);
create index if not exists idx_batch_tests_batch_id on batch_tests(batch_id);
create index if not exists idx_batch_tests_test_id on batch_tests(test_id);
create index if not exists idx_submissions_student_id on submissions(student_id);
create index if not exists idx_submissions_assignment_id on submissions(assignment_id);
create index if not exists idx_batch_assignments_batch_id on batch_assignments(batch_id);
create index if not exists idx_batch_assignments_assignment_id on batch_assignments(assignment_id);
create index if not exists idx_fees_student_id on fees(student_id);
create index if not exists idx_payments_student_id on payments(student_id);
create index if not exists idx_enrollments_student_id on enrollments(student_id);
create index if not exists idx_enrollments_course_id on enrollments(course_id);
create index if not exists idx_enrollments_coupon_id on enrollments(coupon_id);
create index if not exists idx_certificates_student_id on certificates(student_id);
create index if not exists idx_reviews_student_id on reviews(student_id);
create index if not exists idx_reviews_course_id on reviews(course_id);
create index if not exists idx_discussions_course_id on discussions(course_id);
create index if not exists idx_discussions_student_id on discussions(student_id);
create index if not exists idx_discussion_answers_discussion_id on discussion_answers(discussion_id);
create index if not exists idx_notifications_user_id on notifications(user_id);
create index if not exists idx_problem_attempts_student_id on problem_attempts(student_id);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table users enable row level security;
alter table students enable row level security;
alter table categories enable row level security;
alter table batches enable row level security;
alter table courses enable row level security;
alter table course_modules enable row level security;
alter table course_topics enable row level security;
alter table batch_courses enable row level security;
alter table tests enable row level security;
alter table test_questions enable row level security;
alter table test_attempts enable row level security;
alter table batch_tests enable row level security;
alter table assignments enable row level security;
alter table submissions enable row level security;
alter table batch_assignments enable row level security;
alter table fees enable row level security;
alter table payments enable row level security;
alter table coupons enable row level security;
alter table enrollments enable row level security;
alter table certificates enable row level security;
alter table certificate_templates enable row level security;
alter table reviews enable row level security;
alter table discussions enable row level security;
alter table discussion_answers enable row level security;
alter table notifications enable row level security;
alter table problem_attempts enable row level security;
alter table completed_batches enable row level security;

-- 1. users: PII PROTECTED (Authenticated read, Admin all)
drop policy if exists "users_auth_read" on users;
create policy "users_auth_read" on users for select using (auth.role() = 'authenticated');

drop policy if exists "users_admin_all" on users;
create policy "users_admin_all" on users for all using (is_admin());

-- 2. students: SELF INSERT, OWN SELECT/UPDATE, ADMIN ALL
drop policy if exists "students_insert_self" on students;
create policy "students_insert_self" on students for insert with check (auth.uid() = id);

drop policy if exists "students_own_select" on students;
create policy "students_own_select" on students for select using (auth.uid() = id or is_admin());

drop policy if exists "students_own_update" on students;
create policy "students_own_update" on students for update using (auth.uid() = id or is_admin());

drop policy if exists "students_admin_all" on students;
create policy "students_admin_all" on students for all using (is_admin());

-- 3. categories: PUBLIC READ, ADMIN ALL
drop policy if exists "categories_read" on categories;
create policy "categories_read" on categories for select using (true);

drop policy if exists "categories_admin_all" on categories;
create policy "categories_admin_all" on categories for all using (is_admin());

-- 4. batches: PUBLIC READ ACTIVE, ADMIN ALL
drop policy if exists "batches_read" on batches;
create policy "batches_read" on batches for select using (is_active = true or is_admin());

drop policy if exists "batches_admin_all" on batches;
create policy "batches_admin_all" on batches for all using (is_admin());

-- 5. courses: PUBLIC READ PUBLISHED, ADMIN ALL
drop policy if exists "courses_read" on courses;
create policy "courses_read" on courses for select using (is_published = true or is_admin());

drop policy if exists "courses_admin_all" on courses;
create policy "courses_admin_all" on courses for all using (is_admin());

-- 6. course_modules: PUBLIC READ, ADMIN ALL
drop policy if exists "modules_read" on course_modules;
create policy "modules_read" on course_modules for select using (true);

drop policy if exists "modules_admin_all" on course_modules;
create policy "modules_admin_all" on course_modules for all using (is_admin());

-- 7. course_topics: PUBLIC READ, ADMIN ALL
drop policy if exists "topics_read" on course_topics;
create policy "topics_read" on course_topics for select using (true);

drop policy if exists "topics_admin_all" on course_topics;
create policy "topics_admin_all" on course_topics for all using (is_admin());

-- 8. batch_courses: PUBLIC READ, ADMIN ALL
drop policy if exists "batch_courses_read" on batch_courses;
create policy "batch_courses_read" on batch_courses for select using (true);

drop policy if exists "batch_courses_admin_all" on batch_courses;
create policy "batch_courses_admin_all" on batch_courses for all using (is_admin());

-- 9. tests: AUTH READ, ADMIN ALL
drop policy if exists "tests_read" on tests;
create policy "tests_read" on tests for select using (auth.role() = 'authenticated' or is_admin());

drop policy if exists "tests_admin_all" on tests;
create policy "tests_admin_all" on tests for all using (is_admin());

-- 10. test_questions: AUTH READ, ADMIN ALL
drop policy if exists "test_questions_read" on test_questions;
create policy "test_questions_read" on test_questions for select using (auth.role() = 'authenticated' or is_admin());

drop policy if exists "test_questions_admin_all" on test_questions;
create policy "test_questions_admin_all" on test_questions for all using (is_admin());

-- 11. test_attempts: OWN READ/INSERT, ADMIN ALL
drop policy if exists "attempts_own_read" on test_attempts;
create policy "attempts_own_read" on test_attempts for select using (auth.uid() = student_id or is_admin());

drop policy if exists "attempts_own_insert" on test_attempts;
create policy "attempts_own_insert" on test_attempts for insert with check (auth.uid() = student_id or is_admin());

drop policy if exists "attempts_admin_all" on test_attempts;
create policy "attempts_admin_all" on test_attempts for all using (is_admin());

-- 12. batch_tests: AUTH READ, ADMIN ALL
drop policy if exists "batch_tests_read" on batch_tests;
create policy "batch_tests_read" on batch_tests for select using (true);

drop policy if exists "batch_tests_admin_all" on batch_tests;
create policy "batch_tests_admin_all" on batch_tests for all using (is_admin());

-- 13. assignments: AUTH READ, ADMIN ALL
drop policy if exists "assignments_read" on assignments;
create policy "assignments_read" on assignments for select using (auth.role() = 'authenticated' or is_admin());

drop policy if exists "assignments_admin_all" on assignments;
create policy "assignments_admin_all" on assignments for all using (is_admin());

-- 14. submissions: OWN READ/INSERT/UPDATE, ADMIN ALL
drop policy if exists "submissions_own_read" on submissions;
create policy "submissions_own_read" on submissions for select using (auth.uid() = student_id or is_admin());

drop policy if exists "submissions_own_insert" on submissions;
create policy "submissions_own_insert" on submissions for insert with check (auth.uid() = student_id or is_admin());

drop policy if exists "submissions_own_update" on submissions;
create policy "submissions_own_update" on submissions for update using (auth.uid() = student_id or is_admin());

drop policy if exists "submissions_admin_all" on submissions;
create policy "submissions_admin_all" on submissions for all using (is_admin());

-- 15. batch_assignments: AUTH READ, ADMIN ALL
drop policy if exists "batch_assignments_read" on batch_assignments;
create policy "batch_assignments_read" on batch_assignments for select using (true);

drop policy if exists "batch_assignments_admin_all" on batch_assignments;
create policy "batch_assignments_admin_all" on batch_assignments for all using (is_admin());

-- 16. fees: OWN READ, ADMIN ALL
drop policy if exists "fees_own_read" on fees;
create policy "fees_own_read" on fees for select using (auth.uid() = student_id or is_admin());

drop policy if exists "fees_admin_all" on fees;
create policy "fees_admin_all" on fees for all using (is_admin());

-- 17. payments: OWN READ, ADMIN ALL
drop policy if exists "payments_own_read" on payments;
create policy "payments_own_read" on payments for select using (auth.uid() = student_id or is_admin());

drop policy if exists "payments_admin_all" on payments;
create policy "payments_admin_all" on payments for all using (is_admin());

-- 18. coupons: PUBLIC READ ACTIVE, ADMIN ALL
drop policy if exists "coupons_read" on coupons;
create policy "coupons_read" on coupons for select using (true);

drop policy if exists "coupons_admin_all" on coupons;
create policy "coupons_admin_all" on coupons for all using (is_admin());

-- 19. enrollments: OWN READ/INSERT, ADMIN ALL
drop policy if exists "enrollments_own_read" on enrollments;
create policy "enrollments_own_read" on enrollments for select using (auth.uid() = student_id or is_admin());

drop policy if exists "enrollments_own_insert" on enrollments;
create policy "enrollments_own_insert" on enrollments for insert with check (auth.uid() = student_id or is_admin());

drop policy if exists "enrollments_admin_all" on enrollments;
create policy "enrollments_admin_all" on enrollments for all using (is_admin());

-- 20. certificates: OWN ISSUED READ, ADMIN ALL
drop policy if exists "certificates_own_read" on certificates;
create policy "certificates_own_read" on certificates for select using ((auth.uid() = student_id and is_issued = true) or is_admin());

drop policy if exists "certificates_admin_all" on certificates;
create policy "certificates_admin_all" on certificates for all using (is_admin());

-- 21. certificate_templates: PUBLIC READ ACTIVE, ADMIN ALL
drop policy if exists "certificate_templates_read" on certificate_templates;
create policy "certificate_templates_read" on certificate_templates for select using (is_active = true or is_admin());

drop policy if exists "certificate_templates_admin_all" on certificate_templates;
create policy "certificate_templates_admin_all" on certificate_templates for all using (is_admin());

-- 22. reviews: PUBLIC READ PUBLISHED, OWN INSERT/UPDATE, ADMIN ALL
drop policy if exists "reviews_read" on reviews;
create policy "reviews_read" on reviews for select using (is_published = true or auth.uid() = student_id or is_admin());

drop policy if exists "reviews_own_insert" on reviews;
create policy "reviews_own_insert" on reviews for insert with check (auth.uid() = student_id or is_admin());

drop policy if exists "reviews_own_update" on reviews;
create policy "reviews_own_update" on reviews for update using (auth.uid() = student_id or is_admin());

drop policy if exists "reviews_admin_all" on reviews;
create policy "reviews_admin_all" on reviews for all using (is_admin());

-- 23. discussions: AUTH READ, AUTH INSERT, ADMIN ALL (PII Protected)
drop policy if exists "discussions_auth_read" on discussions;
create policy "discussions_auth_read" on discussions for select using (auth.role() = 'authenticated' or is_admin());

drop policy if exists "discussions_auth_insert" on discussions;
create policy "discussions_auth_insert" on discussions for insert with check (auth.role() = 'authenticated' or is_admin());

drop policy if exists "discussions_admin_all" on discussions;
create policy "discussions_admin_all" on discussions for all using (is_admin());

-- 24. discussion_answers: AUTH READ, AUTH INSERT, ADMIN ALL (PII Protected)
drop policy if exists "answers_auth_read" on discussion_answers;
create policy "answers_auth_read" on discussion_answers for select using (auth.role() = 'authenticated' or is_admin());

drop policy if exists "answers_auth_insert" on discussion_answers;
create policy "answers_auth_insert" on discussion_answers for insert with check (auth.role() = 'authenticated' or is_admin());

drop policy if exists "answers_admin_all" on discussion_answers;
create policy "answers_admin_all" on discussion_answers for all using (is_admin());

-- 25. notifications: OWN READ/UPDATE, ADMIN ALL
drop policy if exists "notifications_own_read" on notifications;
create policy "notifications_own_read" on notifications for select using (auth.uid() = user_id or is_admin());

drop policy if exists "notifications_own_update" on notifications;
create policy "notifications_own_update" on notifications for update using (auth.uid() = user_id or is_admin());

drop policy if exists "notifications_admin_all" on notifications;
create policy "notifications_admin_all" on notifications for all using (is_admin());

-- 26. problem_attempts: OWN READ/INSERT, ADMIN ALL
drop policy if exists "problem_attempts_own_read" on problem_attempts;
create policy "problem_attempts_own_read" on problem_attempts for select using (auth.uid() = student_id or is_admin());

drop policy if exists "problem_attempts_own_insert" on problem_attempts;
create policy "problem_attempts_own_insert" on problem_attempts for insert with check (auth.uid() = student_id or is_admin());

drop policy if exists "problem_attempts_admin_all" on problem_attempts;
create policy "problem_attempts_admin_all" on problem_attempts for all using (is_admin());

-- completed_batches: PUBLIC READ, ADMIN ALL
drop policy if exists "completed_batches_read" on completed_batches;
create policy "completed_batches_read" on completed_batches for select using (true);

drop policy if exists "completed_batches_admin_all" on completed_batches;
create policy "completed_batches_admin_all" on completed_batches for all using (is_admin());

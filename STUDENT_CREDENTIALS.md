# 🎓 CodeLift Platform — Student & Testing Credentials Reference

This document lists default testing student accounts created in **Supabase Auth** and available for testing across the CodeLift platform.

---

## 🔑 Default Student Passwords
- **All Students (existing seed accounts and newly enrolled)**: `password`

---

## 🧑‍🎓 Student Test Accounts

Sign in at: [https://codelift-official.github.io/platform/login](https://codelift-official.github.io/platform/login)

| Student Name | Email Address | Default Password | Enrolled Cohort / Batch | Fee Status | Phone |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Rahul Sharma** | `rahul.sharma@example.com` | `password` | Full Stack Web Development (Morning) | Paid (₹25,000) | `+91 9876543210` |
| **Priya Patel** | `priya.patel@example.com` | `password` | Data Analytics (Weekend) | Partial (₹15,000 / ₹30,000) | `+91 9876543211` |
| **Amit Verma** | `amit.v@example.com` | `password` | Full Stack Web Development (Morning) | Paid (₹25,000) | `+91 9876543212` |
| **Sneha Reddy** | `sneha.r@example.com` | `password` | Full Stack Web Development (Evening) | Partial (₹10,000 / ₹25,000) | `+91 9876543213` |

> [!NOTE]
> Every student created via the Admin Portal or database is automatically provisioned in Supabase Auth with the default password `password` via database trigger `trg_provision_student_auth`.

---

## 🛡️ Institutional Administrator Accounts

Sign in at: [https://codelift-official.github.io/platform/admin/login](https://codelift-official.github.io/platform/admin/login)

| Name | Username | Email Address | Password Storage | Role & Privileges |
| :--- | :--- | :--- | :--- | :--- |
| **Rishabh** | `rishabh` | `codelift.official@gmail.com` | Configured privately via Supabase Auth / Secrets | Primary Administrator (Governance, Batches, Users) |
| **Administrator** | `admin` | `admin@codelift.dev` | Configured privately via Supabase Auth / Secrets | System Administrator Account |

> [!IMPORTANT]
> Official administrator passwords are never stored in tracked repository files. Administrator passwords are managed through Supabase Auth Dashboard or private environment variables (`ADMIN_PASSWORD` in `.env.local`).

---

## 📁 Related Source Data Files
- **Student Profiles & Progress**: [`data/students.json`](./data/students.json)
- **Student Credentials JSON**: [`data/student-credentials.json`](./data/student-credentials.json)
- **User & Admin Profiles**: [`data/users.json`](./data/users.json)
- **Batch Definitions**: [`data/batches.json`](./data/batches.json)
- **Fee Ledgers**: [`data/fees.json`](./data/fees.json)

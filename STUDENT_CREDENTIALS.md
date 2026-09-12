# 🎓 CodeLift Platform — Default Credentials Reference

This document lists all default accounts created in **Supabase Auth** and available for testing across the CodeLift platform.

---

## 🔑 Default Passwords Summary
- **All Students (existing and newly created)**: `password`
- **Primary Administrator (`rishabh`)**: `admin1245`
- **System Administrator (`admin@codelift.dev`)**: `CodeLift15July`

---

## 🧑‍🎓 Student Accounts

Sign in at: [https://codelift-official.github.io/platform/login](https://codelift-official.github.io/platform/login)

| Student Name | Email Address | Password | Enrolled Cohort / Batch | Fee Status | Phone |
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

| Name | Username | Email Address | Password | Role & Privileges |
| :--- | :--- | :--- | :--- | :--- |
| **Rishabh** | `rishabh` | `codelift.official@gmail.com` | `admin1245` | Primary Administrator (Institutional Governance, Financials, Users) |
| **Administrator** | `admin` | `admin@codelift.dev` | `CodeLift15July` | System Administrator Account |

---

## 📁 Related Source Data Files
- **Student Profiles & Progress**: [`data/students.json`](./data/students.json)
- **Student Credentials JSON**: [`data/student-credentials.json`](./data/student-credentials.json)
- **User & Admin Profiles**: [`data/users.json`](./data/users.json)
- **Batch Definitions**: [`data/batches.json`](./data/batches.json)
- **Fee Ledgers**: [`data/fees.json`](./data/fees.json)

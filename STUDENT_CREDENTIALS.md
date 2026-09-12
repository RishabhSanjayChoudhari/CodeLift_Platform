# 🎓 CodeLift Platform — Default Credentials Reference

This document lists all default seed accounts created in **Supabase Auth** and available for testing across the CodeLift platform.

---

## 🔑 Global Default Password
For all pre-seeded accounts (both students and admin), the default password is:
```text
CodeLift15July
```
*(Defined by `SEED_DEFAULT_PASSWORD` in `.env.local` and `scripts/migrate-json-to-supabase.js`)*

---

## 🧑‍🎓 Student Accounts

Sign in at: [https://codelift-official.github.io/platform/login](https://codelift-official.github.io/platform/login)

| Student Name | Email Address | Password | Enrolled Cohort / Batch | Fee Status | Phone |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Rahul Sharma** | `rahul.sharma@example.com` | `CodeLift15July` | Full Stack Web Development (Morning) | Paid (₹25,000) | `+91 9876543210` |
| **Priya Patel** | `priya.patel@example.com` | `CodeLift15July` | Data Analytics (Weekend) | Partial (₹15,000 / ₹30,000) | `+91 9876543211` |
| **Amit Verma** | `amit.v@example.com` | `CodeLift15July` | Full Stack Web Development (Morning) | Paid (₹25,000) | `+91 9876543212` |
| **Sneha Reddy** | `sneha.r@example.com` | `CodeLift15July` | Full Stack Web Development (Evening) | Partial (₹10,000 / ₹25,000) | `+91 9876543213` |

---

## 🛡️ Institutional Administrator Account

Sign in at: [https://codelift-official.github.io/platform/admin/login](https://codelift-official.github.io/platform/admin/login)

| Name | Username | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin@codelift.dev` | `CodeLift15July` | Full Institutional Management, Curriculum, Batches, Fees & System Settings |

---

## 📁 Related Source Data Files
- **Student Profiles & Progress**: [`data/students.json`](./data/students.json)
- **User & Admin Profiles**: [`data/users.json`](./data/users.json)
- **Batch Definitions**: [`data/batches.json`](./data/batches.json)
- **Fee Ledgers**: [`data/fees.json`](./data/fees.json)

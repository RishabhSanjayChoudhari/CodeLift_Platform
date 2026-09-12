# Supabase Storage as a Primary Store with Optimistic Locking

Why deploy expensive relational databases for Phase 1 MVP architectures when your entity footprint is compact and structured?

---

## 1. The JSON-First Philosophy

By treating **Supabase Storage** (or S3-compatible object storage) as an atomic key-value document repository:
- Zero idle database computing costs.
- Instant schema elasticity: adding new attributes requires no database migrations.
- Easy export and auditability: your entire database is an array of clean JSON files.
- High availability with automated global CDN edge caching for read-heavy entities.

---

## 2. Optimistic Concurrency Control (OCC)

When multiple serverless functions write to a shared JSON file simultaneously:

```
Function A: Read students.json (ETag: "abc") ──────┐
                                                  ▼
Function B: Read students.json (ETag: "abc") ─┐   Modifies -> Uploads with If-Match: "abc" (Success! ETag -> "def")
                                              ▼
                                              Modifies -> Uploads with If-Match: "abc" (CONFLICT 412!)
                                              ▼
                                              Retries: Read (ETag "def") -> Re-applies -> Uploads (Success!)
```

Implementing optimistic locking ensures high integrity without holding persistent database locks!

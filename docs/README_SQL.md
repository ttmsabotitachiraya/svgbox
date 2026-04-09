# README — SQL files for SVGBox

This document explains the SQL files included in the repository, what each file does, and recommended steps to run them safely in Supabase (or any Postgres instance). Read the notes and run the scripts in a non-production/staging environment first.

---

## File locations (project-relative)
- `migration.sql`  
  - Contains incremental migration: add `role`, `last_seen_at`, helper functions, and some RLS updates.
- `migration2.sql`  
  - Profile enhancements: drop `avatar_url`, add contact fields, username index, update triggers, add user profile update function, update admin list function.
- `schema.sql`  
  - Full DB schema definition (tables, columns, core structure). Intended for initial DB creation.
- `supabase_setup.sql` (full setup) — located at `sql/final/03_supabase_setup_full.sql` and also a wrapper `sql/release/supabase_setup.sql`  
  - Complete setup script: schema, indexes, triggers, functions, RLS policies, and helper RPCs. Suitable for a new deployment.
- `sql/final/01_migration.sql` and `sql/final/02_migration2.sql`  
  - Convenience copies of `migration.sql` and `migration2.sql` (ready-to-run migration scripts).
- `sql/release/supabase_setup.sql`  
  - A combined wrapper recommending usage; the actual full script is in `sql/final/03_supabase_setup_full.sql`.

> Note: There may also be backup/original copies under `sql_backup/`. Use those only if you need to inspect the original `supabase_setup.sql`.

---

## Recommended run strategy

### A. New database (no existing SVGBox schema)
1. Open Supabase → SQL Editor (or connect to your Postgres instance).
2. Run the full setup:
   - Open `sql/final/03_supabase_setup_full.sql` and run the whole script.
   - Or run the release wrapper `sql/release/supabase_setup.sql` (this wrapper points to the full script).
3. After successful run, optionally run verification queries (see below).

This will create tables, indices, triggers, functions and RLS policies.

### B. Existing database (already has `svgbox_*` tables)
1. Backup your database (see Rollback & backup notes below).
2. Run migrations in order:
   - `sql/final/01_migration.sql`
   - `sql/final/02_migration2.sql`
3. Verify results (see Verification section).

Rationale: the migration scripts are written to be reasonably idempotent (use `IF NOT EXISTS`, `DROP ... IF EXISTS`, `CREATE OR REPLACE`, etc.). Running migrations against an existing schema minimizes accidental overwrites of unrelated schema items.

---

## How to run safely in Supabase SQL Editor
1. Go to your Supabase project → SQL → Editor.
2. Paste the SQL content or upload the file contents.
3. Click Run.
4. Watch the execution log for any errors and fix them before proceeding.
5. If you have multiple migrations, run them in the recommended order.

If you prefer CLI:
- Use `psql` or your preferred DB client to run:
  - psql -h <host> -p <port> -U <user> -d <db> -f path/to/sqlfile.sql

---

## Verification queries (run after migrations)
- Check columns in `svgbox_profiles`:
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'svgbox_profiles'
ORDER BY ordinal_position;
```

- List row-level security policies for `svgbox_assets`:
```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'svgbox_assets';
```

- Test admin-only RPC (must be called as an admin user):
```sql
SELECT * FROM svgbox_admin_list_users();
```

- Promote a user to admin (manual one-time action — replace the uuid):
```sql
UPDATE svgbox_profiles
SET role = 'admin'
WHERE id = '<paste-user-uuid-here>';
```

---

## Rollback & backup recommendations
- Always take a Postgres dump or export before running migrations:
  - Using Supabase UI: create a backup / use the "Backups" feature (if available).
  - Using `pg_dump`:
    ```
    pg_dump -h <host> -p <port> -U <user> -d <db> -Fc -f svgbox_pre_migration.dump
    ```
- Migrations in these files are not fully reversible automatically. If you need to roll back changes that alter or drop columns, restore from backup.
- Test migrations in a staging environment that mirrors production before applying to production.

---

## Idempotency notes
- Scripts attempt to be safe for re-run by using:
  - `CREATE EXTENSION IF NOT EXISTS`
  - `CREATE TABLE IF NOT EXISTS`
  - `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
  - `DROP POLICY IF EXISTS`
  - `CREATE OR REPLACE FUNCTION`
  - `CREATE INDEX IF NOT EXISTS`
- However, structural changes like dropping a column (e.g., `DROP COLUMN avatar_url`) are destructive. Ensure you have backups and that the column removal is intended.

---

## Troubleshooting & tips
- If a `CREATE TRIGGER` or `CREATE FUNCTION` fails due to missing referenced tables, ensure you ran the core schema (`schema.sql`) or full setup first.
- If RLS blocks expected behavior in the app, check:
  - That the policies exist and are correct.
  - That `svgbox_is_admin()` returns expected value for your admin test user.
- If you see permission errors from Supabase RPC calls, confirm:
  - The RPC function exists and has `SECURITY DEFINER` where needed.
  - The auth user invoking RPC has appropriate role / session (login required for protected RPCs).

---

## Files summary (quick)
- For new deployments:
  - `sql/final/03_supabase_setup_full.sql` (full setup)
  - Wrapper: `sql/release/supabase_setup.sql`
- For upgrading existing DB:
  - `sql/final/01_migration.sql`
  - `sql/final/02_migration2.sql`
- Reference / original schema:
  - `schema.sql`

---

## If you want me to:
- Create a single consolidated `supabase_setup.sql` file that includes the final, cleaned contents (I can generate that for you).
- Generate a small rollback script for specific migration steps.
- Produce a checklist to run in staging → production.

Tell me which you prefer and I will prepare the file / instructions accordingly.
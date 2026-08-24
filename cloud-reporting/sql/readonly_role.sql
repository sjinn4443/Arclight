\set ON_ERROR_STOP on

BEGIN;

DO $role$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'arclight_reporting_readonly'
  ) THEN
    CREATE ROLE arclight_reporting_readonly
      NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT
      NOREPLICATION NOBYPASSRLS;
  END IF;
END
$role$;

GRANT CONNECT ON DATABASE railway TO arclight_reporting_readonly;
GRANT USAGE ON SCHEMA public TO arclight_reporting_readonly;
GRANT SELECT ON TABLE
  public.app_users,
  public.ip_logs,
  public.app_users_latest_first,
  public.ip_logs_latest_first
TO arclight_reporting_readonly;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
ON TABLE public.app_users, public.ip_logs
FROM arclight_reporting_readonly;

ALTER ROLE arclight_reporting_readonly SET default_transaction_read_only = on;
ALTER ROLE arclight_reporting_readonly SET statement_timeout = '30s';
ALTER ROLE arclight_reporting_readonly SET lock_timeout = '5s';

COMMIT;

-- Create the LOGIN role separately with a generated password supplied directly
-- to psql, then grant arclight_reporting_readonly to it. Never commit or paste
-- the password into chat, GitHub, logs or this file.


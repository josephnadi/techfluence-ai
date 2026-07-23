-- Schedules the two admin-notification edge functions, which previously had no
-- scheduling anywhere (they existed as public HTTPS endpoints nobody called).
-- They now require an `x-cron-secret` header (see the CRON_SECRET checks added
-- to their source), so this job reads the matching value out of Supabase Vault
-- rather than hardcoding a secret in a git-committed file.
--
-- One-time manual setup required before this migration is applied (do NOT put
-- the actual secret value in any file that gets committed):
--   1. In the Supabase SQL Editor, run:
--        select vault.create_secret('<a-long-random-value>', 'cron_secret',
--          'Shared secret for internal cron-triggered edge functions');
--   2. Set the SAME value as an edge function secret:
--        supabase secrets set CRON_SECRET=<the-same-long-random-value>

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'send-consultation-reminders-daily',
  '0 8 * * *', -- 08:00 UTC daily
  $$
  select net.http_post(
    url := 'https://kkrjpsjbtommfvykgvtk.supabase.co/functions/v1/send-consultation-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')
    )
  );
  $$
);

select cron.schedule(
  'send-notification-digest-hourly',
  '0 * * * *', -- runs every hour; the function itself filters by each admin's chosen digest_hour
  $$
  select net.http_post(
    url := 'https://kkrjpsjbtommfvykgvtk.supabase.co/functions/v1/send-notification-digest',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')
    )
  );
  $$
);

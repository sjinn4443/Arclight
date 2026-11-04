# Practice reminders

Practice reminders are off until the learner taps Enable reminders and grants
notification permission. Settings offers an on/off control and a local reminder
time (18:00 initially). Existing `settings:notifications` values do not grant
permission or subscribe a device. No sign-in is required.

The app tracks learning after a progress advance following interaction, 30 seconds
of visible video playback, or 60 seconds of recently interacted-with learning
time. Opening the home page does not count.
Interactions inside same-origin embedded simulators also count toward learning
time; answering their quiz controls counts immediately. External iframes cannot
expose practice events to Arclight.
Device-local timestamps are retained offline and uploaded when online or when
returning to the app. The wording avoids
exact inactivity claims because offline activity may not have synced yet.

Each device receives a reminder at 1, 3, 7 and 30 elapsed days from its last
practice. Each check selects only the latest reached milestone; missed reminders
are not replayed together. After day 30, reminders pause until practice resumes.
Delivery is attempted within one hour of the preferred local time, every five
minutes. It is best effort: connectivity, OS settings, Focus and power saving can
delay or prevent delivery. Push messages expire after one hour and replace older
practice reminders. DST uses the saved IANA timezone, refreshed when the app syncs.

## Server setup

1. Install dependencies normally (`npm ci`).
2. Run `node scripts/generate-web-push-keys.cjs` once. Set the generated
   `WEB_PUSH_PUBLIC_KEY` and `WEB_PUSH_PRIVATE_KEY` in the server environment.
   Retain the same keys across deployments; changing them requires resubscription.
3. Set `WEB_PUSH_SUBJECT` to a real contact mailto URL and `WEB_PUSH_ENABLED=true`.
4. Configure `DATABASE_URL` with permission to create `practice_reminders`.
   Production requires Postgres. Local development may use the existing
   `ENCRYPTION_SECRET` and an encrypted file; `REMINDER_STORAGE=file` selects it
   even when a DB URL is configured. `DISABLE_DB_STORAGE=1` disables reminders.
5. Run the regular Node server (`node server.cjs`) continuously. Its scheduler
   starts with the server. No separate cron service is required. Sleeping or
   scale-to-zero hosting cannot send reminders while asleep.
6. Deploy over HTTPS. On iOS/iPadOS 16.4+, add Arclight to the Home Screen and
   open that installation. Allow outbound HTTPS to browser push providers.

Without working configuration/storage, the client reports that reminders are
unavailable and does not ask for notification permission. The public config
endpoint exposes only the public VAPID key. The private key is never bundled.

## Data and delivery

Subscriptions belong to the installation, not a learning account. Switching
accounts does not move a device's notification consent to another phone. The
browser stores a random device bearer token outside account sync. The database
stores its SHA-256 hash, subscription endpoint/keys, last practice time, app hash
route, reminder time/timezone and delivery milestone. Treat subscription endpoints
as secrets and restrict database access. No email, location or clinical data is
needed. Turn reminders off in Settings before clearing browser data to delete the
server record immediately. Revoked/expired subscriptions are deleted on 404/410
responses. Offline disabling unsubscribes locally where possible and queues the
server deletion until reconnect.

Postgres transactions serialize practice updates, opt-outs and sends per device,
including across multiple server replicas. Successful delivery advances the
milestone; temporary provider failures wait at least an hour before retrying.
Provider acceptance and the DB commit cannot be atomic: a process crash between
them can cause a retry. Notification tags replace a previous practice reminder.

## Manual device check

- Install on iPhone and Android, practise, enable reminders, and allow permission.
- Confirm Settings remains on after reopening, saves time, and switches off.
- Check blocked permission, unsupported browsers and offline settings messages.
- Test a staged subscription at each threshold using a test database and confirm
  notification tap opens the saved lesson or My Learning. Never alter live learner
  timestamps for testing.
- Practise offline, reconnect, and confirm the server timestamp advances and
  restarts the milestone sequence. Verify no reminders arrive after opt-out.

Automated coverage uses isolated in-memory stores and mock push delivery; it
never sends real notifications.

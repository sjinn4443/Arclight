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
Delivery is attempted within one hour of the preferred local time, every one
minutes. It is best effort: connectivity, OS settings, Focus and power saving can
delay or prevent delivery. Regular push messages expire after one hour and replace older
practice reminders. DST uses the saved IANA timezone, refreshed when the app syncs.

## Server setup

1. Install dependencies normally (`npm ci`).
2. With working persistent storage, Web Push now initializes automatically when
   manual keys are absent. One VAPID key pair is stored in the private
   `practice_reminder_settings` database table (or the encrypted development
   store), shared across replicas and reused after restarts and deployments.
   The default contact is `mailto:support@arclightproject.com`.
3. Optionally override the contact with `WEB_PUSH_SUBJECT`. To use managed keys,
   set all three of `WEB_PUSH_PUBLIC_KEY`, `WEB_PUSH_PRIVATE_KEY` and
   `WEB_PUSH_SUBJECT`; incomplete/invalid overrides fail closed. Retain keys
   across deployments. Set `WEB_PUSH_ENABLED=false` to explicitly disable push.
   An unset flag or `true` permits automatic setup; device consent is still required.
4. Configure `DATABASE_URL` with permission to create `practice_reminders`.
   Production requires Postgres. Local development may use the existing
   `ENCRYPTION_SECRET` and an encrypted file; `REMINDER_STORAGE=file` selects it
   even when a DB URL is configured. `DISABLE_DB_STORAGE=1` disables reminders.
5. Run the regular Node server (`node server.cjs`) continuously. Its scheduler
   starts with the server. No separate cron service is required. Sleeping or
   scale-to-zero hosting cannot send reminders while asleep.
6. Deploy over HTTPS. On iOS/iPadOS 16.4+, add Arclight to the Home Screen and
   open that installation. Allow outbound HTTPS to browser push providers.

Without working configuration/storage, the client reports the reason and does
not ask for notification permission. `/api/reminders/config` distinguishes
`disabled`, `configuration_invalid`, and `storage_unavailable`, without exposing
internal errors or credentials. The public config
endpoint exposes only the public VAPID key. The private key is never bundled.
Restrict the settings table to the application's DB role and protected backups;
it contains the server's private signing key. Losing it requires resubscription.

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

## First notification and notification history

After an opted-in device subscription is saved, the server immediately attempts
one welcome notification: "Ready for a little practice? Continue where you left off."
This does not require a practice timestamp. Existing active subscriptions without
a welcome marker are processed by the next scheduler check. Temporary failures
retry after at least one minute; expired subscriptions are disabled. A successful
welcome marker survives resubscription, practice updates and turning reminders
off/on, so ordinary reloads and deployments do not send another welcome.
The welcome notification expires after 24 hours if the phone remains offline.
Regular reminders wait at least 24 hours after a successful notification.

My Profile's bell opens a device-specific notification inbox with the latest 100
successful server sends, newest first, dates and lesson links. History starts
with this feature's deployment; previous sends cannot be reconstructed. "Sent"
means accepted by the push provider, not proof the phone displayed the alert.
Turning reminders off keeps the device's history and welcome marker but removes
its active subscription. `/api/reminders/history` requires the same device bearer
token; it returns only notifications and active status, never subscription keys.
The popup caches history locally for offline reading and tracks read status on
this device. This history is independent of optional learning accounts.

The Settings toggle reflects a confirmed stored subscription and only an explicit
permission denial turns it off; iOS may temporarily report a default permission
value after its prompt. Safari subscription keys with optional base64 padding
are accepted and normalized before storage.

## Provider rejection diagnostics

The reported noti05 logs show active registrations whose sends were rejected
with HTTP 400. This occurs before the phone receives a message; phone permission
alone cannot resolve a rejected server request. The transport now explicitly uses
AES128GCM, high urgency, and omits the optional Topic header. Provider reason codes
(for example BadWebPushTopic or BadJwtToken) are allowlisted before logging and
stored privately on the device record. Raw response bodies, endpoints, bearer
tokens and signing keys are never logged. HTTP 400 alone does not establish which
field the provider rejected; use the reason in the next deployment's logs.
BadWebPushToken and VapidPkHashMismatch invalidate the saved endpoint. Explicit
enabling renews it once and retries with the same request ID. Signing errors
retain the subscription rather than needlessly asking the phone to renew.

The user-requested noti06-practice-check attempts one send to active registrations
present before 2026-11-05 07:46:41 UTC. Pending welcomes and enable tests satisfy
that send without a simultaneous duplicate. Provider acceptance still must be
verified separately from phone display.

The documented single-hop Railway topology defaults to TRUST_PROXY=1 when its
project, service and environment markers are present in production. Explicit
settings (including 0) win; other environments retain disabled proxy trust.

## noti05 immediate enable notification

Every explicit switch-on requests an immediate test notification, including
turning reminders off and back on after an earlier successful welcome. A random
request ID survives failed registration retries; ordinary app sync does not
create another request. Successful enable notifications are deduplicated by ID.
The API reports provider acceptance or a pending retry instead of hiding delivery
failures. Pending sends retry after a minute, including devices whose regular
day-30 reminders have paused. Turning reminders off cancels pending enable sends.
Distinct notification IDs use distinct notification tags so a new test can alert
instead of silently replacing an earlier alert. Duplicate IDs still replace
themselves. Provider acceptance does not prove iOS displayed an alert.

The user-requested `noti05-practice-check` sends once to active subscriptions
registered before 2026-11-05 06:11:10 UTC, including legacy records without dates.
A pending enable or welcome satisfies that broadcast without two simultaneous
messages. Server logs expose only acceptance counts and provider status codes.
The chosen daily time still applies to inactivity reminders after 1/3/7/30 days;
it is not a daily alarm independent of practice.

## noti04 proxy fix and one-time send

The public app's exact HTTPS origins (`https://www.arclightproject.app` and
`https://arclightproject.app`) are accepted through Railway's backend HTTP
connection. The check does not trust client-supplied forwarded headers or accept
insecure public origins, other sites, suffix matches, or arbitrary subdomains.
Device bearer authentication remains required. A 403 now explains app request
verification instead of incorrectly suggesting an internet connection problem.

An explicitly permitted registration that failed before being saved is resumed
when the Home Screen app is reopened. Intentional opt-outs remain off. A phone
with only OS permission but no saved subscription cannot receive server push
until this registration completes.

The user-requested `noti04-practice-check` campaign attempts one practice
notification to active subscriptions registered before 2026-11-04 13:35:08 UTC.
Unknown registration dates on legacy records qualify. New subscribers receive
their welcome instead; a pending welcome also satisfies the campaign without
sending two messages. Per-device campaign receipts survive practice updates,
resubscription, restarts and history trimming. Temporary failures retry after a
minute, and provider acceptance counts are logged privately by the scheduler.
The campaign is deployment-triggered; no unauthenticated broadcast API exists.

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

const DAY = 86400000;
const MILESTONES = [1, 3, 7, 30];
const MESSAGES = {
  1: "Ready for a little practice? Continue where you left off.",
  3: "A few minutes can keep your learning moving. Try a quick quiz.",
  7: "Time for a refresher? Revisit your last Arclight lesson.",
  30: "Ready to return? Your Arclight learning is waiting.",
};

function validTimezone(value) {
  if (typeof value !== "string" || value.length > 80) return false;
  try {
    new Intl.DateTimeFormat("en", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

function safePracticeUrl(value) {
  // Only app-owned hash routes; never put arbitrary external URLs in a push.
  return typeof value === "string" &&
    /^\/#\/[a-zA-Z][a-zA-Z0-9_-]{0,79}(?:\/[a-zA-Z][a-zA-Z0-9_-]{0,119})?$/.test(
      value,
    )
    ? value
    : "/#/mylearning";
}

function dueMilestone(record, now = Date.now()) {
  if (!record.lastPracticedAt || record.retryAfter > now) return null;
  const elapsed = now - record.lastPracticedAt;
  const milestone = MILESTONES.filter((day) => elapsed >= day * DAY).pop();
  if (!milestone || milestone <= record.sentMilestone) return null;
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: record.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map(({ type, value }) => [type, value]),
  );
  const minute = Number(parts.hour) * 60 + Number(parts.minute);
  const [hour, min] = record.reminderTime.split(":").map(Number);
  // A one-hour window avoids late-night catch-up sends after server downtime.
  const offset = (minute - (hour * 60 + min) + 1440) % 1440;
  return offset < 60 ? milestone : null;
}

module.exports = {
  DAY,
  MILESTONES,
  MESSAGES,
  validTimezone,
  safePracticeUrl,
  dueMilestone,
};

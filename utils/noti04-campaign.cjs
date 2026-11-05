// One user-requested broadcast to already-registered, active installations.
// A stable ID and per-device receipt prevent repeats on deploy/restart.
const NOTI04_CAMPAIGN = Object.freeze({
  id: "noti04-practice-check",
  cutoff: Date.parse("2026-11-04T13:35:08Z"),
});
function eligibleForCampaign(record, campaign) {
  return Boolean(
    campaign &&
    record.subscription &&
    (!record.registeredAt || record.registeredAt <= campaign.cutoff) &&
    !record.campaigns?.[campaign.id],
  );
}
const NOTI05_CAMPAIGN = Object.freeze({
  id: "noti05-practice-check",
  cutoff: Date.parse("2026-11-05T06:11:10Z"),
});
module.exports = { NOTI04_CAMPAIGN, NOTI05_CAMPAIGN, eligibleForCampaign };

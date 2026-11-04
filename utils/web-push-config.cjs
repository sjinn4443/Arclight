const webpush = require("web-push");
const { getReminderStore } = require("../storage/reminder-store.cjs");

function disabled(env = process.env) {
  return /^(false|0|off)$/i.test(String(env.WEB_PUSH_ENABLED || "").trim());
}
function validate(config) {
  webpush.setVapidDetails(config.subject, config.publicKey, config.privateKey);
  return config;
}
function readPushConfig(env = process.env) {
  if (disabled(env)) return null;
  const {
    WEB_PUSH_PUBLIC_KEY: publicKey,
    WEB_PUSH_PRIVATE_KEY: privateKey,
    WEB_PUSH_SUBJECT: subject,
  } = env;
  if (!publicKey || !privateKey || !subject) return null;
  try {
    return validate({ publicKey, privateKey, subject });
  } catch {
    return null;
  }
}
async function resolvePushConfig({ store, env = process.env } = {}) {
  if (disabled(env)) return null;
  if (env.WEB_PUSH_PUBLIC_KEY || env.WEB_PUSH_PRIVATE_KEY) {
    const config = readPushConfig(env);
    if (!config)
      throw Object.assign(new Error("push_configuration_invalid"), {
        reason: "configuration_invalid",
      });
    return config;
  }
  const storage = store || getReminderStore();
  const keys = await storage.getOrCreatePushConfig(() =>
    webpush.generateVAPIDKeys(),
  );
  const config = {
    ...keys,
    subject: env.WEB_PUSH_SUBJECT || "mailto:support@arclightproject.com",
  };
  try {
    return validate(config);
  } catch {
    throw Object.assign(new Error("push_configuration_invalid"), {
      reason: "configuration_invalid",
    });
  }
}
module.exports = { readPushConfig, resolvePushConfig };

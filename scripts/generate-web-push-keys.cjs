// Run explicitly, then copy these values to server environment variables.
const { generateVAPIDKeys } = require("web-push");
const keys = generateVAPIDKeys();
process.stdout.write(
  `WEB_PUSH_PUBLIC_KEY=${keys.publicKey}\nWEB_PUSH_PRIVATE_KEY=${keys.privateKey}\n`,
);

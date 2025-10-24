const crypto = require("crypto");

const keyB64 = process.env.MASTER_KEY;
if (!keyB64) throw new Error("MASTER_KEY missing");
const key = Buffer.from(keyB64, "base64");
if (key.length !== 32) {
  throw new Error(
    `MASTER_KEY must decode to 32 bytes, got ${key.length}. Check your Base64 value.`,
  );
}

function encryptField(plain) {
  const iv = crypto.randomBytes(12); // 96-bit nonce
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    iv.toString("base64"),
    enc.toString("base64"),
    tag.toString("base64"),
  ].join(":");
}

function decryptField(packed) {
  const [ivB64, encB64, tagB64] = String(packed).split(":");
  const iv = Buffer.from(ivB64, "base64");
  const enc = Buffer.from(encB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]).toString(
    "utf8",
  );
  return dec;
}

module.exports = { encryptField, decryptField };

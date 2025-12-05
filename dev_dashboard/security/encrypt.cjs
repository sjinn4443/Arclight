const crypto = require("crypto");

const ALGO = "aes-256-gcm";
const SECRET = process.env.ENCRYPTION_SECRET; // long random string
if (!SECRET && process.env.NODE_ENV !== "test") {
  console.error("ENCRYPTION_SECRET is not set.");
}

function deriveKey(salt) {
  // 32 bytes key for AES-256
  return crypto.scryptSync(SECRET, salt, 32);
}

function encrypt(text) {
  if (!SECRET) return text;

  const salt = crypto.randomBytes(16);
  const key = deriveKey(salt);
  const iv = crypto.randomBytes(12); // 12 bytes for GCM

  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  // salt:iv:tag:ciphertext
  return [
    salt.toString("hex"),
    iv.toString("hex"),
    tag.toString("hex"),
    ciphertext.toString("hex"),
  ].join(":");
}

function decrypt(payload) {
  if (!SECRET) return payload;

  const [saltHex, ivHex, tagHex, dataHex] = payload.split(":");
  if (!saltHex || !ivHex || !tagHex || !dataHex) return payload;

  const salt = Buffer.from(saltHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const data = Buffer.from(dataHex, "hex");

  const key = deriveKey(salt);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);

  try {
    const plaintext = Buffer.concat([decipher.update(data), decipher.final()]);
    return plaintext.toString("utf8");
  } catch (e) {
    console.error("Decryption failed:", e.message);
    return payload;
  }
}

module.exports = { encrypt, decrypt };

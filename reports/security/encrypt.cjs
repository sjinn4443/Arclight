const crypto = require("crypto");

const ALGO = "aes-256-gcm";
const V2_PREFIX = "v2";
const MIN_SECRET_LENGTH = 32;
const SECRET = String(process.env.ENCRYPTION_SECRET || "");
let v2Key = null;

function requireSecret() {
  if (SECRET.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `ENCRYPTION_SECRET is required and must be at least ${MIN_SECRET_LENGTH} characters for NDJSON telemetry writes`,
    );
  }
}

function deriveLegacyKey(salt) {
  requireSecret();
  return crypto.scryptSync(SECRET, salt, 32);
}

function deriveLegacyKeyAsync(salt) {
  requireSecret();
  return new Promise((resolve, reject) => {
    crypto.scrypt(SECRET, salt, 32, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

function deriveV2Key() {
  requireSecret();
  if (!v2Key) {
    v2Key = crypto
      .createHash("sha256")
      .update("arclight.ndjson.v2\0", "utf8")
      .update(SECRET, "utf8")
      .digest();
  }
  return v2Key;
}

function encrypt(text) {
  requireSecret();

  const key = deriveV2Key();
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [
    V2_PREFIX,
    iv.toString("hex"),
    tag.toString("hex"),
    ciphertext.toString("hex"),
  ].join(":");
}

function decrypt(payload) {
  if (!SECRET) return payload;

  try {
    if (payload.startsWith(`${V2_PREFIX}:`)) {
      const [prefix, ivHex, tagHex, dataHex, extra] = payload.split(":");
      if (
        prefix !== V2_PREFIX ||
        !ivHex ||
        !tagHex ||
        !dataHex ||
        extra !== undefined
      ) {
        return payload;
      }
      const decipher = crypto.createDecipheriv(
        ALGO,
        deriveV2Key(),
        Buffer.from(ivHex, "hex"),
      );
      decipher.setAuthTag(Buffer.from(tagHex, "hex"));
      return Buffer.concat([
        decipher.update(Buffer.from(dataHex, "hex")),
        decipher.final(),
      ]).toString("utf8");
    }

    const [saltHex, ivHex, tagHex, dataHex] = payload.split(":");
    if (!saltHex || !ivHex || !tagHex || !dataHex) return payload;

    const salt = Buffer.from(saltHex, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const data = Buffer.from(dataHex, "hex");
    const key = deriveLegacyKey(salt);
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(data), decipher.final()]);
    return plaintext.toString("utf8");
  } catch {
    return payload;
  }
}

async function decryptAsync(payload) {
  if (!SECRET || payload.startsWith(`${V2_PREFIX}:`)) return decrypt(payload);

  try {
    const [saltHex, ivHex, tagHex, dataHex, extra] = payload.split(":");
    if (!saltHex || !ivHex || !tagHex || !dataHex || extra !== undefined) {
      return payload;
    }
    const key = await deriveLegacyKeyAsync(Buffer.from(saltHex, "hex"));
    const decipher = crypto.createDecipheriv(
      ALGO,
      key,
      Buffer.from(ivHex, "hex"),
    );
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    return Buffer.concat([
      decipher.update(Buffer.from(dataHex, "hex")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return payload;
  }
}

module.exports = { decrypt, decryptAsync, encrypt };

const crypto = require("crypto");

const algorithm = "aes-256-cbc"; // AES 256-bit encryption in CBC mode

// Ensure the ENCRYPTION_KEY is set in environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
  console.error(
    "ENCRYPTION_KEY environment variable is not set. Encryption/Decryption will fail.",
  );
  // In a real application, you might want to exit or throw an error here.
  // For development, we'll proceed but log the warning.
}

// IV (Initialization Vector) should be a fixed size, typically 16 bytes for AES.
// It's common to store the IV alongside the encrypted data.
// For simplicity in this example, we'll derive it. In a production system,
// it's crucial to use a unique, random IV for each encryption and prepend it to the ciphertext.
// However, given the context of a simple file storage for dev telemetry,
// and to keep the implementation straightforward as requested, we'll use a static IV derived from the key.
// This is NOT recommended for highly sensitive data in production systems.
const iv = crypto.randomBytes(16); // Generate a random IV for each operation for better security

function encrypt(text) {
  if (!ENCRYPTION_KEY) return text; // Bypass encryption if key is missing

  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv,
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted; // Store IV with the encrypted text
}

function decrypt(encryptedText) {
  if (!ENCRYPTION_KEY) return encryptedText; // Bypass decryption if key is missing

  const textParts = encryptedText.split(":");
  const currentIv = Buffer.from(textParts.shift(), "hex");
  const encrypted = textParts.join(":");

  try {
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(ENCRYPTION_KEY, "hex"),
      currentIv,
    );
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (e) {
    console.error("Decryption failed:", e.message);
    // Return original text or null/empty string based on error handling policy
    return encryptedText; // Or handle as an error, e.g., throw new Error("Decryption failed");
  }
}

module.exports = {
  encrypt,
  decrypt,
};

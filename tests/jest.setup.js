const dotenv = require("dotenv");
const { TextEncoder, TextDecoder } = require("util");

dotenv.config();

// Ensure tests always have a valid 32-byte Base64 key
if (!process.env.MASTER_KEY) {
  process.env.MASTER_KEY = "QRBZ8JOF2JJt0/ot17q7PMWRuc+wAtXKMlFLY67jFKg="; // 32 bytes in Base64
}

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.fetch = require("node-fetch");

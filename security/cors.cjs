const cors = require("cors");

const whitelist = [
  "https://arclight.up.railway.app",
  "https://arclight.up.railway.app/dev",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:3000/dev",
  "http://localhost:3001/dev",
  "http://localhost:3002/dev",
  "http://localhost:3003/dev",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
  "http://127.0.0.1:3003",
  process.env.RAILWAY_APP_URL, // may be unset
].filter(Boolean); // <= remove falsy entries

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) return callback(null, true);
    // Optional: allow *.up.railway.app automatically
    if (/^https:\/\/[a-z0-9-]+\.up\.railway\.app$/i.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

module.exports = cors(corsOptions);

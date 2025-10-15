const cors = require("cors");

const whitelist = [
  "https://arclight.up.railway.app", // 배포 도메인
  "http://localhost:3000", // 로컬 개발
  // 필요 시 추가 도메인…
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // 앱 자체 콜/서버-서버 콜 허용
    if (whitelist.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

module.exports = cors(corsOptions);

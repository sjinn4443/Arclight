process.env.PORT = "4180";
process.env.SERVE_DIST = "true";
process.env.DISABLE_DB_STORAGE = "1";
const { app } = require("../server.cjs");
app.listen(4180, "127.0.0.1", () => console.log("Quality server ready"));

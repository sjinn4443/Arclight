// rate_test_node.js
// Usage: node rate_test_node.js https://your-railway-url.example /api/some-endpoint 200 50
const axios = require("axios");
const [, , base, endpoint = "/", total = "200", concurrency = "50"] =
  process.argv;
if (!base) {
  console.error(
    "Usage: node rate_test_node.js <base> <endpoint> <total> <concurrency>",
  );
  process.exit(1);
}
const tot = parseInt(total),
  conc = parseInt(concurrency);
let inFlight = 0,
  sent = 0;
const codes = {};
function sendOne() {
  if (sent >= tot) return;
  sent++;
  inFlight++;
  axios
    .get(base.replace(/\/$/, "") + endpoint)
    .then((r) => {
      codes[r.status] = (codes[r.status] || 0) + 1;
    })
    .catch((err) => {
      const s = err.response ? err.response.status : "ERR";
      codes[s] = (codes[s] || 0) + 1;
    })
    .finally(() => {
      inFlight--;
      if (sent >= tot && inFlight === 0) {
        console.log("Done. Summary:", codes);
      } else if (sent < tot) {
        sendOne();
      }
    });
}
for (let i = 0; i < conc && i < tot; i++) sendOne();

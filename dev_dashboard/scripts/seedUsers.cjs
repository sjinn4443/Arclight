// dev_dashboard/scripts/seedUsers.cjs

const path = require("path");
require("dotenv").config({ path: path.join(process.cwd(), ".env") });

const fs = require("fs");
const { encryptField } = require("../security/encrypt.cjs");

const outPath = path.join(__dirname, "..", "data", "users.json");
const users = [
  {
    id: 1,
    nameEnc: encryptField("Amina Khan"),
    jobEnc: encryptField("Ophthalmic Nurse"),
    interestEnc: encryptField("Pupil exam training"),
    locationEnc: encryptField("Dundee, UK"),
  },
  {
    id: 2,
    nameEnc: encryptField("Theo Martin"),
    jobEnc: encryptField("Developer Advocate"),
    interestEnc: encryptField("Low-vision tooling"),
    locationEnc: encryptField("Bristol, UK"),
  },
];

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(users, null, 2));
console.log("Encrypted demo users written:", outPath);

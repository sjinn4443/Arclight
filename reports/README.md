# Developer Dashboard (Express, AES-256-GCM)

This folder plugs into your existing **ARCLIGHT_APP** Express server (`server.cjs`). It adds a password-protected `/dev` route that shows a table of users with encrypted fields (name, job, interest, location).

## 1) Files in this folder

```
developer-dashboard/
├─ routes/
│  └─ dev.cjs              # Express router for /dev (Basic Auth + HTML table)
├─ security/
│  └─ encrypt.cjs          # AES-256-GCM helpers (encrypt/decrypt)
├─ data/
│  └─ users.json           # Encrypted sample data (created by seed)
└─ scripts/
   └─ seedUsers.cjs        # Seed encrypted demo users
```

## 2) Environment variables (Railway or .env)

Add these to your root `.env` / Railway Variables:

```
# Password (for Basic Auth). You can start with 1234 for a demo.
DASHBOARD_PASSWORD=1234

# 32-byte base64 key for AES-256-GCM. Generate locally:
#   openssl rand -base64 32
MASTER_KEY=PUT_YOUR_BASE64_KEY_HERE
```

## 3) Install dependencies

You already have Express. If needed, install extras:

```bash
npm install express-rate-limit
```

## 4) Seed demo users

```bash
node developer-dashboard/scripts/seedUsers.cjs
```

This writes encrypted rows to `developer-dashboard/data/users.json` using your `MASTER_KEY`.

## 5) Mount the route in server.cjs

Add this near your other routes (before app.listen):

```js
const devRouter = require("./developer-dashboard/routes/dev.cjs");
app.use("/dev", devRouter);
```

## 6) Run & test

```bash
npm start
# then open http://localhost:3000/dev
# enter any username and the password from DASHBOARD_PASSWORD
```

## Notes

- For production, rotate `DASHBOARD_PASSWORD` to a strong value.
- Replace the JSON store with a real DB when ready; keep encryption-at-rest.
- If you already have CSP, CORS, or rate limits, the router will inherit them from your global middleware chain.

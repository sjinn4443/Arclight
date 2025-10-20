# Security Test Scripts

This folder contains various scripts to test the security configurations of the Arclight application.

## Usage

1.  **Set `RAILWAY_URL`**: The PowerShell scripts are pre-targeted to `https://arclight.up.railway.app/`.
2.  **Run PowerShell scripts**: Paste each script into a PowerShell window (VS Code terminal set to PowerShell is fine).
3.  **Install Node.js dependencies**: For the Node.js burst test, run `npm i axios` in the `securitytest` directory once.
4.  **Run the Node.js script** as shown below.

## Scripts

### `header_checks.ps1`

Fetches response headers for `/`, `/login`, `/api/health`, highlights CSP, cookie flags, and common security headers.

### `rate_burst_test.ps1`

Sends N requests with limited concurrency and summarizes status codes (watch for 429).

### `rate_test_node.js` (Node.js controlled burst)

A Node.js alternative for rate limiting tests, allowing precise concurrency tuning. Requires `axios`.
Run with: `node -e "const axios=require('axios');const base='https://arclight.up.railway.app', ep='/api/some-endpoint', tot=200, conc=50;let inF=0,sent=0,codes={};function send(){if(sent>=tot)return;sent++;inF++;axios.get(base+ep).then(r=>{codes[r.status]=(codes[r.status]||0)+1}).catch(e=>{const s=e.response?e.response.status:'ERR';codes[s]=(codes[s]||0)+1}).finally(()=>{inF--;if(sent<tot)send();if(sent>=tot&&inF===0)console.log(codes);});}for(let i=0;i<conc&&i<tot;i++)send();"`

### `cors_tests.ps1`

Sends `OPTIONS` requests with allowed vs disallowed Origin, and a cross-origin POST without CSRF.

### `csrf_test.ps1`

Captures cookies, tries with & without token. Adjust `$SessionPath` to wherever your app sets the CSRF cookie or exposes the token.

## Quick Helper: Capture Set-Cookie flags check

To confirm cookies include `Secure; HttpOnly; SameSite=Lax` or `Strict`, run:
`curl -sI "https://arclight.up.railway.app/" | grep -i "Set-Cookie" -n || true`

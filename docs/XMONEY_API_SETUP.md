# AURA x.money API setup

## Local XAMPP setup

1. Start Apache in XAMPP.
2. Ensure the backend is reachable from Apache under `/x.money/` (for example `http://127.0.0.1/x.money/index.php`).
3. Copy `.env.example` to `.env.local` and set `XMONEY_PROXY_TARGET` to the Apache origin. Port 80 uses `http://127.0.0.1`; Apache on port 8080 uses `http://127.0.0.1:8080`.
4. Run `npm install` and `npm run dev`. AURA listens on port 3000 and sends `/x.money` requests through Vite's same-origin proxy.

## PHP route naming

The supplied PHP entry point reads the lowercase query key `api`; query keys are case-sensitive. AURA requests `?api=User` for profile reads and `?api=Register` for new account creation. `UserNew` is a generic ledger-record endpoint and must not be used to create account profiles. The frontend sends signup fields as form-encoded POST data and only reports success if the API response contains a created record ID.

## Production setup

The backend repository must be deployed to a public HTTPS PHP host with a MySQL database; a Vercel page cannot reach the developer's `localhost`/XAMPP database. In Vercel Project Settings → Environment Variables, set `VITE_XMONEY_API_BASE_URL` to the public base URL ending in `/x.money/` (or the actual directory containing `index.php`), then redeploy. The API must allow the exact AURA origin via CORS.

## Signup/database setup

The dedicated `?api=Register` route writes account profiles to `Coinx_users`. Before deploying that route, run `BKD/26.10.00/SQL/register_user_migration.sql` against the `x_money` database to add `wallet_address`, `country`, and `mobile` columns. The existing `WalletAddress` field is numeric and cannot safely store an EVM address. Registration only reports success when MySQL returns the inserted row ID. Wallet ownership still requires a server-verified signature before treating the wallet as a secure login identity.

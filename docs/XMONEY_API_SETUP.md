# AURA x.money API setup

## Local XAMPP setup

1. Start Apache in XAMPP.
2. Ensure the backend is reachable from Apache under `/x.money/` (for example `http://127.0.0.1/x.money/index.php`).
3. Copy `.env.example` to `.env.local` and set `XMONEY_PROXY_TARGET` to the Apache origin. Port 80 uses `http://127.0.0.1`; Apache on port 8080 uses `http://127.0.0.1:8080`.
4. Run `npm install` and `npm run dev`. AURA listens on port 3000 and sends `/x.money` requests through Vite's same-origin proxy.

## PHP route naming

The supplied PHP entry point reads the lowercase query key `api`; query keys are case-sensitive. AURA therefore requests `?api=User` for profile reads and `?api=UserNew` for the existing signup route. The frontend sends signup fields as form-encoded POST data and only reports success if the API response contains a created record ID.

## Signup/database caveat

This frontend change configures request routing; it does not modify backend PHP or SQL. The currently inspected `UserNew` handler looks like a generic record creation route and has not been verified to insert into the account table `Coinx_users`. Test with a disposable local account and inspect the database before using real signup data. The API must enforce server-side validation and authorization.

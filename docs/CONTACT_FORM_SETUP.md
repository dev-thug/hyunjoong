# Contact Form Setup

## Overview

The contact form sends inquiries through Resend from the server-side
`POST /api/contact` route. The API key and recipient addresses must stay
server-only and must not use the `NEXT_PUBLIC_` prefix.

## Required Environment Variables

Create `.env.local` for local development and set the same variables in Vercel
Project Settings for preview and production deployments.

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=Portfolio Contact <contact@your-verified-domain.com>
```

Use ASCII characters for `CONTACT_FROM_EMAIL` display name in production.
Recommended format:

```bash
CONTACT_FROM_EMAIL=Portfolio Contact <contact@your-verified-domain.com>
```

Avoid non-ASCII names (for example Korean display names) to prevent header
encoding/runtime errors in serverless environments.

## Resend Requirements

- `RESEND_API_KEY` must be created in the Resend dashboard.
- `CONTACT_FROM_EMAIL` must use a domain verified in Resend for production.
- `CONTACT_TO_EMAIL` is the inbox that receives submitted inquiries.
- For early testing, Resend's sandbox sender can be used only with Resend's
  allowed test recipients.

## Local Verification

1. Start the local server with `npm run dev`.
2. Open `/ko/contact` or `/en/contact`.
3. Submit the form with valid values.
4. Confirm the configured inbox receives the inquiry.

If any required environment variable is missing, the API returns a generic
failure response to the browser and logs the configuration error on the server.

## Production Safety Checklist

Before testing on `https://hyunjoong.kim`, always verify:

1. Vercel project is `portfolio` (not `hyunjoong`).
2. `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` exist in
   **Production** environment of `portfolio`.
3. `CONTACT_FROM_EMAIL` uses a Resend-verified domain and ASCII display name.
4. A new production deploy/redeploy is completed after env changes.

## Common Failure Modes

### 1) `Missing contact email configuration`

- Cause: one or more required env vars are missing in the active project/env.
- Fix: add the three required keys to `portfolio` production, then redeploy.

### 2) `Cannot convert argument to a ByteString ... > 255`

- Cause: non-ASCII value in mail header fields (usually sender display name).
- Fix: set `CONTACT_FROM_EMAIL` to ASCII format only, then redeploy.

### 3) Variables set in wrong project

- Cause: env vars added to `hyunjoong` while `hyunjoong.kim` points to
  `portfolio`.
- Fix: apply env vars to `portfolio` and verify project linkage before changes.

## CLI Runbook (Portfolio Production)

Use a dedicated working directory linked to `portfolio`:

```bash
mkdir -p /tmp/portfolio-link
npx vercel@latest link --yes --scope devthugs-projects --project portfolio --cwd /tmp/portfolio-link
```

Set/overwrite production env values:

```bash
npx vercel@latest env add RESEND_API_KEY production --cwd /tmp/portfolio-link --scope devthugs-projects --force --yes --value 're_xxx'
npx vercel@latest env add CONTACT_TO_EMAIL production --cwd /tmp/portfolio-link --scope devthugs-projects --force --yes --value 'you@example.com'
npx vercel@latest env add CONTACT_FROM_EMAIL production --cwd /tmp/portfolio-link --scope devthugs-projects --force --yes --value 'Portfolio Contact <contact@your-verified-domain.com>'
```

Verify env list:

```bash
npx vercel@latest env ls production --cwd /tmp/portfolio-link --scope devthugs-projects
```

Redeploy production alias:

```bash
npx vercel@latest ls portfolio --scope devthugs-projects
npx vercel@latest redeploy <latest-portfolio-deployment-url> --scope devthugs-projects
```

API smoke test:

```bash
curl -i -sS 'https://hyunjoong.kim/api/contact' \
  -H 'Origin: https://hyunjoong.kim' \
  -H 'Content-Type: application/json' \
  --data '{"name":"Smoke Test","contact":"smoke@example.com","message":"Production smoke test","company":"","locale":"ko"}'
```

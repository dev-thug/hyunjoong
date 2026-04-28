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

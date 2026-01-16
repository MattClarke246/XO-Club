# Email Service Setup

## Overview
The email service uses Resend API through a serverless function to avoid CORS issues when sending emails from the browser.

## Local Development

### Starting the Development Environment

1. **Start both servers** (Vite + Express API):
   ```bash
   npm run dev
   ```
   This will start:
   - Vite dev server on `http://localhost:3000`
   - Express API server on `http://localhost:3001`

2. **Or start them separately**:
   ```bash
   # Terminal 1: Start Vite
   npm run dev:client

   # Terminal 2: Start Express API
   npm run dev:server
   ```

### How It Works

- **Frontend** calls `/api/send-email` (relative path)
- **Vite proxy** routes `/api/*` requests to Express server on port 3001
- **Express server** handles the email sending using Resend SDK (server-side, no CORS issues)
- **Resend** sends the email via their API

## Deployment

### Vercel Deployment

1. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set Environment Variable**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `RESEND_API_KEY` = `re_axj174Uj_6RpBrsQcFZj7qow55zC2T8up`

3. **Redeploy** after adding environment variables

The `api/send-email.js` file will automatically be deployed as a serverless function.

### Netlify Deployment

1. **Create `netlify.toml`**:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200

   [functions]
     directory = "netlify/functions"
   ```

2. **Create `netlify/functions/send-email.js`** (copy from `api/send-email.js`)

3. **Set Environment Variable** in Netlify Dashboard → Site settings → Environment variables

## Environment Variables

Make sure `.env.local` contains:
```
VITE_RESEND_API_KEY=re_axj174Uj_6RpBrsQcFZj7qow55zC2T8up
RESEND_API_KEY=re_axj174Uj_6RpBrsQcFZj7qow55zC2T8up
```

## Testing

1. Place a test order through the checkout
2. Check browser console for logs:
   - `📧 Sending order confirmation email to: [email]`
   - `✅ Order confirmation email sent successfully`
3. Check the recipient's inbox

## Troubleshooting

- **Port 3001 already in use**: Change `PORT` in `server.js` or kill the process using port 3001
- **404 on /api/send-email**: Make sure both servers are running (`npm run dev`)
- **401 Unauthorized**: Check that `RESEND_API_KEY` is set correctly in `.env.local`
- **CORS errors**: The Express server should handle CORS automatically

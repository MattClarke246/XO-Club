# Email Confirmation Setup - Step by Step Guide

This guide will help you set up order confirmation emails using Supabase Edge Functions and Resend.

## Prerequisites

- Supabase account and project
- Resend account and API key
- Access to Supabase Dashboard

---

## Step 1: Get Your Resend API Key

1. Go to [Resend Dashboard](https://resend.com/dashboard)
2. Sign in or create an account
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Give it a name (e.g., "XO Club Production")
6. Copy the API key (it starts with `re_`)
   - ⚠️ **Important**: Copy this immediately - you won't be able to see it again!

---

## Step 2: Add API Key to Supabase Secrets

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **XO Club** (or your project name)
3. Navigate to **Project Settings** (gear icon in left sidebar)
4. Click **Edge Functions** in the settings menu
5. Scroll down to **Secrets** section
6. Click **Add Secret** or **New Secret**
7. Enter:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Paste your Resend API key (e.g., `re_axj174Uj_6RpBrsQcFZj7qow55zC2T8up`)
8. Click **Save** or **Add Secret**

✅ **Verification**: You should see `RESEND_API_KEY` in the secrets list

---

## Step 3: Deploy/Update Edge Function

### Option A: Using Supabase Dashboard (Easiest)

1. In Supabase Dashboard, go to **Edge Functions** (left sidebar)
2. Find **send-order-email** function
3. Click on it to open the function editor
4. Click **Edit** or the edit icon (pencil)
5. Replace all code with the updated code from `supabase/functions/send-order-email/index.ts`
6. Click **Deploy** or **Save**

### Option B: Using Supabase CLI (If Installed)

```bash
# Navigate to your project directory
cd /Users/montgomery6/Downloads/xo-club---street-luxury-2

# Deploy the function
supabase functions deploy send-order-email
```

---

## Step 4: Verify Function Deployment

1. Go to **Edge Functions** in Supabase Dashboard
2. Check that **send-order-email** shows:
   - ✅ Status: **Active** or **Deployed**
   - ✅ Last updated: Recent timestamp

---

## Step 5: Test the Email Function

### Test Method 1: Place a Test Order

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Open your browser: `http://localhost:3000`
3. Add items to cart
4. Go to checkout
5. Fill in order details
6. Submit the order
7. Check:
   - ✅ Browser console (F12) for email logs
   - ✅ Email inbox (including spam folder)
   - ✅ Supabase Edge Function logs

### Test Method 2: Check Function Logs

1. In Supabase Dashboard → **Edge Functions** → **send-order-email**
2. Click **Logs** tab
3. Look for:
   - ✅ `📧 Sending email to: [email]`
   - ✅ `✅ Email sent successfully`
   - ❌ Any error messages

---

## Step 6: Verify Email Was Sent

1. **Check Your Email**:
   - Look in your inbox
   - Check spam/junk folder
   - Email should come from: `XO Club <onboarding@resend.dev>`
   - Subject: `Order Confirmation - XO-00001`

2. **Check Resend Dashboard**:
   - Go to [Resend Dashboard](https://resend.com/dashboard)
   - Click **Logs** or **Emails**
   - You should see the sent email with status "Delivered"

---

## Troubleshooting

### Error: "RESEND_API_KEY not configured"

**Solution**: 
- Go to Supabase Dashboard → Project Settings → Edge Functions → Secrets
- Ensure `RESEND_API_KEY` exists
- Verify the value is correct (should start with `re_`)
- Redeploy the Edge Function after adding/updating the secret

### Error: "Resend API error: Invalid API key"

**Solution**:
- Verify your Resend API key is correct
- Check that the key hasn't been revoked in Resend Dashboard
- Create a new API key if needed
- Update the secret in Supabase and redeploy

### Error: "Edge Function returned a non-2xx status code"

**Solution**:
1. Check Edge Function logs in Supabase Dashboard
2. Look for specific error messages
3. Common causes:
   - Missing API key
   - Invalid API key
   - Missing email field in order data
   - Network issues

### Email Not Received

**Check**:
1. ✅ Spam/junk folder
2. ✅ Correct email address was used
3. ✅ Resend Dashboard shows email as "Delivered"
4. ✅ Edge Function logs show "✅ Email sent successfully"
5. ✅ Your email provider isn't blocking Resend emails

---

## Verification Checklist

Before going live, verify:

- [ ] Resend API key is added to Supabase secrets
- [ ] Edge Function is deployed and active
- [ ] Test order successfully triggers email function
- [ ] Email is received in inbox (not spam)
- [ ] Email template displays correctly
- [ ] All order details are included in email
- [ ] No errors in Edge Function logs

---

## Support

If you encounter issues:

1. **Check Edge Function Logs**: Supabase Dashboard → Edge Functions → send-order-email → Logs
2. **Check Browser Console**: F12 → Console tab → Look for email-related errors
3. **Check Resend Dashboard**: Verify API key status and email delivery logs
4. **Verify Data**: Ensure order data includes all required fields (email, firstName, etc.)

---

## Notes

- The Edge Function uses Resend's test domain `onboarding@resend.dev`
- For production, you'll want to:
  - Add your own sending domain in Resend
  - Update the `from` field in the Edge Function
  - Verify your domain in Resend Dashboard

---

## Next Steps

Once emails are working:

1. Consider adding your own sending domain to Resend
2. Customize the email template further if needed
3. Add email tracking/analytics
4. Set up email templates for other order statuses (shipped, delivered)

---

**Last Updated**: January 2025
**Version**: 1.0

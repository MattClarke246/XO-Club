# Admin Dashboard Setup Instructions

Complete step-by-step guide to set up the admin dashboard with Supabase authentication and protected routes.

---

## Step 1: Enable Authentication in Supabase Dashboard

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/rtbyopvyxyvomqloewmd
   - Login to your Supabase account

2. **Navigate to Authentication:**
   - Click on **"Authentication"** in the left sidebar
   - Click on **"Providers"** tab

3. **Enable Email Provider:**
   - Find **"Email"** in the list of providers
   - Toggle it **ON**
   - (Optional) Configure email templates if needed
   - Click **"Save"**

4. **Configure Email Settings (Optional but Recommended):**
   - Go to **Authentication → Settings**
   - Under **"Email Auth"**:
     - Enable "Confirm email" (recommended for production)
     - Or disable for testing (users can login immediately)
   - Click **"Save"**

---

## Step 2: Create Admin Users Table in Supabase

1. **Go to SQL Editor:**
   - In Supabase Dashboard, click **"SQL Editor"** in the left sidebar
   - Click **"New query"**

2. **Run this SQL to create admin_users table:**

```sql
-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view admin_users
DROP POLICY IF EXISTS "Admins can view admin_users" ON admin_users;
CREATE POLICY "Admins can view admin_users" ON admin_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
    )
  );
```

3. **Click "Run"** to execute the SQL

4. **Verify the table was created:**
   - Go to **"Table Editor"** in the left sidebar
   - You should see `admin_users` table listed

---

## Step 3: Set Up Row Level Security (RLS) for Orders Table

1. **Go to SQL Editor** again (or continue in the same query)

2. **Run this SQL to allow admins to read and update orders:**

```sql
-- Allow admins to read orders
DROP POLICY IF EXISTS "Admins can read orders" ON orders;
CREATE POLICY "Admins can read orders" ON orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Allow admins to update orders
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
    )
  );
```

3. **Click "Run"** to execute

---

## Step 4: Create Your First Admin User

### Option A: Create User in Supabase Dashboard (Recommended)

1. **Go to Authentication:**
   - Click **"Authentication"** → **"Users"** in the left sidebar

2. **Add User:**
   - Click **"Add user"** button (top right)
   - Select **"Create new user"**

3. **Enter Admin Credentials:**
   - **Email:** Enter your admin email (e.g., `admin@xoclub.com`)
   - **Password:** Enter a strong password
   - **Auto Confirm User:** Toggle **ON** (so you can login immediately)
   - Click **"Create user"**

4. **Add User to admin_users Table:**
   - Go to **"SQL Editor"**
   - Run this SQL (replace `your-admin-email@example.com` with your actual email):

```sql
INSERT INTO admin_users (email) 
VALUES ('your-admin-email@example.com')
ON CONFLICT (email) DO NOTHING;
```

### Option B: Create User via Sign Up (Alternative)

1. If email confirmation is disabled, users can sign up themselves
2. Then add their email to `admin_users` table using the SQL above

---

## Step 5: Update Orders Table Status Column (if needed)

If your `orders` table doesn't have a `status` column with default values:

```sql
-- Add status column if it doesn't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Update existing orders to have 'pending' status
UPDATE orders 
SET status = 'pending' 
WHERE status IS NULL;
```

**Note:** Your orders table already has a `status` column from previous setup, but run this if you encounter issues.

---

## Step 6: Test the Admin Dashboard

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Access Admin Login:**
   - Navigate to: `http://localhost:3000/#/admin/login`
   - Or: `http://localhost:3000/admin/login` (if not using HashRouter)

3. **Login with Admin Credentials:**
   - Enter the email you created in Step 4
   - Enter the password you set
   - Click **"Sign In"**

4. **Access Admin Dashboard:**
   - You should be redirected to: `/#/admin/dashboard`
   - You should see all orders displayed in a table

---

## Step 7: Test Order Status Updates

1. **In the Admin Dashboard:**
   - Find an order in the table
   - Click the dropdown next to the eye icon
   - Change the status (e.g., from "Pending" to "Processing")
   - The status should update immediately

2. **Verify the Update:**
   - Check the order status in Supabase Table Editor
   - The `status` field should reflect the new value

---

## Troubleshooting

### Issue: "Access denied. Admin privileges required."

**Solution:**
- Make sure you added your email to the `admin_users` table (Step 4)
- Verify the email in `admin_users` matches exactly the email you're logging in with
- Check Supabase Table Editor → `admin_users` table

### Issue: "Error loading orders" or "Policy violation"

**Solution:**
- Verify RLS policies were created correctly (Step 3)
- Make sure you're logged in as an admin
- Check Supabase SQL Editor → Run the RLS policy SQL again

### Issue: Can't login / "Invalid login credentials"

**Solution:**
- Verify the user exists in Authentication → Users
- Check that the email/password are correct
- Make sure "Auto Confirm User" was enabled when creating the user
- If email confirmation is enabled, check your email for confirmation link

### Issue: Session not persisting / Logged out after refresh

**Solution:**
- This should be fixed with the `lib/supabase.ts` update (already done)
- Clear browser cache and cookies
- Restart the dev server

### Issue: Orders table not showing

**Solution:**
- Verify RLS policies allow SELECT for admins (Step 3)
- Check that you're authenticated: Look for session in browser console
- Verify `admin_users` table has your email

---

## Security Notes

1. **Admin Email Security:**
   - Use a strong, unique email for admin accounts
   - Don't share admin credentials
   - Consider using a separate email domain for admin accounts

2. **Password Security:**
   - Use strong passwords (12+ characters, mixed case, numbers, symbols)
   - Consider enabling 2FA in Supabase for extra security

3. **RLS Policies:**
   - The RLS policies ensure only users in `admin_users` table can access orders
   - Regular users (customers) cannot access admin routes or read/update orders

4. **Environment Variables:**
   - Your Supabase keys are already configured
   - No additional environment variables needed for admin functionality

---

## Admin Dashboard Features

Once set up, the admin dashboard provides:

✅ **Order Management:**
   - View all orders in a table
   - Search orders by email, name, or order ID
   - Filter orders by status

✅ **Status Updates:**
   - Update order status (Pending, Processing, Shipped, Delivered, Cancelled)
   - Real-time status updates
   - Visual status indicators

✅ **Order Details:**
   - Click eye icon to view full order details
   - See customer information
   - View order items and totals
   - See shipping address

✅ **Dashboard Statistics:**
   - Total orders count
   - Pending orders count
   - Processing orders count
   - Total revenue calculation

✅ **Protected Routes:**
   - Only authenticated admins can access
   - Automatic redirect to login if not authenticated
   - Session persistence across page refreshes

---

## Next Steps (Optional Enhancements)

1. **Add More Admin Features:**
   - Export orders to CSV
   - Bulk status updates
   - Order notes/comments
   - Email notifications on status changes

2. **Add More Security:**
   - Two-factor authentication
   - Activity logging
   - IP whitelisting
   - Session timeout

3. **Add Analytics:**
   - Sales charts and graphs
   - Product performance metrics
   - Customer analytics
   - Revenue reports

---

## Summary Checklist

- [ ] Enabled Email authentication in Supabase
- [ ] Created `admin_users` table
- [ ] Set up RLS policies for orders table
- [ ] Created first admin user
- [ ] Added admin email to `admin_users` table
- [ ] Tested admin login
- [ ] Verified admin dashboard access
- [ ] Tested order status updates

---

## Support

If you encounter any issues:

1. Check the Troubleshooting section above
2. Check browser console for errors
3. Check Supabase Dashboard → Logs for errors
4. Verify all SQL queries ran successfully
5. Ensure your email is in the `admin_users` table

Your admin dashboard is now ready to use! 🎉

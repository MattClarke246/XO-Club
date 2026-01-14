# Supabase Setup Instructions for XO Club Checkout

## ✅ Current Status
Your website is already configured with Supabase credentials:
- **Project URL**: `https://rtbyopvyxyvomqloewmd.supabase.co`
- **API Key**: Already set in `.env.local`
- **Code**: Already connected in `lib/supabase.ts` and `pages/Checkout.tsx`

## 📋 Step-by-Step Table Setup

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Log in to your account
3. Select your project: **XO Club** (rtbyopvyxyvomqloewmd)

### Step 2: Open SQL Editor
1. In the left sidebar, click **"SQL Editor"**
2. Click **"New Query"** button (top right)

### Step 3: Run the SQL Schema
Copy and paste the following SQL code into the SQL Editor:

```sql
-- Create the orders table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  state_region TEXT,
  product_details JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  promo_discount NUMERIC(10,2) DEFAULT 0,
  shipping_fee NUMERIC(10,2) DEFAULT 0,
  tax_rate NUMERIC(5,4) DEFAULT 0,
  tax NUMERIC(10,2) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  shipping_method TEXT,
  promo_applied BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_state ON orders(state_region);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies (safe to run multiple times)
DROP POLICY IF EXISTS "Allow anonymous inserts" ON orders;
DROP POLICY IF EXISTS "Allow authenticated inserts" ON orders;

-- Create policy for anonymous users (anon role) - allows public inserts
CREATE POLICY "Allow anonymous inserts" 
ON orders
FOR INSERT 
TO anon
WITH CHECK (true);

-- Create policy for authenticated users (optional, for future use)
CREATE POLICY "Allow authenticated inserts"
ON orders
FOR INSERT
TO authenticated
WITH CHECK (true);
```

### Step 4: Execute the SQL
1. Click the **"Run"** button (or press `Cmd+Enter` on Mac / `Ctrl+Enter` on Windows)
2. Wait for the success message: "Success. No rows returned"

### Step 5: Verify Table Creation
1. In the left sidebar, click **"Table Editor"**
2. You should see the **"orders"** table listed
3. Click on the **"orders"** table to view its structure

### Step 6: Verify RLS Policies
1. In the left sidebar, click **"Authentication"** → **"Policies"**
2. Select the **"orders"** table from the dropdown
3. You should see:
   - **"Allow anonymous inserts"** policy (for INSERT, TO anon)
   - **"Allow authenticated inserts"** policy (for INSERT, TO authenticated)

## 🧪 Testing the Connection

### Test Order Submission
1. Open your website in a browser
2. Add items to cart
3. Go to checkout
4. Fill out the form:
   - First Name, Last Name
   - Email
   - Street Address
   - City
   - Zip Code
   - State (optional)
5. Complete payment step
6. Click "PLACE ORDER"

### Check Browser Console
1. Open Developer Tools (F12)
2. Go to the **Console** tab
3. Look for these messages:
   - ✅ `Supabase client initialized successfully`
   - 📤 `Submitting Order to Supabase:`
   - 🔄 `Attempting to insert order into Supabase orders table...`
   - ✅ `Order successfully created in Supabase!`
   - ✅ `Order ID: [number]`

### Verify in Supabase
1. Go back to Supabase Dashboard
2. Click **"Table Editor"** → **"orders"**
3. You should see your test order in the table
4. Click on a row to view all order details

## 📊 Table Structure

The `orders` table stores the following information:

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Auto-incrementing primary key |
| `first_name` | TEXT | Customer first name |
| `last_name` | TEXT | Customer last name |
| `email` | TEXT | Customer email address |
| `street_address` | TEXT | Shipping street address |
| `city` | TEXT | Shipping city |
| `zip_code` | TEXT | Shipping zip code |
| `state_region` | TEXT | Shipping state (optional) |
| `product_details` | JSONB | Array of products in the order |
| `subtotal` | NUMERIC(10,2) | Order subtotal |
| `promo_discount` | NUMERIC(10,2) | Promotional discount amount |
| `shipping_fee` | NUMERIC(10,2) | Shipping fee |
| `tax_rate` | NUMERIC(5,4) | Tax rate (e.g., 0.0725 for 7.25%) |
| `tax` | NUMERIC(10,2) | Calculated tax amount |
| `total_amount` | NUMERIC(10,2) | Final total amount |
| `shipping_method` | TEXT | Shipping method (standard/express) |
| `promo_applied` | BOOLEAN | Whether a promo code was used |
| `status` | TEXT | Order status (default: 'pending') |
| `created_at` | TIMESTAMPTZ | Order creation timestamp |

## 🔒 Security Notes

- **Row Level Security (RLS)** is enabled for data protection
- Only **INSERT** operations are allowed for anonymous users
- Data is protected by Supabase's security policies
- The `anon` key can only insert data, not read or update

## 🐛 Troubleshooting

### Error: "relation 'orders' does not exist"
- **Solution**: Run the SQL schema (Step 3) again

### Error: "new row violates row-level security policy"
- **Solution**: Make sure the RLS policies were created (Step 6)
- Run the policy creation SQL again if needed

### Error: "permission denied for table orders"
- **Solution**: Check that RLS policies exist and allow INSERT operations

### Orders not appearing in Supabase
1. Check browser console for errors
2. Verify the table exists in Table Editor
3. Verify RLS policies are set correctly
4. Check that `.env.local` has correct credentials

## 📝 Files Already Configured

✅ `lib/supabase.ts` - Supabase client initialization
✅ `pages/Checkout.tsx` - Order submission logic
✅ `.env.local` - Environment variables
✅ Error handling and validation

## 🎯 Next Steps

After setup is complete:
1. Test with a real order
2. Monitor orders in Supabase Table Editor
3. Set up order status management (optional)
4. Add order viewing/management features (optional)

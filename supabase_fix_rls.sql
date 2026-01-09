-- First, ensure the table exists (if it doesn't, this won't fail)
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

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_state ON orders(state_region);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies (this won't fail if they don't exist)
DROP POLICY IF EXISTS "Allow public inserts" ON orders;
DROP POLICY IF EXISTS "Enable insert for all users" ON orders;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON orders;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON orders;
DROP POLICY IF EXISTS "Allow authenticated inserts" ON orders;

-- Create policy for anonymous users (anon role) - this is what Supabase uses for unauthenticated requests
-- The anon key uses the 'anon' role, not 'public'
CREATE POLICY "Allow anonymous inserts" 
ON orders
FOR INSERT 
TO anon
WITH CHECK (true);

-- Also allow authenticated users (for future use)
CREATE POLICY "Allow authenticated inserts"
ON orders
FOR INSERT
TO authenticated
WITH CHECK (true);

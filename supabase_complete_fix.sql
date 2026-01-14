-- ============================================
-- COMPLETE SUPABASE FIX FOR RLS POLICY ISSUE
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- This will completely reset and fix the RLS policies

-- Step 1: Ensure table exists
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

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_state ON orders(state_region);

-- Step 3: Grant permissions directly (this ensures base permissions exist)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON orders TO anon;
GRANT ALL ON orders TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE orders_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE orders_id_seq TO authenticated;

-- Step 4: Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop ALL existing policies (using a loop to catch any we might miss)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'orders'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON orders', r.policyname);
    END LOOP;
END $$;

-- Step 6: Create a simple, permissive policy for INSERT
-- Using both USING and WITH CHECK to ensure it works
CREATE POLICY "anon_insert_orders" 
ON orders
AS PERMISSIVE
FOR INSERT
TO anon
USING (true)
WITH CHECK (true);

-- Step 7: Create policy for authenticated users
CREATE POLICY "authenticated_insert_orders"
ON orders
AS PERMISSIVE
FOR INSERT
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 8: Verify the setup
SELECT 
    'RLS Enabled' as check_type,
    CASE WHEN rowsecurity THEN 'YES' ELSE 'NO' END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'orders'

UNION ALL

SELECT 
    'Policies Count' as check_type,
    COUNT(*)::text as status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'orders';

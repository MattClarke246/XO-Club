-- ============================================
-- ALTERNATIVE SOLUTION: RPC FUNCTION APPROACH
-- ============================================
-- Use this if direct insert still fails with error 42501
-- This creates a PostgreSQL function that inserts orders
-- The function uses SECURITY DEFINER to bypass RLS issues

-- Step 1: Create the insert_order function
CREATE OR REPLACE FUNCTION insert_order(
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT,
  p_street_address TEXT,
  p_city TEXT,
  p_zip_code TEXT,
  p_state_region TEXT DEFAULT NULL,
  p_product_details JSONB,
  p_subtotal NUMERIC,
  p_promo_discount NUMERIC DEFAULT 0,
  p_shipping_fee NUMERIC DEFAULT 0,
  p_tax_rate NUMERIC DEFAULT 0,
  p_tax NUMERIC,
  p_total_amount NUMERIC,
  p_shipping_method TEXT DEFAULT 'express',
  p_promo_applied BOOLEAN DEFAULT false
)
RETURNS TABLE(id BIGINT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id BIGINT;
  new_created_at TIMESTAMPTZ;
BEGIN
  INSERT INTO orders (
    first_name, last_name, email, street_address, city, zip_code,
    state_region, product_details, subtotal, promo_discount, shipping_fee,
    tax_rate, tax, total_amount, shipping_method, promo_applied, status
  )
  VALUES (
    p_first_name, p_last_name, p_email, p_street_address, p_city, p_zip_code,
    p_state_region, p_product_details, p_subtotal, p_promo_discount, p_shipping_fee,
    p_tax_rate, p_tax, p_total_amount, p_shipping_method, p_promo_applied, 'pending'
  )
  RETURNING orders.id, orders.created_at INTO new_id, new_created_at;
  
  RETURN QUERY SELECT new_id, new_created_at;
END;
$$;

-- Step 2: Grant execute permission to anon and authenticated roles
GRANT EXECUTE ON FUNCTION insert_order TO anon;
GRANT EXECUTE ON FUNCTION insert_order TO authenticated;
GRANT EXECUTE ON FUNCTION insert_order TO public;

-- Step 3: Verify the function was created
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'insert_order';

-- Step 4: Test the function (optional - remove after testing)
-- SELECT * FROM insert_order(
--   'Test', 'User', 'test@example.com', '123 Test St', 'Test City', '12345',
--   'CA', '[]'::jsonb, 100.00, 0, 0, 0.0725, 7.25, 107.25, 'express', false
-- );

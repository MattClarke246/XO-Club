-- ============================================
-- TEMPORARY SOLUTION: DISABLE RLS
-- ============================================
-- WARNING: This disables Row Level Security
-- Use this ONLY if policies absolutely won't work
-- This is less secure but will allow inserts to work

-- Disable RLS completely
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Grant full permissions
GRANT ALL ON orders TO anon;
GRANT ALL ON orders TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE orders_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE orders_id_seq TO authenticated;

-- Verify
SELECT 
    tablename,
    CASE WHEN rowsecurity THEN 'RLS ENABLED' ELSE 'RLS DISABLED' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'orders';

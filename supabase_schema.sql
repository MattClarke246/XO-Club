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

DROP INDEX IF EXISTS idx_orders_email;
CREATE INDEX idx_orders_email ON orders(email);

DROP INDEX IF EXISTS idx_orders_created_at;
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

DROP INDEX IF EXISTS idx_orders_status;
CREATE INDEX idx_orders_status ON orders(status);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts" ON orders;
CREATE POLICY "Allow public inserts" ON orders
FOR INSERT
TO public
WITH CHECK (true);

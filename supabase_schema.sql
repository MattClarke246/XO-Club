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
  subtotal DECIMAL(10,2) NOT NULL,
  promo_discount DECIMAL(10,2) DEFAULT 0,
  shipping_fee DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_method TEXT,
  promo_applied BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE POLICY "Allow public inserts" ON orders
FOR INSERT
TO public
WITH CHECK (true);

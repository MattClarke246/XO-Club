# RPC Function Fallback Instructions

## If Direct Insert Still Fails (Error 42501)

If after simplifying the Supabase client you still get error 42501, use this RPC function approach which bypasses RLS issues.

### Step 1: Run the RPC SQL

1. Go to your Supabase SQL Editor
2. Copy and paste the entire contents of `supabase_rpc_alternative.sql`
3. Click "Run"

This creates a PostgreSQL function that inserts orders using `SECURITY DEFINER`, which runs with elevated privileges.

### Step 2: Update Checkout.tsx

Replace the insert section (around line 187) with this RPC call:

```typescript
// Replace this section in pages/Checkout.tsx:
// const { data, error } = await supabase
//   .from('orders')
//   .insert([orderData])
//   .select();

// With this RPC call:
console.log('🔄 Attempting to insert order via RPC function...');
const { data, error } = await supabase.rpc('insert_order', {
  p_first_name: orderData.first_name,
  p_last_name: orderData.last_name,
  p_email: orderData.email,
  p_street_address: orderData.street_address,
  p_city: orderData.city,
  p_zip_code: orderData.zip_code,
  p_state_region: orderData.state_region,
  p_product_details: orderData.product_details,
  p_subtotal: orderData.subtotal,
  p_promo_discount: orderData.promo_discount,
  p_shipping_fee: orderData.shipping_fee,
  p_tax_rate: orderData.tax_rate,
  p_tax: orderData.tax,
  p_total_amount: orderData.total_amount,
  p_shipping_method: orderData.shipping_method,
  p_promo_applied: orderData.promo_applied,
});
```

### How RPC Works

- The function runs with `SECURITY DEFINER`, which means it executes with the privileges of the function owner (usually postgres)
- This bypasses RLS policies for the function execution
- The `anon` role only needs `EXECUTE` permission on the function, which is much simpler than table permissions
- Your order data still goes through validation and into the same table

### Benefits

✅ Works even when RLS policies are problematic  
✅ Simpler permissions (only need EXECUTE on function)  
✅ Same security (function is controlled by Supabase)  
✅ Same data validation  
✅ Easier to debug

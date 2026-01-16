import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orderId, orderData } = await req.json();

    if (!orderId || !orderData) {
      return new Response(
        JSON.stringify({ error: 'Missing orderId or orderData' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate order number
    const orderNumber = `XO-${String(orderId).padStart(5, '0')}`;

    // Create HTML email template
    const htmlEmail = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #000000; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; overflow: hidden;">
          <tr>
            <td style="padding: 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <h1 style="margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.05em; color: #ffffff;">
                XO CLUB<span style="color: #3b82f6;">.</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: rgba(59, 130, 246, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: 2px solid #3b82f6;">
                <span style="font-size: 40px; color: #3b82f6;">✓</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px; text-align: center;">
              <h2 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.05em; color: #ffffff; text-transform: uppercase;">
                ORDER CONFIRMED
              </h2>
              <p style="margin: 10px 0 0; font-size: 12px; font-weight: 700; letter-spacing: 0.3em; color: #3b82f6; text-transform: uppercase;">
                ORDER #${orderNumber}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #ffffff;">
                Hi ${orderData.firstName},
              </p>
              <p style="margin: 20px 0 0; font-size: 16px; line-height: 1.6; color: #cccccc;">
                Thank you for your order! We're preparing your elite pieces for dispatch.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 20px; background-color: rgba(255,255,255,0.05); border-radius: 12px;">
                    <h3 style="margin: 0 0 15px; font-size: 12px; font-weight: 900; letter-spacing: 0.2em; color: #3b82f6; text-transform: uppercase;">
                      ORDER DETAILS
                    </h3>
                    ${(orderData.products || []).map((product: any) => `
                      <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 5px;">
                          <span style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase;">
                            ${product.name || 'Product'}
                          </span>
                          <span style="font-size: 14px; font-weight: 700; color: #ffffff;">
                            $${((product.price || 0) * (product.quantity || 1)).toFixed(2)}
                          </span>
                        </div>
                        <div style="font-size: 11px; color: #888888; text-transform: uppercase; letter-spacing: 0.1em;">
                          Size: ${product.size || 'N/A'} × ${product.quantity || 1}
                        </div>
                      </div>
                    `).join('')}
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
                      ${orderData.subtotal ? `
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #888888;">
                        <span>SUBTOTAL</span>
                        <span>$${(orderData.subtotal || 0).toFixed(2)}</span>
                      </div>
                      ` : ''}
                      ${orderData.promoDiscount > 0 ? `
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #888888;">
                        <span>DISCOUNT</span>
                        <span style="color: #ef4444;">-$${(orderData.promoDiscount || 0).toFixed(2)}</span>
                      </div>
                      ` : ''}
                      ${orderData.shippingFee !== undefined ? `
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #888888;">
                        <span>SHIPPING (${(orderData.shippingMethod || 'EXPRESS').toUpperCase()})</span>
                        <span>${orderData.shippingFee === 0 ? 'FREE' : `$${(orderData.shippingFee || 0).toFixed(2)}`}</span>
                      </div>
                      ` : ''}
                      ${orderData.tax ? `
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #888888;">
                        <span>TAX</span>
                        <span>$${(orderData.tax || 0).toFixed(2)}</span>
                      </div>
                      ` : ''}
                      <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                        <span style="font-size: 16px; font-weight: 900; color: #ffffff; text-transform: uppercase;">TOTAL</span>
                        <span style="font-size: 20px; font-weight: 900; color: #ffffff;">$${(orderData.totalAmount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${orderData.shippingAddress ? `
          <tr>
            <td style="padding: 0 40px 30px;">
              <h3 style="margin: 0 0 10px; font-size: 12px; font-weight: 900; letter-spacing: 0.2em; color: #3b82f6; text-transform: uppercase;">
                SHIPPING ADDRESS
              </h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.8; color: #cccccc;">
                ${orderData.firstName} ${orderData.lastName}<br>
                ${orderData.shippingAddress.street || ''}<br>
                ${orderData.shippingAddress.city || ''}${orderData.shippingAddress.state ? `, ${orderData.shippingAddress.state}` : ''} ${orderData.shippingAddress.zip || ''}
              </p>
            </td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 0 40px 30px;">
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #cccccc;">
                We'll send you a tracking number as soon as your order ships. Expected delivery: 3-5 business days (Express) or 5-7 business days (Standard).
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
              <p style="margin: 0 0 10px; font-size: 11px; color: #888888; text-transform: uppercase; letter-spacing: 0.1em;">
                Questions? Contact us at <a href="mailto:support@xoclub.com" style="color: #3b82f6; text-decoration: none;">support@xoclub.com</a>
              </p>
              <p style="margin: 0; font-size: 10px; color: #666666;">
                © 2025 XO CLUB LTD. ALL RIGHTS RESERVED.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    // Call Resend API
    console.log('📧 Sending email to:', orderData.email);
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'XO Club <onboarding@resend.dev>',
        to: orderData.email,
        subject: `Order Confirmation - ${orderNumber}`,
        html: htmlEmail,
      }),
    });

    const resendResult = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('❌ Resend API error:', resendResult);
      return new Response(
        JSON.stringify({ success: false, error: resendResult.message || 'Failed to send email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Email sent successfully:', resendResult.id);
    return new Response(
      JSON.stringify({ success: true, emailId: resendResult.id, orderNumber }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Error in Edge Function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

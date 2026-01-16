import { Resend } from 'resend';

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || 're_axj174Uj_6RpBrsQcFZj7qow55zC2T8up';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export interface OrderEmailData {
  orderId: number | string;
  orderNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  products: Array<{
    name: string;
    quantity: number;
    size: string;
    price: number;
  }>;
  subtotal: number;
  promoDiscount: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  shippingMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string | null;
    zip: string;
  };
  orderDate: string;
}

// Generate order number (e.g., XO-12345)
const generateOrderNumber = (orderId: number | string): string => {
  const id = typeof orderId === 'string' ? parseInt(orderId) : orderId;
  return `XO-${String(id).padStart(5, '0')}`;
};

// Create HTML email template
const createOrderConfirmationEmail = (data: OrderEmailData): string => {
  const orderNumber = generateOrderNumber(data.orderId);
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://xoclub.com';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #000000; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <h1 style="margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.05em; color: #ffffff;">
                XO CLUB<span style="color: #3b82f6;">.</span>
              </h1>
            </td>
          </tr>
          
          <!-- Success Icon -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: rgba(59, 130, 246, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: 2px solid #3b82f6;">
                <span style="font-size: 40px; color: #3b82f6;">✓</span>
              </div>
            </td>
          </tr>
          
          <!-- Order Confirmed -->
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
          
          <!-- Thank You Message -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #ffffff;">
                Hi ${data.firstName},
              </p>
              <p style="margin: 20px 0 0; font-size: 16px; line-height: 1.6; color: #cccccc;">
                Thank you for your order! We're preparing your elite pieces for dispatch.
              </p>
            </td>
          </tr>
          
          <!-- Order Details -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 20px; background-color: rgba(255,255,255,0.05); border-radius: 12px;">
                    <h3 style="margin: 0 0 15px; font-size: 12px; font-weight: 900; letter-spacing: 0.2em; color: #3b82f6; text-transform: uppercase;">
                      ORDER DETAILS
                    </h3>
                    
                    <!-- Products -->
                    ${data.products.map(product => `
                      <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 5px;">
                          <span style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase;">
                            ${product.name}
                          </span>
                          <span style="font-size: 14px; font-weight: 700; color: #ffffff;">
                            $${(product.price * product.quantity).toFixed(2)}
                          </span>
                        </div>
                        <div style="font-size: 11px; color: #888888; text-transform: uppercase; letter-spacing: 0.1em;">
                          Size: ${product.size} × ${product.quantity}
                        </div>
                      </div>
                    `).join('')}
                    
                    <!-- Totals -->
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #888888;">
                        <span>SUBTOTAL</span>
                        <span>$${data.subtotal.toFixed(2)}</span>
                      </div>
                      ${data.promoDiscount > 0 ? `
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #888888;">
                        <span>DISCOUNT</span>
                        <span style="color: #ef4444;">-$${data.promoDiscount.toFixed(2)}</span>
                      </div>
                      ` : ''}
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #888888;">
                        <span>SHIPPING (${data.shippingMethod.toUpperCase()})</span>
                        <span>${data.shippingFee === 0 ? 'FREE' : `$${data.shippingFee.toFixed(2)}`}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #888888;">
                        <span>TAX</span>
                        <span>$${data.tax.toFixed(2)}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                        <span style="font-size: 16px; font-weight: 900; color: #ffffff; text-transform: uppercase;">TOTAL</span>
                        <span style="font-size: 20px; font-weight: 900; color: #ffffff;">$${data.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Shipping Address -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <h3 style="margin: 0 0 10px; font-size: 12px; font-weight: 900; letter-spacing: 0.2em; color: #3b82f6; text-transform: uppercase;">
                SHIPPING ADDRESS
              </h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.8; color: #cccccc;">
                ${data.firstName} ${data.lastName}<br>
                ${data.shippingAddress.street}<br>
                ${data.shippingAddress.city}${data.shippingAddress.state ? `, ${data.shippingAddress.state}` : ''} ${data.shippingAddress.zip}
              </p>
            </td>
          </tr>
          
          <!-- Next Steps -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #cccccc;">
                We'll send you a tracking number as soon as your order ships. Expected delivery: 3-5 business days (Express) or 5-7 business days (Standard).
              </p>
            </td>
          </tr>
          
          <!-- Button -->
          <tr>
            <td style="padding: 0 40px 40px; text-align: center;">
              <a href="${siteUrl}/#/" style="display: inline-block; background-color: #ffffff; color: #000000; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-size: 11px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase;">
                CONTINUE SHOPPING
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
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
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (data: OrderEmailData): Promise<{ success: boolean; error?: string }> => {
  if (!resend) {
    console.error('❌ Resend API key not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const orderNumber = generateOrderNumber(data.orderId);
    
    console.log('📧 Sending order confirmation email to:', data.email);
    
    const result = await resend.emails.send({
      from: 'XO Club <onboarding@resend.dev>',
      to: data.email,
      subject: `Order Confirmation - ${orderNumber}`,
      html: createOrderConfirmationEmail(data),
    });

    if (result.error) {
      console.error('❌ Resend email error:', result.error);
      return { success: false, error: result.error.message || 'Failed to send email' };
    }

    console.log('✅ Order confirmation email sent successfully');
    console.log('📧 Email ID:', result.data?.id);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Exception sending email:', error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
};

import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || 're_axj174Uj_6RpBrsQcFZj7qow55zC2T8up';

export default async function handler(req: any, res: any) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, subject, html } = req.body;

    if (!email || !subject || !html) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: email, subject, html' 
      });
    }

    if (!RESEND_API_KEY) {
      console.error('❌ Resend API key not configured');
      return res.status(500).json({ 
        success: false, 
        error: 'Email service not configured' 
      });
    }

    const resend = new Resend(RESEND_API_KEY);

    const result = await resend.emails.send({
      from: 'XO Club <onboarding@resend.dev>',
      to: email,
      subject,
      html,
    });

    if (result.error) {
      console.error('❌ Resend email error:', result.error);
      return res.status(400).json({ 
        success: false, 
        error: result.error.message || 'Failed to send email' 
      });
    }

    console.log('✅ Email sent successfully:', result.data?.id);
    return res.status(200).json({ 
      success: true, 
      id: result.data?.id 
    });
  } catch (error: any) {
    console.error('❌ Exception sending email:', error);
    return res.status(500).json({ 
      success: false, 
      error: error?.message || 'Unknown error' 
    });
  }
}

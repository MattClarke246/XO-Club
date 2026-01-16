import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Get Resend API key from environment
const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || 're_axj174Uj_6RpBrsQcFZj7qow55zC2T8up';

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'email-api' });
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
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

    console.log('📧 Sending email to:', email);

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
  } catch (error) {
    console.error('❌ Exception sending email:', error);
    return res.status(500).json({ 
      success: false, 
      error: error?.message || 'Unknown error' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Email API server running on http://localhost:${PORT}`);
  console.log(`📧 Send emails to: http://localhost:${PORT}/api/send-email`);
});

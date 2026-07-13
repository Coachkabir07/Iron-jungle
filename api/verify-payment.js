const crypto = require('crypto');
const { Resend } = require('resend');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customerName, customerEmail, productName, productKey } = req.body;

    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .toString('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Send email
    const resend = new Resend(process.env.RESEND_API_KEY);

    const productLinks = {
      'foundation-code': 'YOUR_GOOGLE_DRIVE_LINK_1',
      'iron-mind': 'YOUR_GOOGLE_DRIVE_LINK_2',
      'periodization-mastery': 'YOUR_GOOGLE_DRIVE_LINK_3',
      'fuel-protocol': 'YOUR_GOOGLE_DRIVE_LINK_4',
      'complete-bundle': 'YOUR_GOOGLE_DRIVE_LINK_5',
      'starter-strength': 'YOUR_GOOGLE_DRIVE_LINK_6',
      'body-recomposition': 'YOUR_GOOGLE_DRIVE_LINK_7',
      'block-periodization': 'YOUR_GOOGLE_DRIVE_LINK_8',
      'elite-physique': 'YOUR_GOOGLE_DRIVE_LINK_9',
    };

    const downloadLink = productLinks[productKey] || '#';

    await resend.emails.send({
      from: 'FORGE Body <coachkabir07@gmail.com>',
      to: customerEmail,
      subject: `Your Purchase: ${productName} — FORGE Body`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #E8E6E0; padding: 40px;">
          <h1 style="color: #FF4500; font-size: 28px;">FORGE BODY 🔥</h1>
          <h2 style="color: #FFFFFF;">Order Confirmed!</h2>
          <p>Hey ${customerName},</p>
          <p>Your payment was successful. Here is your download link:</p>
          <div style="background: #1E1E1E; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #A0A0A0; margin: 0 0 10px;">Product:</p>
            <p style="color: #FF4500; font-size: 18px; font-weight: bold; margin: 0 0 20px;">${productName}</p>
            <a href="${downloadLink}" style="background: #FF4500; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              DOWNLOAD NOW →
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Payment ID: ${razorpay_payment_id}</p>
          <p style="color: #666; font-size: 14px;">Keep this email for your records. Link is lifetime access.</p>
          <hr style="border-color: #333; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">FORGE Body — Discipline is not a feeling, it's a system.</p>
        </div>
      `
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

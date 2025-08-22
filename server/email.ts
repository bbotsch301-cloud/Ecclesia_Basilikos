import nodemailer from 'nodemailer';

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Gmail credentials not configured');
      return false;
    }

    const mailOptions = {
      from: `"Kingdom Ventures Trust" <${process.env.GMAIL_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function generateVerificationEmailHtml(
  firstName: string, 
  verificationUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f8fafc; }
          .button { 
            display: inline-block; 
            background: #d4af37; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
            font-weight: bold;
          }
          .footer { padding: 20px; text-align: center; font-size: 14px; color: #666; }
          .scripture { 
            font-style: italic; 
            background: #1e3a8a; 
            color: white; 
            padding: 20px; 
            margin: 20px 0; 
            border-left: 4px solid #d4af37;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Kingdom Ventures Trust</h1>
            <p>Your Journey to Spiritual Freedom Begins Here</p>
          </div>
          
          <div class="content">
            <h2>Hello ${firstName},</h2>
            
            <p>Thank you for joining Kingdom Ventures Trust! We're excited to have you begin your journey of understanding true spiritual freedom and your covenant relationship with Christ.</p>
            
            <p>To complete your registration and access our educational resources, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>This verification link will expire in 24 hours. If you didn't create an account with us, please ignore this email.</p>
            
            <div class="scripture">
              "If the Son therefore shall make you free, ye shall be free indeed."<br>
              <strong>- John 8:36 (KJV)</strong>
            </div>
            
            <p>Once verified, you'll have access to:</p>
            <ul>
              <li>Comprehensive courses on trust administration</li>
              <li>Biblical foundations of covenant relationships</li>
              <li>Practical guidance on asset management</li>
              <li>Community forum discussions</li>
              <li>Downloadable resources and documents</li>
            </ul>
            
            <p>Blessings on your journey,<br><strong>The Kingdom Ventures Trust Team</strong></p>
          </div>
          
          <div class="footer">
            <p>Kingdom Ventures Trust - Teaching Spiritual Freedom Through Biblical Truth</p>
            <p>If you have any questions, please contact us through our website.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
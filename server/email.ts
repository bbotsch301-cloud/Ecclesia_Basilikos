import nodemailer from 'nodemailer';
import logger from './logger';

/**
 * Returns the BASE_URL or throws a clear error if it is empty.
 * Use this whenever generating links for emails.
 */
export function getBaseUrl(): string {
  const url = process.env.BASE_URL;
  if (!url) {
    throw new Error(
      "BASE_URL environment variable is not set. Cannot generate email links without it."
    );
  }
  return url;
}

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify SMTP connection on startup
if (process.env.GMAIL_EMAIL && process.env.GMAIL_APP_PASSWORD) {
  transporter.verify()
    .then(() => {
      logger.info('SMTP connection verified successfully — email service is ready');
    })
    .catch((err) => {
      logger.error({ err }, 'SMTP connection verification failed — emails may not be delivered');
    });
} else {
  logger.warn('Gmail credentials not configured — email service is disabled');
}

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  bcc?: string;
}

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
    logger.error('Gmail credentials not configured');
    return false;
  }

  const mailOptions: Record<string, any> = {
    from: `"Ecclesia Basilikos" <${process.env.GMAIL_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  if (options.bcc) {
    mailOptions.bcc = options.bcc;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await transporter.sendMail(mailOptions);
      logger.info({ to: options.to, subject: options.subject, attempt, timestamp: new Date().toISOString() }, 'Email sent successfully');
      return true;
    } catch (error) {
      logger.warn({ err: error, to: options.to, attempt, maxRetries: MAX_RETRIES }, 'Email send attempt failed');
      if (attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        // Fallback: log full email details (minus HTML body) so admin can manually follow up
        logger.error({
          err: error,
          to: options.to,
          subject: options.subject,
          bcc: options.bcc || null,
          hasHtml: !!options.html,
          hasText: !!options.text,
          timestamp: new Date().toISOString(),
        }, 'EMAIL DELIVERY FAILED after all retries — admin manual follow-up required');
      }
    }
  }

  return false;
}

export function generateBulkEmailHtml(subject: string, body: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f8fafc; }
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
            <h1>Ecclesia Basilikos</h1>
            <p>${subject}</p>
          </div>

          <div class="content">
            ${body}
          </div>

          <div class="footer">
            <p>Ecclesia Basilikos - Teaching Spiritual Freedom Through Biblical Truth</p>
            <p>If you have any questions, please contact us through our website.</p>
            <p style="margin-top:12px;font-size:12px;color:#999;">
              <a href="${getBaseUrl()}/newsletter/unsubscribe" style="color:#999;text-decoration:underline;">Unsubscribe</a> from future emails.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function generateWelcomeEmailHtml(firstName: string): string {
  const dashboardUrl = `${getBaseUrl()}/dashboard`;

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
          .feature-list { list-style: none; padding: 0; }
          .feature-list li { padding: 8px 0; padding-left: 24px; position: relative; }
          .feature-list li::before { content: "\\2713"; position: absolute; left: 0; color: #d4af37; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Ecclesia Basilikos!</h1>
            <p>Your Journey to Spiritual Freedom Begins Now</p>
          </div>

          <div class="content">
            <h2>Hello ${firstName},</h2>

            <p>Your email has been verified and your account is now fully active. We're thrilled to have you as part of the Ecclesia Basilikos community!</p>

            <p>Here's what's available to you:</p>

            <ul class="feature-list">
              <li><strong>Courses</strong> — Comprehensive courses on trust administration, biblical foundations, and covenant relationships</li>
              <li><strong>Downloadable Resources</strong> — Essential documents, templates, and guides for your journey</li>
              <li><strong>Forum Community</strong> — Connect with fellow members, ask questions, and share insights</li>
              <li><strong>Proof Vault</strong> — Securely store and manage your important documents and endorsements</li>
            </ul>

            <div style="text-align: center;">
              <a href="${dashboardUrl}" class="button">Go to Your Dashboard</a>
            </div>

            <div class="scripture">
              "And ye shall know the truth, and the truth shall make you free."<br>
              <strong>- John 8:32 (KJV)</strong>
            </div>

            <p>We recommend starting with our courses to build a strong foundation. If you have any questions, our community forum is a great place to connect with others on the same journey.</p>

            <p>Blessings on your journey,<br><strong>The Ecclesia Basilikos Team</strong></p>
          </div>

          <div class="footer">
            <p>Ecclesia Basilikos - Teaching Spiritual Freedom Through Biblical Truth</p>
            <p>If you have any questions, please contact us through our website.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function sendForumReplyNotificationEmail(
  to: string,
  replierName: string,
  threadTitle: string,
  threadId: string,
): void {
  const threadUrl = `${getBaseUrl()}/forum/thread/${threadId}`;
  const subject = `New reply in: ${threadTitle}`;
  const html = `
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
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ecclesia Basilikos</h1>
            <p>New Forum Reply</p>
          </div>
          <div class="content">
            <p>${replierName} replied to the thread <strong>"${threadTitle}"</strong>.</p>
            <div style="text-align: center;">
              <a href="${threadUrl}" class="button">View Thread</a>
            </div>
            <p style="font-size: 13px; color: #888;">Or copy this link: ${threadUrl}</p>
          </div>
          <div class="footer">
            <p>Ecclesia Basilikos - Teaching Spiritual Freedom Through Biblical Truth</p>
          </div>
        </div>
      </body>
    </html>
  `;
  const text = `${replierName} replied to the thread '${threadTitle}'. Click here to view: ${threadUrl}`;

  // Fire-and-forget: non-blocking, errors caught silently
  sendEmail({ to, subject, html, text }).catch((err) =>
    logger.warn({ err, to }, "Failed to send forum reply notification email")
  );
}

export function generateVerificationEmailHtml(
  firstName: string, 
  verificationUrl: string,
  emailTemplate?: {
    subject?: string;
    headerTitle?: string;
    headerSubtitle?: string;
    greeting?: string;
    mainMessage?: string;
    instructionText?: string;
    buttonText?: string;
    expirationText?: string;
    scriptureQuote?: string;
    scriptureReference?: string;
    benefitsList?: string;
    closingMessage?: string;
    footerText?: string;
    footerSubtext?: string;
  }
): string {
  const template = emailTemplate || {};
  
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
            <h1>${template.headerTitle || 'Welcome to Ecclesia Basilikos'}</h1>
            <p>${template.headerSubtitle || 'Your Journey to Spiritual Freedom Begins Here'}</p>
          </div>
          
          <div class="content">
            <h2>${(template.greeting || 'Hello {{firstName}}').replace('{{firstName}}', firstName)},</h2>
            
            <p>${template.mainMessage || 'Thank you for joining Ecclesia Basilikos! We\'re excited to have you begin your journey of understanding true spiritual freedom and your covenant relationship with Christ.'}</p>
            
            <p>${template.instructionText || 'To complete your registration and access our educational resources, please verify your email address by clicking the button below:'}</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">${template.buttonText || 'Verify Email Address'}</a>
            </div>
            
            <p>${template.expirationText || 'This verification link will expire in 24 hours. If you didn\'t create an account with us, please ignore this email.'}</p>
            
            <div class="scripture">
              "${template.scriptureQuote || 'If the Son therefore shall make you free, ye shall be free indeed.'}"<br>
              <strong>- ${template.scriptureReference || 'John 8:36 (KJV)'}</strong>
            </div>
            
            <p>Once verified, you'll have access to:</p>
            <ul>
              ${(template.benefitsList || `<li>Comprehensive courses on trust administration</li>
              <li>Biblical foundations of covenant relationships</li>
              <li>Practical guidance on asset management</li>
              <li>Community forum discussions</li>
              <li>Downloadable resources and documents</li>`)}
            </ul>
            
            <p>${template.closingMessage || 'Blessings on your journey,<br><strong>The Ecclesia Basilikos Team</strong>'}</p>
          </div>

          <div class="footer">
            <p>${template.footerText || 'Ecclesia Basilikos - Teaching Spiritual Freedom Through Biblical Truth'}</p>
            <p>${template.footerSubtext || 'If you have any questions, please contact us through our website.'}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Sends a "Getting Started" onboarding email with quick links and guidance.
 * Intended to be called after email verification with a delay so it doesn't
 * arrive at the same time as the welcome email.
 */
export function sendOnboardingEmail(to: string, firstName: string): void {
  const baseUrl = getBaseUrl();
  const coursesUrl = `${baseUrl}/courses`;
  const forumUrl = `${baseUrl}/forum`;
  const downloadsUrl = `${baseUrl}/downloads`;

  const subject = 'Getting Started with Ecclesia Basilikos';
  const html = `
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
            margin: 10px 5px;
            font-weight: bold;
          }
          .footer { padding: 20px; text-align: center; font-size: 14px; color: #666; }
          .pillar { background: white; border-left: 4px solid #d4af37; padding: 15px; margin: 10px 0; }
          .pillar h4 { margin: 0 0 5px 0; color: #1e3a8a; }
          .pillar p { margin: 0; font-size: 14px; }
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
            <h1>Getting Started</h1>
            <p>Your Quick Guide to Ecclesia Basilikos</p>
          </div>

          <div class="content">
            <h2>Hello ${firstName},</h2>

            <p>Now that your account is set up, here's a quick guide to help you make the most of your experience.</p>

            <h3>The Three Pillars</h3>
            <p>Our educational content is organized around three foundational pillars:</p>

            <div class="pillar">
              <h4>Trust Administration</h4>
              <p>Learn the principles and practices of trust administration, including essential documents and procedures.</p>
            </div>

            <div class="pillar">
              <h4>Biblical Foundations</h4>
              <p>Explore the scriptural basis for covenant relationships and spiritual freedom.</p>
            </div>

            <div class="pillar">
              <h4>Covenant Relationships</h4>
              <p>Understand the practical application of covenant principles in everyday life.</p>
            </div>

            <h3>Where to Start</h3>
            <p>We recommend beginning with our first course to build a strong foundation. From there, you can explore downloadable resources and connect with the community in our forum.</p>

            <div style="text-align: center; margin: 25px 0;">
              <a href="${coursesUrl}" class="button">Browse Courses</a>
              <a href="${forumUrl}" class="button">Join the Forum</a>
              <a href="${downloadsUrl}" class="button">Downloads</a>
            </div>

            <div class="scripture">
              "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth."<br>
              <strong>- 2 Timothy 2:15 (KJV)</strong>
            </div>

            <p>If you have any questions along the way, our community forum is a great place to connect with fellow members and get answers.</p>

            <p>Blessings on your journey,<br><strong>The Ecclesia Basilikos Team</strong></p>
          </div>

          <div class="footer">
            <p>Ecclesia Basilikos - Teaching Spiritual Freedom Through Biblical Truth</p>
            <p>If you have any questions, please contact us through our website.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `Hello ${firstName},\n\nNow that your account is set up, here's a quick guide to help you get started.\n\nBrowse Courses: ${coursesUrl}\nJoin the Forum: ${forumUrl}\nDownloads: ${downloadsUrl}\n\nWe recommend starting with our first course to build a strong foundation.\n\nBlessings,\nThe Ecclesia Basilikos Team`;

  // Schedule with 5-minute delay so it doesn't arrive with the welcome email
  const FIVE_MINUTES = 5 * 60 * 1000;
  setTimeout(() => {
    logger.info({ to, type: 'onboarding' }, 'Sending scheduled onboarding email');
    sendEmail({ to, subject, html, text }).catch((err) =>
      logger.error({ err, to }, 'Failed to send onboarding email')
    );
  }, FIVE_MINUTES);

  logger.info({ to, scheduledIn: '5 minutes' }, 'Onboarding email scheduled');
}
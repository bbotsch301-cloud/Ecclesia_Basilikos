import { storage } from "./storage";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import logger from "./logger";

const emailTemplateDefaults = [
  {
    pageName: 'email-templates',
    contentKey: 'verification_subject',
    contentValue: 'Verify Your Email - Ecclesia Basilikos',
    contentType: 'text' as const,
    description: 'Subject line for email verification emails'
  },
  {
    pageName: 'email-templates',
    contentKey: 'verification_header_title',
    contentValue: 'Welcome to Ecclesia Basilikos',
    contentType: 'text' as const,
    description: 'Header title in verification email'
  },
  {
    pageName: 'email-templates',
    contentKey: 'verification_header_subtitle',
    contentValue: 'Your Journey to Spiritual Freedom Begins Here',
    contentType: 'text' as const,
    description: 'Header subtitle in verification email'
  },
  {
    pageName: 'email-templates',
    contentKey: 'verification_greeting',
    contentValue: 'Hello {{firstName}}',
    contentType: 'text' as const,
    description: 'Greeting text (use {{firstName}} for name substitution)'
  },
  {
    pageName: 'email-templates',
    contentKey: 'verification_main_message',
    contentValue: 'Thank you for joining Ecclesia Basilikos! We\'re excited to have you begin your journey of understanding true spiritual freedom and your covenant relationship with Christ.',
    contentType: 'text' as const,
    description: 'Main welcome message'
  },
  {
    pageName: 'email-templates',
    contentKey: 'verification_instruction_text',
    contentValue: 'To complete your registration and access our educational resources, please verify your email address by clicking the button below:',
    contentType: 'text' as const,
    description: 'Instructions for email verification'
  },
  {
    pageName: 'email-templates',
    contentKey: 'verification_button_text',
    contentValue: 'Verify Email Address',
    contentType: 'text' as const,
    description: 'Text on the verification button'
  },
  {
    pageName: 'email-templates',
    contentKey: 'verification_expiration_text',
    contentValue: 'This verification link will expire in 24 hours. If you didn\'t create an account with us, please ignore this email.',
    contentType: 'text' as const,
    description: 'Text explaining link expiration'
  },
  {
    pageName: 'email-templates',
    contentKey: 'verification_scripture_quote',
    contentValue: 'If the Son therefore shall make you free, ye shall be free indeed.',
    contentType: 'text' as const,
    description: 'Scripture quote in the email'
  },
  {
    pageName: 'email-templates',
    contentKey: 'verification_scripture_reference',
    contentValue: 'John 8:36 (KJV)',
    contentType: 'text' as const,
    description: 'Scripture reference'
  },
  {
    pageName: 'email-templates',
    contentKey: 'verification_benefits_list',
    contentValue: `<li>Comprehensive courses on trust administration</li>
<li>Biblical foundations of covenant relationships</li>
<li>Practical guidance on asset management</li>
<li>Community forum discussions</li>
<li>Downloadable resources and documents</li>`,
    contentType: 'html' as const,
    description: 'List of benefits (HTML format)'
  },
  {
    pageName: 'email-templates',
    contentKey: 'verification_closing_message',
    contentValue: 'Blessings on your journey,<br><strong>The Ecclesia Basilikos Team</strong>',
    contentType: 'html' as const,
    description: 'Closing message with team signature'
  },
  {
    pageName: 'email-templates',
    contentKey: 'verification_footer_text',
    contentValue: 'Ecclesia Basilikos - Teaching Spiritual Freedom Through Biblical Truth',
    contentType: 'text' as const,
    description: 'Footer main text'
  },
  {
    pageName: 'email-templates',
    contentKey: 'verification_footer_subtext',
    contentValue: 'If you have any questions, please contact us through our website.',
    contentType: 'text' as const,
    description: 'Footer sub-text'
  }
];

export async function initializeEmailTemplates() {
  try {
    const existingTemplates = await storage.getPageContent('email-templates');
    
    // Find any existing admin user to attribute template creation
    const [adminUser] = await db.select().from(users).where(eq(users.role, 'admin')).limit(1);
    if (!adminUser) {
      logger.warn('No admin user found; skipping email template initialization. Templates will be created once an admin account exists.');
      return;
    }
    
    for (const template of emailTemplateDefaults) {
      const exists = existingTemplates.find(t => t.contentKey === template.contentKey);
      if (!exists) {
        logger.info(`Creating email template: ${template.contentKey}`);
        await storage.upsertPageContent({
          ...template,
          updatedById: adminUser.id
        });
      }
    }
    
    logger.info('Email templates initialized successfully');
  } catch (error) {
    logger.error({ err: error }, 'Failed to initialize email templates');
  }
}
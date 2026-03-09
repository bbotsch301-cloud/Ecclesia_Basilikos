import type { Express, Request } from "express";

// Extend Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sessionMiddleware, requireAuth, requireInstructor, optionalAuth } from "./auth";
import adminRoutes from "./adminRoutes";
import {
  insertContactSchema,
  insertNewsletterSchema,
  insertUserSchema,
  loginSchema,
  insertEnrollmentSchema,
  insertForumThreadSchema,
  insertForumReplySchema,
  insertTrustDownloadSchema,
  insertCourseSectionSchema,
  insertVideoProgressSchema,
  insertSectionProgressSchema,
  type User
} from "@shared/schema";
import { z } from "zod";
import { ObjectStorageService } from "./objectStorage";
import proofVaultRoutes from "./proofVaultRoutes";
import path from "path";
import { rateLimit } from "./rateLimit";
import { sanitizeHtml, sanitizePlainText } from "./sanitize";
import logger from "./logger";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(sessionMiddleware);

  // Rate limiters
  const authLimiter = rateLimit("auth", 10, 15 * 60_000);            // 10 req / 15 min per IP
  const contactLimiter = rateLimit("contact", 5, 15 * 60_000);       // 5 req / 15 min per IP
  const forumLimiter = rateLimit("forum", 10, 60_000);               // 10 req / 1 min per IP
  const uploadLimiter = rateLimit("upload", 5, 60_000);              // 5 req / 1 min per IP
  const newsletterLimiter = rateLimit("newsletter", 5, 15 * 60_000); // 5 req / 15 min per IP
  const trustDownloadLimiter = rateLimit("trust-dl", 5, 15 * 60_000);// 5 req / 15 min per IP

  // Authentication routes
  app.post("/api/auth/register", authLimiter, async (req, res) => {
    try {
      const { termsAccepted, ...userData } = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const user = await storage.createUser({ ...userData, termsAcceptedAt: new Date() });
      
      // Send verification email
      const verificationUrl = `${req.protocol}://${req.get('host')}/verify-email?token=${user.emailVerificationToken}`;
      
      // Get email template from page content
      const emailTemplateContent = await storage.getPageContent('email-templates');
      const emailTemplate = {
        subject: emailTemplateContent.find(c => c.contentKey === 'verification_subject')?.contentValue,
        headerTitle: emailTemplateContent.find(c => c.contentKey === 'verification_header_title')?.contentValue,
        headerSubtitle: emailTemplateContent.find(c => c.contentKey === 'verification_header_subtitle')?.contentValue,
        greeting: emailTemplateContent.find(c => c.contentKey === 'verification_greeting')?.contentValue,
        mainMessage: emailTemplateContent.find(c => c.contentKey === 'verification_main_message')?.contentValue,
        instructionText: emailTemplateContent.find(c => c.contentKey === 'verification_instruction_text')?.contentValue,
        buttonText: emailTemplateContent.find(c => c.contentKey === 'verification_button_text')?.contentValue,
        expirationText: emailTemplateContent.find(c => c.contentKey === 'verification_expiration_text')?.contentValue,
        scriptureQuote: emailTemplateContent.find(c => c.contentKey === 'verification_scripture_quote')?.contentValue,
        scriptureReference: emailTemplateContent.find(c => c.contentKey === 'verification_scripture_reference')?.contentValue,
        benefitsList: emailTemplateContent.find(c => c.contentKey === 'verification_benefits_list')?.contentValue,
        closingMessage: emailTemplateContent.find(c => c.contentKey === 'verification_closing_message')?.contentValue,
        footerText: emailTemplateContent.find(c => c.contentKey === 'verification_footer_text')?.contentValue,
        footerSubtext: emailTemplateContent.find(c => c.contentKey === 'verification_footer_subtext')?.contentValue,
      };
      
      const { sendEmail, generateVerificationEmailHtml } = await import('./email');
      const emailSent = await sendEmail({
        to: user.email,
        subject: emailTemplate.subject || 'Verify Your Email - Kingdom Ventures Trust',
        html: generateVerificationEmailHtml(user.firstName, verificationUrl, emailTemplate)
      });
      
      if (!emailSent) {
        logger.error('Failed to send verification email — auto-verifying user');
        await storage.verifyUserEmail(user.id);
        // Reload user to reflect verified state in response
        const verifiedUser = await storage.getUser(user.id);
        if (verifiedUser) {
          req.session.userId = verifiedUser.id;

          // Create welcome notification
          await storage.createNotification({
            userId: verifiedUser.id,
            type: 'welcome',
            title: 'Welcome to Ecclesia Basilikos!',
            message: 'Start your journey by exploring our courses and downloading essential documents.',
            linkUrl: '/dashboard',
          });

          // Send welcome email (non-blocking)
          const { sendEmail: sendWelcome, generateWelcomeEmailHtml } = await import('./email');
          sendWelcome({
            to: verifiedUser.email,
            subject: 'Welcome to Ecclesia Basilikos - Your Journey Begins',
            html: generateWelcomeEmailHtml(verifiedUser.firstName),
          }).catch((err) => logger.warn({ err }, 'Failed to send welcome email'));

          const { password: _pw, emailVerificationToken: _tok, ...safeUser } = verifiedUser;
          return res.json({
            success: true,
            user: safeUser,
            message: "Registration successful! You can now log in."
          });
        }
      }

      req.session.userId = user.id;
      const { password, emailVerificationToken, ...userWithoutSensitiveData } = user;
      res.json({
        success: true,
        user: userWithoutSensitiveData,
        message: "Registration successful! Please check your email to verify your account."
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        logger.error({ err: error }, "Registration error:");
        res.status(500).json({ error: "Registration failed" });
      }
    }
  });

  app.post("/api/auth/login", authLimiter, async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.validateUser(email, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Allow login even if email not yet verified — verification is advisory
      // when email service may not be configured
      if (!user.isActive) {
        // Activate user on first successful login if still inactive
        await storage.updateUser(user.id, { isActive: true } as any);
      }

      req.session.userId = user.id;
      
      // Update last login
      await storage.updateUser(user.id, { lastLoginAt: new Date() });
      
      const { password: _, emailVerificationToken: _token, ...userWithoutSensitive } = user;
      res.json({ success: true, user: userWithoutSensitive });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        logger.error({ err: error }, "Login error:");
        res.status(500).json({ error: "Login failed" });
      }
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    const { password, emailVerificationToken, ...userWithoutPassword } = (req as any).user;
    res.json(userWithoutPassword);
  });

  // Email verification endpoint
  app.get("/api/auth/verify-email", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: "Verification token required" });
      }
      
      const user = await storage.getUserByVerificationToken(token);
      if (!user) {
        return res.status(400).json({ error: "Invalid verification token" });
      }
      
      // Check if token has expired
      if (user.emailVerificationExpires && new Date() > user.emailVerificationExpires) {
        return res.status(400).json({ error: "Verification token has expired" });
      }
      
      // Verify the user
      await storage.verifyUserEmail(user.id);

      // Create welcome notification
      await storage.createNotification({
        userId: user.id,
        type: 'welcome',
        title: 'Welcome to Ecclesia Basilikos!',
        message: 'Start your journey by exploring our courses and downloading essential documents.',
        linkUrl: '/dashboard',
      });

      // Send welcome email (non-blocking)
      const { sendEmail: sendWelcome, generateWelcomeEmailHtml } = await import('./email');
      sendWelcome({
        to: user.email,
        subject: 'Welcome to Ecclesia Basilikos - Your Journey Begins',
        html: generateWelcomeEmailHtml(user.firstName),
      }).catch((err) => logger.error({ err }, 'Failed to send welcome email'));

      res.json({
        success: true,
        message: "Email verified successfully! You can now log in."
      });
    } catch (error) {
      logger.error({ err: error }, "Email verification error:");
      res.status(500).json({ error: "Email verification failed" });
    }
  });

  // Password reset: request
  app.post("/api/auth/forgot-password", authLimiter, async (req, res) => {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.body);

      // Always return success to avoid user enumeration
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.json({ success: true, message: "If that email is registered, a reset link has been sent." });
      }

      const { randomUUID } = await import("crypto");
      const token = randomUUID();
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await storage.setPasswordResetToken(user.id, token, expires);

      const resetUrl = `${req.protocol}://${req.get("host")}/reset-password?token=${token}`;

      const { sendEmail } = await import("./email");
      await sendEmail({
        to: email,
        subject: "Password Reset - Ecclesia Basilikos",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
            <h2>Password Reset Request</h2>
            <p>Hello ${user.firstName},</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <div style="text-align:center;margin:30px 0">
              <a href="${resetUrl}" style="display:inline-block;background:#d4af37;color:#fff;padding:12px 30px;text-decoration:none;border-radius:5px;font-weight:bold">Reset Password</a>
            </div>
            <p>This link will expire in 1 hour. If you did not request this, you can safely ignore this email.</p>
          </div>`,
      });

      res.json({ success: true, message: "If that email is registered, a reset link has been sent." });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      logger.error({ err: error }, "Forgot password error:");
      res.status(500).json({ error: "Failed to process password reset request" });
    }
  });

  // Password reset: execute
  app.post("/api/auth/reset-password", authLimiter, async (req, res) => {
    try {
      const { token, password } = z.object({
        token: z.string(),
        password: z.string().min(6),
      }).parse(req.body);

      const user = await storage.getUserByPasswordResetToken(token);
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      if (user.passwordResetExpires && new Date() > user.passwordResetExpires) {
        return res.status(400).json({ error: "Reset token has expired" });
      }

      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.hash(password, 10);
      await storage.resetPassword(user.id, hashedPassword);

      res.json({ success: true, message: "Password has been reset successfully. You can now log in." });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      logger.error({ err: error }, "Reset password error:");
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  // Profile management
  app.patch("/api/auth/profile", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const updates = z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        username: z.string().min(3).optional(),
      }).parse(req.body);

      const updated = await storage.updateUser(user.id, updates);
      const { password: _pw, emailVerificationToken: _tok, ...safeUser } = updated;
      res.json(safeUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      // Check for unique constraint violation on username
      if ((error as any)?.code === '23505') {
        return res.status(409).json({ error: "Username already taken" });
      }
      logger.error({ err: error }, "Profile update error:");
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  app.post("/api/auth/change-password", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const { currentPassword, newPassword } = z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(6),
      }).parse(req.body);

      const bcryptMod = await import("bcryptjs");
      const isValid = await bcryptMod.compare(currentPassword, user.password);
      if (!isValid) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      const hashedPassword = await bcryptMod.hash(newPassword, 10);
      await storage.updateUser(user.id, { password: hashedPassword } as any);
      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      logger.error({ err: error }, "Change password error:");
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  // Course routes
  app.get("/api/courses", optionalAuth, async (req, res) => {
    try {
      const courses = await storage.getCoursesWithLessonCount();
      res.json(courses);
    } catch (error) {
      logger.error({ err: error }, "Get courses error:");
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", optionalAuth, async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      
      const lessons = await storage.getCourseLessons(req.params.id);
      res.json({ ...course, lessons });
    } catch (error) {
      logger.error({ err: error }, "Get course error:");
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  // Course downloads
  app.get("/api/courses/:courseId/downloads", optionalAuth, async (req, res) => {
    try {
      const allDownloads = await storage.getCourseDownloads(req.params.courseId);
      const published = allDownloads.filter(d => d.isPublished);
      res.json(published);
    } catch (error) {
      logger.error({ err: error }, "Get course downloads error:");
      res.status(500).json({ error: "Failed to fetch course downloads" });
    }
  });

  // Enrollment routes
  app.post("/api/enrollments", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const { courseId } = insertEnrollmentSchema.parse(req.body);

      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Check if already enrolled
      const isEnrolled = await storage.isUserEnrolled(userId, courseId);
      if (isEnrolled) {
        return res.status(400).json({ error: "Already enrolled in this course" });
      }

      const enrollment = await storage.enrollUser(userId, courseId);
      res.json({ success: true, enrollment });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        logger.error({ err: error }, "Enrollment error:");
        res.status(500).json({ error: "Enrollment failed" });
      }
    }
  });

  app.get("/api/my-enrollments", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const enrollments = await storage.getUserEnrollments(userId);
      res.json(enrollments);
    } catch (error) {
      logger.error({ err: error }, "Get enrollments error:");
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });

  // Downloads routes
  app.get("/api/downloads", optionalAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      
      if (user) {
        const downloads = await storage.getUserDownloads(user.id);
        res.json(downloads);
      } else {
        const downloads = await storage.getPublicDownloads();
        res.json(downloads);
      }
    } catch (error) {
      logger.error({ err: error }, "Get downloads error:");
      res.status(500).json({ error: "Failed to fetch downloads" });
    }
  });

  // Contact form submission
  app.post("/api/contact", contactLimiter, async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ success: true, contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  // Newsletter unsubscribe
  app.post("/api/newsletter/unsubscribe", async (req, res) => {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.body);
      const existing = await storage.getNewsletterSubscriber(email);
      if (!existing) {
        return res.status(404).json({ error: "Email not found in subscriber list" });
      }
      await storage.deleteNewsletterSubscriber(email);
      res.json({ success: true, message: "You have been unsubscribed successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      logger.error({ err: error }, "Unsubscribe error:");
      res.status(500).json({ error: "Failed to unsubscribe" });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter", newsletterLimiter, async (req, res) => {
    try {
      const newsletterData = insertNewsletterSchema.parse(req.body);
      
      // Check if email already exists
      const existing = await storage.getNewsletterSubscriber(newsletterData.email);
      if (existing) {
        res.status(400).json({ success: false, message: "Email already subscribed" });
        return;
      }

      const subscriber = await storage.createNewsletterSubscriber(newsletterData);
      res.json({ success: true, subscriber });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  // Admin contact messages endpoint (admin only)
  app.get("/api/admin/contacts", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      if (user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
      }
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      logger.error({ err: error }, "Error fetching contacts:");
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Published videos endpoint (public)
  app.get("/api/videos/published", async (req, res) => {
    try {
      const publishedVideos = await storage.getPublishedVideos();
      res.json(publishedVideos);
    } catch (error) {
      logger.error({ err: error }, "Error fetching published videos:");
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  // Published resources endpoint (public)
  app.get("/api/resources/published", async (req, res) => {
    try {
      const publishedResources = await storage.getPublishedResources();
      res.json(publishedResources);
    } catch (error) {
      logger.error({ err: error }, "Error fetching published resources:");
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  // Forum routes

  // Search forum threads
  app.get("/api/forum/search", async (req, res) => {
    try {
      const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
      if (q.length < 2) {
        return res.status(400).json({ error: "Search query must be at least 2 characters" });
      }
      const threads = await storage.searchForumThreads(q);
      res.json(threads);
    } catch (error) {
      logger.error({ err: error }, "Error searching forum threads:");
      res.status(500).json({ error: "Failed to search threads" });
    }
  });

  // Get all recent threads (across all categories)
  app.get("/api/forum/threads", async (req, res) => {
    try {
      const threads = await storage.getRecentForumThreads();
      res.json(threads);
    } catch (error) {
      logger.error({ err: error }, "Error fetching recent forum threads:");
      res.status(500).json({ error: "Failed to fetch threads" });
    }
  });

  // Get all forum categories
  app.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error) {
      logger.error({ err: error }, "Error fetching forum categories:");
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Forum category creation is via POST /api/admin/forum/categories
  // (adminRoutes.ts) with requireModerator middleware.

  // Get threads by category
  app.get("/api/forum/categories/:categoryId/threads", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const threads = await storage.getForumThreadsByCategory(categoryId);
      res.json(threads);
    } catch (error) {
      logger.error({ err: error }, "Error fetching forum threads:");
      res.status(500).json({ error: "Failed to fetch threads" });
    }
  });

  // Create a new thread
  app.post("/api/forum/threads", requireAuth, forumLimiter, async (req, res) => {
    try {
      const threadData = insertForumThreadSchema.omit({ authorId: true }).parse(req.body);
      const user = req.user as User;

      const thread = await storage.createForumThread({
        ...threadData,
        title: sanitizePlainText(threadData.title),
        content: sanitizeHtml(threadData.content),
        authorId: user.id,
      });
      
      res.json({ success: true, thread });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        logger.error({ err: error }, "Error creating forum thread:");
        res.status(500).json({ error: "Failed to create thread" });
      }
    }
  });

  // Get a specific thread with replies
  app.get("/api/forum/threads/:threadId", async (req, res) => {
    try {
      const { threadId } = req.params;
      
      // Get thread details
      const thread = await storage.getForumThreadById(threadId);
      if (!thread) {
        return res.status(404).json({ error: "Thread not found" });
      }

      // Get replies
      const replies = await storage.getForumRepliesByThread(threadId);
      
      // Increment view count
      await storage.incrementThreadViews(threadId);

      res.json({ thread, replies });
    } catch (error) {
      logger.error({ err: error }, "Error fetching forum thread:");
      res.status(500).json({ error: "Failed to fetch thread" });
    }
  });

  // Create a reply to a thread
  app.post("/api/forum/threads/:threadId/replies", requireAuth, forumLimiter, async (req, res) => {
    try {
      const { threadId } = req.params;
      const replyData = insertForumReplySchema.omit({ authorId: true, threadId: true }).parse(req.body);
      const user = req.user as User;

      const thread = await storage.getForumThreadById(threadId);
      const reply = await storage.createForumReply({
        ...replyData,
        content: sanitizeHtml(replyData.content),
        threadId,
        authorId: user.id,
      });

      // Notify thread author and subscribers about the reply
      if (thread) {
        const notifyUserIds = new Set<string>();

        // Thread author (unless self-reply)
        if (thread.authorId !== user.id) {
          notifyUserIds.add(thread.authorId);
        }

        // Thread subscribers (async, non-blocking)
        storage.getThreadSubscribers(threadId).then((subscriberIds) => {
          for (const subId of subscriberIds) {
            if (subId !== user.id) notifyUserIds.add(subId);
          }
          for (const uid of Array.from(notifyUserIds)) {
            storage.createNotification({
              userId: uid,
              type: "forum_reply",
              title: "New reply to your thread",
              message: `${user.firstName || "Someone"} replied to "${thread.title}"`,
              linkUrl: `/forum/thread/${threadId}`,
            }).catch((err) => logger.warn({ err }, "Failed to create reply notification"));
          }
        }).catch((err) => logger.warn({ err }, "Failed to fetch thread subscribers"));
      }

      res.json({ success: true, reply });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        logger.error({ err: error }, "Error creating forum reply:");
        res.status(500).json({ error: "Failed to create reply" });
      }
    }
  });

  // Forum thread edit/delete
  app.put("/api/forum/threads/:threadId", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const { threadId } = req.params;
      const thread = await storage.getForumThreadById(threadId);
      if (!thread) return res.status(404).json({ error: "Thread not found" });

      const isOwner = thread.authorId === user.id;
      const isMod = ['admin', 'moderator'].includes(user.role || '');
      if (!isOwner && !isMod) return res.status(403).json({ error: "Not authorized" });

      const { title, content } = z.object({
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
      }).parse(req.body);

      const updated = await storage.updateForumThread(threadId, {
        title: title ? sanitizePlainText(title) : title,
        content: content ? sanitizeHtml(content) : content,
      });
      res.json({ success: true, thread: updated });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
      logger.error({ err: error }, "Error updating thread:");
      res.status(500).json({ error: "Failed to update thread" });
    }
  });

  app.delete("/api/forum/threads/:threadId", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const { threadId } = req.params;
      const thread = await storage.getForumThreadById(threadId);
      if (!thread) return res.status(404).json({ error: "Thread not found" });

      const isOwner = thread.authorId === user.id;
      const isMod = ['admin', 'moderator'].includes(user.role || '');
      if (!isOwner && !isMod) return res.status(403).json({ error: "Not authorized" });

      await storage.deleteForumThread(threadId);
      res.json({ success: true });
    } catch (error) {
      logger.error({ err: error }, "Error deleting thread:");
      res.status(500).json({ error: "Failed to delete thread" });
    }
  });

  // Forum reply edit/delete
  app.put("/api/forum/replies/:replyId", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const { replyId } = req.params;
      const reply = await storage.getForumReply(replyId);
      if (!reply) return res.status(404).json({ error: "Reply not found" });

      const isOwner = reply.authorId === user.id;
      const isMod = ['admin', 'moderator'].includes(user.role || '');
      if (!isOwner && !isMod) return res.status(403).json({ error: "Not authorized" });

      const { content } = z.object({ content: z.string().min(1) }).parse(req.body);
      const updated = await storage.updateForumReply(replyId, { content: sanitizeHtml(content) });
      res.json({ success: true, reply: updated });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
      logger.error({ err: error }, "Error updating reply:");
      res.status(500).json({ error: "Failed to update reply" });
    }
  });

  app.delete("/api/forum/replies/:replyId", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const { replyId } = req.params;
      const reply = await storage.getForumReply(replyId);
      if (!reply) return res.status(404).json({ error: "Reply not found" });

      const isOwner = reply.authorId === user.id;
      const isMod = ['admin', 'moderator'].includes(user.role || '');
      if (!isOwner && !isMod) return res.status(403).json({ error: "Not authorized" });

      await storage.deleteForumReply(replyId);
      res.json({ success: true });
    } catch (error) {
      logger.error({ err: error }, "Error deleting reply:");
      res.status(500).json({ error: "Failed to delete reply" });
    }
  });

  // Page Content Management routes are in adminRoutes.ts (mounted at /api/admin)

  // Object Storage Upload Endpoint (requires authentication)
  app.post("/api/objects/upload", requireAuth, uploadLimiter, async (req, res) => {
    try {
      const user = req.user as User;
      if (!['admin', 'instructor'].includes(user.role || '')) {
        return res.status(403).json({ error: "Upload permission required" });
      }
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      logger.error({ err: error }, "Error getting upload URL:");
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Public Downloads Endpoints
  app.get("/api/downloads/published", async (req, res) => {
    try {
      const publishedDownloads = await storage.getPublishedDownloads();
      res.json(publishedDownloads);
    } catch (error) {
      logger.error({ err: error }, "Error fetching published downloads:");
      res.status(500).json({ error: "Failed to fetch downloads" });
    }
  });

  app.post("/api/downloads/:id/track", optionalAuth, async (req, res) => {
    try {
      const id = req.params.id;
      const updated = await storage.incrementDownloadCount(id);
      if (req.user) {
        await storage.trackUserDownload(req.user.id, id, req.ip);
      }
      res.json({ downloadCount: updated.downloadCount });
    } catch (error) {
      logger.error({ err: error }, "Error tracking download:");
      res.status(500).json({ error: "Failed to track download" });
    }
  });

  // Auth-gated file download endpoint
  app.get("/api/downloads/:id/file", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      if (!user.isEmailVerified) {
        return res.status(403).json({ error: "Please verify your email before downloading files" });
      }

      const id = req.params.id;
      const download = await storage.getDownload(id);

      if (!download || (!download.isPublished && user.role !== 'admin')) {
        return res.status(404).json({ error: "Download not found" });
      }

      await storage.trackUserDownload(user.id, id, req.ip);
      await storage.incrementDownloadCount(id);

      res.json({ fileUrl: download.fileUrl, fileName: download.title });
    } catch (error) {
      logger.error({ err: error }, "Error downloading file:");
      res.status(500).json({ error: "Failed to download file" });
    }
  });

  // User download history endpoint
  app.get("/api/my-downloads", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const history = await storage.getUserDownloadHistory(userId);
      res.json(history);
    } catch (error) {
      logger.error({ err: error }, "Error fetching download history:");
      res.status(500).json({ error: "Failed to fetch download history" });
    }
  });

  // Trust Document Download Endpoints
  app.post("/api/trust-download-signup", trustDownloadLimiter, async (req, res) => {
    try {
      const downloadData = insertTrustDownloadSchema.parse({
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      // Check if email already has access
      const existingDownload = await storage.getTrustDownloadByEmail(downloadData.email);
      if (existingDownload) {
        return res.json({ 
          success: true, 
          downloadUrl: "/api/trust-document-pdf",
          message: "You already have access to this document" 
        });
      }

      // Create new download record
      await storage.createTrustDownload(downloadData);
      
      res.json({ 
        success: true, 
        downloadUrl: "/api/trust-document-pdf",
        message: "Access granted successfully" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        logger.error({ err: error }, "Error processing trust download signup:");
        res.status(500).json({ error: "Failed to process signup" });
      }
    }
  });

  // Serve the trust document PDF from resources
  app.get("/api/trust-document-pdf", (req, res) => {
    const pdfPath = path.resolve(import.meta.dirname, "../resources/Public-Declaration-of-Trust.pdf");
    res.download(pdfPath, "new-covenant-trust-document.pdf", (err) => {
      if (err && !res.headersSent) {
        res.status(404).json({ error: "Trust document not found" });
      }
    });
  });

  // Trust document downloads admin endpoint
  app.get("/api/admin/trust-downloads", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      if (user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const downloads = await storage.getAllTrustDownloads();
      res.json(downloads);
    } catch (error) {
      logger.error({ err: error }, "Error fetching trust downloads:");
      res.status(500).json({ error: "Failed to fetch trust downloads" });
    }
  });

  // Video Management Routes
  
  // Get course sections for a specific course
  app.get("/api/courses/:courseId/sections", async (req, res) => {
    try {
      const sections = await storage.getCourseSections(req.params.courseId);
      res.json(sections);
    } catch (error) {
      logger.error({ err: error }, "Error fetching course sections:");
      res.status(500).json({ error: "Failed to fetch course sections" });
    }
  });

  // Create a new course section (instructor+)
  app.post("/api/courses/:courseId/sections", requireAuth, requireInstructor, async (req, res) => {
    try {
      const sectionData = insertCourseSectionSchema.parse({
        ...req.body,
        courseId: req.params.courseId,
      });
      
      const section = await storage.createCourseSection(sectionData);
      res.json(section);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        logger.error({ err: error }, "Error creating course section:");
        res.status(500).json({ error: "Failed to create course section" });
      }
    }
  });

  // Update course section (instructor+)
  app.put("/api/sections/:id", requireAuth, requireInstructor, async (req, res) => {
    try {
      const updates = insertCourseSectionSchema.partial().parse(req.body);
      const section = await storage.updateCourseSection(req.params.id, updates);
      res.json(section);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        logger.error({ err: error }, "Error updating course section:");
        res.status(500).json({ error: "Failed to update course section" });
      }
    }
  });

  // Get user's course progress
  app.get("/api/courses/:courseId/progress", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const progress = await storage.getCourseProgressForUser(userId, req.params.courseId);
      res.json(progress);
    } catch (error) {
      logger.error({ err: error }, "Error fetching course progress:");
      res.status(500).json({ error: "Failed to fetch course progress" });
    }
  });

  // Complete a section
  app.post("/api/sections/:sectionId/complete", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const progress = await storage.completeSectionForUser(userId, req.params.sectionId);
      res.json(progress);
    } catch (error) {
      logger.error({ err: error }, "Error completing section:");
      res.status(500).json({ error: "Failed to complete section" });
    }
  });

  // Update video progress
  app.post("/api/videos/:videoId/progress", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const progressData = insertVideoProgressSchema.parse(req.body);
      
      const progress = await storage.updateVideoProgress(userId, req.params.videoId, progressData);
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        logger.error({ err: error }, "Error updating video progress:");
        res.status(500).json({ error: "Failed to update video progress" });
      }
    }
  });

  // Get user's video progress
  app.get("/api/videos/:videoId/progress", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const progress = await storage.getUserVideoProgress(userId, req.params.videoId);
      res.json(progress || { watchedDuration: 0, isCompleted: false });
    } catch (error) {
      logger.error({ err: error }, "Error fetching video progress:");
      res.status(500).json({ error: "Failed to fetch video progress" });
    }
  });

  // Dictionary routes (public — no auth required)
  app.get("/api/dictionary/search", async (req, res) => {
    try {
      const q = typeof req.query.q === "string" ? req.query.q : "";
      const limit = parseInt(req.query.limit as string) || 20;
      const results = await storage.searchDictionary(q, limit);
      res.json(results);
    } catch (error) {
      logger.error({ err: error }, "Dictionary search error:");
      res.status(500).json({ error: "Failed to search dictionary" });
    }
  });

  app.get("/api/dictionary/stats", async (req, res) => {
    try {
      const stats = await storage.getDictionaryStats();
      res.json(stats);
    } catch (error) {
      logger.error({ err: error }, "Dictionary stats error:");
      res.status(500).json({ error: "Failed to fetch dictionary stats" });
    }
  });

  // Batch endpoint for client-side search engine index (must be before :id route)
  app.get("/api/dictionary/batch", async (req, res) => {
    try {
      const offset = parseInt(req.query.offset as string) || 0;
      const limit = parseInt(req.query.limit as string) || 500;
      const results = await storage.getDictionaryBatch(offset, limit);
      res.json(results);
    } catch (error) {
      logger.error({ err: error }, "Dictionary batch error:");
      res.status(500).json({ error: "Failed to fetch dictionary batch" });
    }
  });

  app.get("/api/dictionary/:id", async (req, res) => {
    try {
      const entry = await storage.getDictionaryEntry(req.params.id);
      if (!entry) {
        return res.status(404).json({ error: "Entry not found" });
      }
      res.json(entry);
    } catch (error) {
      logger.error({ err: error }, "Dictionary entry error:");
      res.status(500).json({ error: "Failed to fetch dictionary entry" });
    }
  });

  // ─── Notification routes ───

  app.get("/api/notifications", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const notifs = await storage.getUserNotifications(user.id);
      res.json(notifs);
    } catch (error) {
      logger.error({ err: error }, "Error fetching notifications");
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/unread-count", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const count = await storage.getUnreadNotificationCount(user.id);
      res.json({ count });
    } catch (error) {
      logger.error({ err: error }, "Error fetching unread count");
      res.status(500).json({ error: "Failed to fetch unread count" });
    }
  });

  app.patch("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      const notif = await storage.markNotificationRead(req.params.id);
      res.json(notif);
    } catch (error) {
      logger.error({ err: error }, "Error marking notification read");
      res.status(500).json({ error: "Failed to update notification" });
    }
  });

  app.post("/api/notifications/mark-all-read", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      await storage.markAllNotificationsRead(user.id);
      res.json({ success: true });
    } catch (error) {
      logger.error({ err: error }, "Error marking all notifications read");
      res.status(500).json({ error: "Failed to update notifications" });
    }
  });

  // ─── Dashboard ───

  app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const stats = await storage.getDashboardStats(user.id);
      const recentActivity = await storage.getRecentUserActivity(user.id, 10);
      res.json({ ...stats, recentActivity });
    } catch (error) {
      logger.error({ err: error }, "Error fetching dashboard stats");
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // ─── Comments ───

  app.get("/api/comments", optionalAuth, async (req, res) => {
    try {
      const { targetType, targetId } = req.query;
      if (!targetType || !targetId || typeof targetType !== 'string' || typeof targetId !== 'string') {
        return res.status(400).json({ error: "targetType and targetId are required" });
      }
      const commentsList = await storage.getCommentsByTarget(targetType, targetId);
      res.json(commentsList);
    } catch (error) {
      logger.error({ err: error }, "Error fetching comments");
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/comments", requireAuth, forumLimiter, async (req, res) => {
    try {
      const user = req.user as User;
      const { targetType, targetId, content } = z.object({
        targetType: z.enum(['video', 'lesson']),
        targetId: z.string().min(1),
        content: z.string().min(1),
      }).parse(req.body);

      const comment = await storage.createComment({
        targetType,
        targetId,
        content: sanitizeHtml(content),
        authorId: user.id,
      });
      res.json({ success: true, comment });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      logger.error({ err: error }, "Error creating comment");
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  app.put("/api/comments/:id", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const comment = await storage.getComment(req.params.id);
      if (!comment) return res.status(404).json({ error: "Comment not found" });

      const isOwner = comment.authorId === user.id;
      const isMod = ['admin', 'moderator'].includes(user.role || '');
      if (!isOwner && !isMod) return res.status(403).json({ error: "Not authorized" });

      const { content } = z.object({ content: z.string().min(1) }).parse(req.body);
      const updated = await storage.updateComment(req.params.id, { content: sanitizeHtml(content) });
      res.json({ success: true, comment: updated });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
      logger.error({ err: error }, "Error updating comment");
      res.status(500).json({ error: "Failed to update comment" });
    }
  });

  app.delete("/api/comments/:id", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const comment = await storage.getComment(req.params.id);
      if (!comment) return res.status(404).json({ error: "Comment not found" });

      const isOwner = comment.authorId === user.id;
      const isMod = ['admin', 'moderator'].includes(user.role || '');
      if (!isOwner && !isMod) return res.status(403).json({ error: "Not authorized" });

      await storage.deleteComment(req.params.id);
      res.json({ success: true });
    } catch (error) {
      logger.error({ err: error }, "Error deleting comment");
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });

  // ─── Global search ───

  app.get("/api/search", async (req, res) => {
    try {
      const q = typeof req.query.q === "string" ? req.query.q : "";
      if (q.trim().length < 2) {
        return res.json({ courses: [], threads: [], downloads: [] });
      }
      const results = await storage.searchGlobal(q);
      res.json(results);
    } catch (error) {
      logger.error({ err: error }, "Error in global search");
      res.status(500).json({ error: "Search failed" });
    }
  });

  // ─── Public profile ───

  app.get("/api/users/:userId/profile", async (req, res) => {
    try {
      const profile = await storage.getPublicProfile(req.params.userId);
      if (!profile) return res.status(404).json({ error: "User not found" });
      res.json(profile);
    } catch (error) {
      logger.error({ err: error }, "Error fetching public profile");
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // ─── Thread subscriptions ───

  app.post("/api/forum/threads/:threadId/subscribe", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const sub = await storage.subscribeToThread(user.id, req.params.threadId);
      res.json(sub);
    } catch (error) {
      logger.error({ err: error }, "Error subscribing to thread");
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  app.delete("/api/forum/threads/:threadId/subscribe", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      await storage.unsubscribeFromThread(user.id, req.params.threadId);
      res.json({ success: true });
    } catch (error) {
      logger.error({ err: error }, "Error unsubscribing from thread");
      res.status(500).json({ error: "Failed to unsubscribe" });
    }
  });

  app.get("/api/forum/threads/:threadId/subscription", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const subscribed = await storage.isSubscribedToThread(user.id, req.params.threadId);
      res.json({ subscribed });
    } catch (error) {
      logger.error({ err: error }, "Error checking subscription");
      res.status(500).json({ error: "Failed to check subscription" });
    }
  });

  // Admin routes
  app.use('/api/admin', adminRoutes);

  // Proof Vault routes
  app.use('/api/proof-vault', proofVaultRoutes);

  const httpServer = createServer(app);
  return httpServer;
}

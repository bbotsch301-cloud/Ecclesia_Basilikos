import type { Express, Request, Response, NextFunction } from "express";

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
import { isPremiumUser, requireSubscription } from "./subscriptionMiddleware";
import logger from "./logger";
import { sendForumReplyNotificationEmail } from "./email";

// Middleware: require verified email for sensitive actions
function requireVerifiedEmail(req: Request, res: Response, next: NextFunction) {
  const user = req.user as User | undefined;
  if (!user || !user.isEmailVerified) {
    return res.status(403).json({ error: "Email verification required. Please verify your email before performing this action." });
  }
  next();
}

// Account lockout: track failed login attempts per email
const loginAttempts = new Map<string, { count: number; lockedUntil: number | null }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60_000; // 15 minutes

// Clean up expired login attempt entries every 30 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  loginAttempts.forEach((entry, key) => {
    if (entry.lockedUntil && now > entry.lockedUntil) {
      loginAttempts.delete(key);
    }
  });
}, 30 * 60_000);

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoints (no auth required)
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/ready", async (_req, res) => {
    try {
      const { pool } = await import("./db");
      await pool.query("SELECT 1");
      res.json({ ready: true });
    } catch {
      res.status(503).json({ ready: false });
    }
  });

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
      const verificationUrl = `${process.env.BASE_URL || `${req.protocol}://${req.get('host')}`}/verify-email?token=${user.emailVerificationToken}`;
      
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
        subject: emailTemplate.subject || 'Verify Your Email - Ecclesia Basilikos',
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

      // Account lockout check
      const normalizedEmail = email.toLowerCase();
      const attempts = loginAttempts.get(normalizedEmail);
      if (attempts?.lockedUntil) {
        if (Date.now() < attempts.lockedUntil) {
          const minutesLeft = Math.ceil((attempts.lockedUntil - Date.now()) / 60_000);
          return res.status(429).json({
            error: `Account temporarily locked due to too many failed login attempts. Try again in ${minutesLeft} minute(s).`
          });
        }
        // Lockout expired, reset
        loginAttempts.delete(normalizedEmail);
      }

      const user = await storage.validateUser(email, password);
      if (!user) {
        // Track failed attempt
        const current = loginAttempts.get(normalizedEmail) || { count: 0, lockedUntil: null };
        current.count += 1;
        if (current.count >= MAX_LOGIN_ATTEMPTS) {
          current.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
          loginAttempts.set(normalizedEmail, current);
          return res.status(429).json({
            error: "Account temporarily locked due to too many failed login attempts. Try again in 15 minutes."
          });
        }
        loginAttempts.set(normalizedEmail, current);
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Successful login — clear any failed attempts
      loginAttempts.delete(normalizedEmail);

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

      // Log the user in so they land on the dashboard authenticated
      req.session.userId = user.id;

      // Create welcome notification
      await storage.createNotification({
        userId: user.id,
        type: 'welcome',
        title: 'Welcome to Ecclesia Basilikos!',
        message: 'Start your journey by exploring our courses and downloading essential documents.',
        linkUrl: '/dashboard',
      });

      // Send welcome email (non-blocking)
      const { sendEmail: sendWelcome, generateWelcomeEmailHtml, sendOnboardingEmail } = await import('./email');
      sendWelcome({
        to: user.email,
        subject: 'Welcome to Ecclesia Basilikos - Your Journey Begins',
        html: generateWelcomeEmailHtml(user.firstName),
      }).catch((err) => logger.error({ err }, 'Failed to send welcome email'));

      // Schedule onboarding "Getting Started" email (5-minute delay, non-blocking)
      sendOnboardingEmail(user.email, user.firstName);

      res.json({
        success: true,
        message: "Email verified successfully! Welcome to Ecclesia Basilikos."
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

      const resetUrl = `${process.env.BASE_URL || `${req.protocol}://${req.get("host")}`}/reset-password?token=${token}`;

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
        password: z.string().min(8, "Password must be at least 8 characters"),
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
        emailNotifications: z.boolean().optional(),
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
        newPassword: z.string().min(8),
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

  // GDPR: Export all user data
  app.get("/api/auth/export-data", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;

      // Gather all user data from existing storage methods and direct queries
      const [
        enrollmentsData,
        notificationsData,
        subscriptionHistory,
        downloadHistory,
      ] = await Promise.all([
        storage.getUserEnrollments(user.id),
        storage.getUserNotifications(user.id, 1000),
        storage.getSubscriptionHistory(user.id),
        storage.getUserDownloadHistory(user.id),
      ]);

      // Direct queries for data without dedicated storage methods
      const [
        forumThreadsData,
        forumRepliesData,
        commentsData,
        proofsData,
      ] = await Promise.all([
        storage.getUserForumThreads(user.id),
        storage.getUserForumReplies(user.id),
        storage.getUserComments(user.id),
        storage.getUserProofs(user.id),
      ]);

      // Build the export object, excluding sensitive fields
      const { password: _pw, emailVerificationToken: _tok, passwordResetToken: _prt, passwordResetExpires: _pre, emailVerificationExpires: _eve, ...safeProfile } = user;

      const exportData = {
        exportDate: new Date().toISOString(),
        profile: safeProfile,
        enrollments: enrollmentsData,
        forumThreads: forumThreadsData,
        forumReplies: forumRepliesData,
        comments: commentsData,
        downloads: downloadHistory,
        proofs: proofsData,
        subscriptions: subscriptionHistory,
        notifications: notificationsData,
      };

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="user-data-export-${user.id}.json"`);
      res.json(exportData);
    } catch (error) {
      logger.error({ err: error }, "Data export error:");
      res.status(500).json({ error: "Failed to export data" });
    }
  });

  // GDPR: Delete account
  app.delete("/api/auth/delete-account", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const { password } = z.object({
        password: z.string().min(1, "Password is required"),
      }).parse(req.body);

      const bcryptMod = await import("bcryptjs");
      const isValid = await bcryptMod.compare(password, user.password);
      if (!isValid) {
        return res.status(400).json({ error: "Password is incorrect" });
      }

      await storage.deleteAllUserData(user.id);

      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          logger.error({ err }, "Session destruction error during account deletion");
        }
        res.clearCookie("connect.sid");
        res.json({ success: true, message: "Account deleted successfully" });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      logger.error({ err: error }, "Account deletion error:");
      res.status(500).json({ error: "Failed to delete account" });
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
  app.post("/api/enrollments", requireAuth, requireVerifiedEmail, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const { courseId } = insertEnrollmentSchema.parse(req.body);

      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Gate non-free courses behind premium subscription
      if (!course.isFree && !isPremiumUser((req as any).user)) {
        return res.status(403).json({ error: "Premium subscription required", code: "PREMIUM_REQUIRED" });
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
      const page = Math.max(1, parseInt((req.query.page as string) || "1", 10));
      const limit = 20;
      const offset = (page - 1) * limit;
      const { threads, total } = await storage.getRecentForumThreads(offset, limit);
      const threadIds = threads.map(t => t.id);
      const likeCounts = await storage.getThreadLikeCounts(threadIds);
      const user = req.user as User | undefined;
      let userLikedSet = new Set<string>();
      if (user) {
        userLikedSet = await storage.getUserLikedThreadIds(user.id, threadIds);
      }
      res.json({
        threads: threads.map(t => ({
          ...t,
          likeCount: likeCounts[t.id] || 0,
          userLiked: userLikedSet.has(t.id),
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
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
      const threadIds = threads.map(t => t.id);
      const likeCounts = await storage.getThreadLikeCounts(threadIds);
      const user = req.user as User | undefined;
      let userLikedSet = new Set<string>();
      if (user) {
        userLikedSet = await storage.getUserLikedThreadIds(user.id, threadIds);
      }
      res.json(threads.map(t => ({
        ...t,
        likeCount: likeCounts[t.id] || 0,
        userLiked: userLikedSet.has(t.id),
      })));
    } catch (error) {
      logger.error({ err: error }, "Error fetching forum threads:");
      res.status(500).json({ error: "Failed to fetch threads" });
    }
  });

  // Create a new thread
  app.post("/api/forum/threads", requireAuth, requireVerifiedEmail, requireSubscription, forumLimiter, async (req, res) => {
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

      // Get like counts
      const replyIds = replies.map(r => r.id);
      const [threadLikeCounts, replyLikeCounts] = await Promise.all([
        storage.getThreadLikeCounts([threadId]),
        storage.getReplyLikeCounts(replyIds),
      ]);

      // Get user's likes if authenticated
      const user = req.user as User | undefined;
      let userLikedThread = false;
      let userLikedReplyIds = new Set<string>();
      if (user) {
        const [likedThreads, likedReplies] = await Promise.all([
          storage.getUserLikedThreadIds(user.id, [threadId]),
          storage.getUserLikedReplyIds(user.id, replyIds),
        ]);
        userLikedThread = likedThreads.has(threadId);
        userLikedReplyIds = likedReplies;
      }

      res.json({
        thread: { ...thread, likeCount: threadLikeCounts[threadId] || 0, userLiked: userLikedThread },
        replies: replies.map(r => ({
          ...r,
          likeCount: replyLikeCounts[r.id] || 0,
          userLiked: userLikedReplyIds.has(r.id),
        })),
      });
    } catch (error) {
      logger.error({ err: error }, "Error fetching forum thread:");
      res.status(500).json({ error: "Failed to fetch thread" });
    }
  });

  // Create a reply to a thread
  app.post("/api/forum/threads/:threadId/replies", requireAuth, requireVerifiedEmail, requireSubscription, forumLimiter, async (req, res) => {
    try {
      const { threadId } = req.params;
      const replyData = insertForumReplySchema.omit({ authorId: true, threadId: true }).parse(req.body);
      const user = req.user as User;

      const thread = await storage.getForumThreadById(threadId);

      if (!thread) {
        return res.status(404).json({ error: "Thread not found." });
      }

      if (thread.isLocked) {
        return res.status(403).json({ error: "This thread is locked and no longer accepting replies." });
      }

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
        storage.getThreadSubscribers(threadId).then(async (subscriberIds) => {
          for (const subId of subscriberIds) {
            if (subId !== user.id) notifyUserIds.add(subId);
          }
          const replierName = user.firstName || "Someone";
          for (const uid of Array.from(notifyUserIds)) {
            storage.createNotification({
              userId: uid,
              type: "forum_reply",
              title: "New reply to your thread",
              message: `${replierName} replied to "${thread.title}"`,
              linkUrl: `/forum/thread/${threadId}`,
            }).catch((err) => logger.warn({ err }, "Failed to create reply notification"));

            // Send email notification (non-blocking)
            storage.getUser(uid).then((recipient) => {
              if (recipient && recipient.isEmailVerified && recipient.emailNotifications !== false) {
                sendForumReplyNotificationEmail(
                  recipient.email,
                  replierName,
                  thread.title,
                  threadId,
                );
              }
            }).catch((err) => logger.warn({ err }, "Failed to send forum reply email"));
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
      }).refine(data => data.title || data.content, {
        message: "At least one of title or content must be provided",
      }).parse(req.body);

      const updated = await storage.updateForumThread(threadId, {
        title: title ? sanitizePlainText(title) : undefined,
        content: content ? sanitizeHtml(content) : undefined,
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

  // Forum likes
  app.post("/api/forum/threads/:threadId/like", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      await storage.likeThread(user.id, req.params.threadId);
      res.json({ success: true });
    } catch (error) {
      logger.error({ err: error }, "Error liking thread:");
      res.status(500).json({ error: "Failed to like thread" });
    }
  });

  app.delete("/api/forum/threads/:threadId/like", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      await storage.unlikeThread(user.id, req.params.threadId);
      res.json({ success: true });
    } catch (error) {
      logger.error({ err: error }, "Error unliking thread:");
      res.status(500).json({ error: "Failed to unlike thread" });
    }
  });

  app.post("/api/forum/replies/:replyId/like", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      await storage.likeReply(user.id, req.params.replyId);
      res.json({ success: true });
    } catch (error) {
      logger.error({ err: error }, "Error liking reply:");
      res.status(500).json({ error: "Failed to like reply" });
    }
  });

  app.delete("/api/forum/replies/:replyId/like", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      await storage.unlikeReply(user.id, req.params.replyId);
      res.json({ success: true });
    } catch (error) {
      logger.error({ err: error }, "Error unliking reply:");
      res.status(500).json({ error: "Failed to unlike reply" });
    }
  });

  // Forum categories with thread counts
  app.get("/api/forum/categories-with-counts", async (req, res) => {
    try {
      const [categories, threadCounts] = await Promise.all([
        storage.getForumCategories(),
        storage.getCategoryThreadCounts(),
      ]);
      res.json(categories.map(c => ({ ...c, threadCount: threadCounts[c.id] || 0 })));
    } catch (error) {
      logger.error({ err: error }, "Error fetching categories with counts:");
      res.status(500).json({ error: "Failed to fetch categories" });
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
  app.get("/api/downloads/:id/file", requireAuth, requireVerifiedEmail, async (req, res) => {
    try {
      const user = req.user!;

      const id = req.params.id;
      const download = await storage.getDownload(id);

      if (!download || (!download.isPublished && user.role !== 'admin')) {
        return res.status(404).json({ error: "Download not found" });
      }

      // Gate non-free, non-public downloads behind premium
      if (!download.isFree && !download.isPublic && !isPremiumUser(user)) {
        return res.status(403).json({ error: "Premium subscription required", code: "PREMIUM_REQUIRED" });
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

  // Complete an enrollment (mark course as finished)
  app.post("/api/enrollments/:courseId/complete", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const enrollment = await storage.completeEnrollment(userId, req.params.courseId);
      res.json(enrollment);
    } catch (error) {
      logger.error({ err: error }, "Error completing enrollment:");
      res.status(500).json({ error: "Failed to complete enrollment" });
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
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
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
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
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
      const user = req.user as User;
      const existing = await storage.getNotification(req.params.id);
      if (!existing || existing.userId !== user.id) {
        return res.status(404).json({ error: "Notification not found" });
      }
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

  app.post("/api/comments", requireAuth, requireVerifiedEmail, requireSubscription, forumLimiter, async (req, res) => {
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

  // ─── Content Report / Flag ───

  // In-memory rate tracking for reports (max 5 per user per hour)
  const reportCounts = new Map<string, { count: number; resetAt: number }>();

  // Cleanup stale entries every 30 minutes
  setInterval(() => {
    const now = Date.now();
    reportCounts.forEach((entry, key) => {
      if (now > entry.resetAt) reportCounts.delete(key);
    });
  }, 30 * 60_000);

  function checkReportRateLimit(userId: string): boolean {
    const now = Date.now();
    const entry = reportCounts.get(userId);
    if (!entry || now > entry.resetAt) {
      reportCounts.set(userId, { count: 1, resetAt: now + 60 * 60_000 });
      return true;
    }
    if (entry.count >= 5) return false;
    entry.count++;
    return true;
  }

  const reportSchema = z.object({
    reason: z.string().min(10, "Reason must be at least 10 characters"),
  });

  app.post("/api/forum/threads/:threadId/report", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      if (!checkReportRateLimit(user.id)) {
        return res.status(429).json({ error: "Too many reports. Please try again later." });
      }

      const { reason } = reportSchema.parse(req.body);
      const { threadId } = req.params;

      const thread = await storage.getForumThreadById(threadId);
      if (!thread) return res.status(404).json({ error: "Thread not found" });

      await storage.createContact({
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
        email: user.email,
        subject: "content-report",
        message: `[Thread Report] Thread ID: ${threadId}\nThread Title: ${thread.title}\nReported by User ID: ${user.id}\n\nReason: ${reason}`,
      });

      logger.info({ userId: user.id, threadId }, "Thread reported");
      res.json({ success: true, message: "Report submitted. Thank you." });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      logger.error({ err: error }, "Error reporting thread");
      res.status(500).json({ error: "Failed to submit report" });
    }
  });

  app.post("/api/forum/replies/:replyId/report", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      if (!checkReportRateLimit(user.id)) {
        return res.status(429).json({ error: "Too many reports. Please try again later." });
      }

      const { reason } = reportSchema.parse(req.body);
      const { replyId } = req.params;

      const reply = await storage.getForumReply(replyId);
      if (!reply) return res.status(404).json({ error: "Reply not found" });

      await storage.createContact({
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
        email: user.email,
        subject: "content-report",
        message: `[Reply Report] Reply ID: ${replyId}\nThread ID: ${reply.threadId}\nReported by User ID: ${user.id}\n\nReason: ${reason}`,
      });

      logger.info({ userId: user.id, replyId }, "Reply reported");
      res.json({ success: true, message: "Report submitted. Thank you." });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      logger.error({ err: error }, "Error reporting reply");
      res.status(500).json({ error: "Failed to submit report" });
    }
  });

  // Admin routes
  app.use('/api/admin', adminRoutes);

  // Subscription status endpoint
  app.get("/api/subscription/status", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const premium = isPremiumUser(user);
      res.json({
        tier: user.subscriptionTier || 'free',
        status: user.subscriptionStatus || 'none',
        isPremium: premium,
        startDate: user.subscriptionStartDate,
        endDate: user.subscriptionEndDate,
        features: {
          trustCourses: true,
          allCourses: premium,
          trustDownloads: true,
          allDownloads: premium,
          forumRead: true,
          forumWrite: premium,
          proofVault: premium,
          comments: premium,
        },
      });
    } catch (error) {
      logger.error({ err: error }, "Error fetching subscription status:");
      res.status(500).json({ error: "Failed to fetch subscription status" });
    }
  });

  app.get("/api/subscription/history", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const history = await storage.getSubscriptionHistory(user.id);
      res.json(history);
    } catch (error) {
      logger.error({ err: error }, "Error fetching subscription history:");
      res.status(500).json({ error: "Failed to fetch subscription history" });
    }
  });

  // Self-service subscription cancellation (for non-Stripe/admin-granted subscriptions)
  app.post("/api/subscription/cancel", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;

      if (user.subscriptionTier !== 'premium' || user.subscriptionStatus !== 'active') {
        return res.status(400).json({ error: "No active subscription to cancel" });
      }

      // If the user has a Stripe subscription, they should use the Stripe portal
      if (user.stripeSubscriptionId) {
        return res.status(400).json({
          error: "Your subscription is managed through Stripe. Please use the Stripe customer portal to cancel.",
        });
      }

      const now = new Date();
      // Set end date to 30 days from now to allow continued access
      const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Update the user's subscription status
      await storage.updateUserSubscription(user.id, {
        subscriptionStatus: 'cancelled',
        subscriptionEndDate: endDate,
      });

      // Determine the original source from the most recent active subscription record
      const history = await storage.getSubscriptionHistory(user.id);
      const activeRecord = history.find(r => r.status === 'active');
      const source = activeRecord?.source || 'manual';

      // Create a cancellation subscription record
      await storage.createSubscriptionRecord({
        userId: user.id,
        tier: 'premium',
        status: 'cancelled',
        source,
        startDate: user.subscriptionStartDate || now,
        endDate,
        cancelledAt: now,
        notes: 'Self-service cancellation by user',
      });

      logger.info({ userId: user.id }, "User cancelled their subscription");

      res.json({
        success: true,
        message: "Subscription cancelled. You will retain access until " + endDate.toLocaleDateString(),
        endDate: endDate.toISOString(),
      });
    } catch (error) {
      logger.error({ err: error, userId: (req.user as User).id }, "Error cancelling subscription");
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });

  // ─── Stripe integration routes ───

  // Check if Stripe is enabled (used by frontend to show/hide payment buttons)
  app.get("/api/stripe/status", async (_req, res) => {
    try {
      const { isStripeEnabled } = await import("./stripe");
      res.json({
        enabled: isStripeEnabled(),
        priceId: process.env.STRIPE_PRICE_ID || null,
      });
    } catch {
      res.json({ enabled: false });
    }
  });

  // Create Stripe Checkout session for subscription
  app.post("/api/stripe/create-checkout-session", requireAuth, async (req, res) => {
    try {
      const { createCheckoutSession, isStripeEnabled } = await import("./stripe");
      if (!isStripeEnabled()) {
        return res.status(503).json({ error: "Stripe is not configured" });
      }

      const user = req.user as User;
      const priceId = req.body.priceId || process.env.STRIPE_PRICE_ID;

      if (!priceId || typeof priceId !== "string") {
        return res.status(400).json({ error: "priceId is required (set STRIPE_PRICE_ID env var or pass in body)" });
      }

      const url = await createCheckoutSession(user.id, user.email, priceId);
      res.json({ url });
    } catch (error: any) {
      logger.error({ err: error }, "Error creating checkout session");
      res.status(500).json({ error: error.message || "Failed to create checkout session" });
    }
  });

  // Create Stripe Customer Portal session for managing subscription
  app.post("/api/stripe/create-portal-session", requireAuth, async (req, res) => {
    try {
      const { createBillingPortalSession, isStripeEnabled } = await import("./stripe");
      if (!isStripeEnabled()) {
        return res.status(503).json({ error: "Stripe is not configured" });
      }

      const user = req.user as User;
      if (!user.stripeCustomerId) {
        return res.status(400).json({ error: "No Stripe customer found. Please subscribe first." });
      }

      const url = await createBillingPortalSession(user.stripeCustomerId);
      res.json({ url });
    } catch (error: any) {
      logger.error({ err: error }, "Error creating portal session");
      res.status(500).json({ error: error.message || "Failed to create portal session" });
    }
  });

  // Note: The POST /api/stripe/webhook route is registered in server/index.ts
  // BEFORE express.json() middleware, because it requires raw body for signature verification.

  // Proof Vault routes
  app.use('/api/proof-vault', proofVaultRoutes);

  const httpServer = createServer(app);
  return httpServer;
}

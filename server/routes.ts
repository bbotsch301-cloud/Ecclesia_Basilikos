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
import { sessionMiddleware, requireAuth, optionalAuth } from "./auth";
import adminRoutes from "./adminRoutes";
import { 
  insertContactSchema, 
  insertNewsletterSchema, 
  insertUserSchema, 
  loginSchema,
  insertEnrollmentSchema,
  insertForumCategorySchema,
  insertForumThreadSchema,
  insertForumReplySchema,
  type User
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(sessionMiddleware);

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const user = await storage.createUser(userData);
      req.session.userId = user.id;
      
      const { password, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Registration failed" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.validateUser(email, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      req.session.userId = user.id;
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        console.error("Login error:", error);
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
    const { password, ...userWithoutPassword } = (req as any).user;
    res.json(userWithoutPassword);
  });

  // Course routes
  app.get("/api/courses", optionalAuth, async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      console.error("Get courses error:", error);
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
      console.error("Get course error:", error);
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  // Enrollment routes
  app.post("/api/enrollments", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const { courseId } = insertEnrollmentSchema.parse(req.body);
      
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
        console.error("Enrollment error:", error);
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
      console.error("Get enrollments error:", error);
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
      console.error("Get downloads error:", error);
      res.status(500).json({ error: "Failed to fetch downloads" });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
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

  // Newsletter subscription
  app.post("/api/newsletter", async (req, res) => {
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

  // Forum routes

  // Get all forum categories
  app.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching forum categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Create a new forum category (admin only for now)
  app.post("/api/forum/categories", requireAuth, async (req, res) => {
    try {
      const categoryData = insertForumCategorySchema.parse(req.body);
      const category = await storage.createForumCategory(categoryData);
      res.json({ success: true, category });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        console.error("Error creating forum category:", error);
        res.status(500).json({ error: "Failed to create category" });
      }
    }
  });

  // Get threads by category
  app.get("/api/forum/categories/:categoryId/threads", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const threads = await storage.getForumThreadsByCategory(categoryId);
      res.json(threads);
    } catch (error) {
      console.error("Error fetching forum threads:", error);
      res.status(500).json({ error: "Failed to fetch threads" });
    }
  });

  // Create a new thread
  app.post("/api/forum/threads", requireAuth, async (req, res) => {
    try {
      const threadData = insertForumThreadSchema.parse(req.body);
      const user = req.user as User;
      
      const thread = await storage.createForumThread({
        ...threadData,
        authorId: user.id,
      });
      
      res.json({ success: true, thread });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        console.error("Error creating forum thread:", error);
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
      console.error("Error fetching forum thread:", error);
      res.status(500).json({ error: "Failed to fetch thread" });
    }
  });

  // Create a reply to a thread
  app.post("/api/forum/threads/:threadId/replies", requireAuth, async (req, res) => {
    try {
      const { threadId } = req.params;
      const replyData = insertForumReplySchema.parse(req.body);
      const user = req.user as User;
      
      const reply = await storage.createForumReply({
        ...replyData,
        threadId,
        authorId: user.id,
      });
      
      res.json({ success: true, reply });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        console.error("Error creating forum reply:", error);
        res.status(500).json({ error: "Failed to create reply" });
      }
    }
  });

  // Admin routes
  app.use('/api/admin', adminRoutes);

  const httpServer = createServer(app);
  return httpServer;
}

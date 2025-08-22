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
  insertPageContentSchema,
  updatePageContentSchema,
  insertTrustDownloadSchema,
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

  // Admin contact messages endpoint
  app.get("/api/admin/contacts", requireAuth, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
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

  // Page Content Management (Admin only)
  app.get("/api/admin/page-content", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      if (user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const content = await storage.getAllPageContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching page content:", error);
      res.status(500).json({ error: "Failed to fetch page content" });
    }
  });

  app.post("/api/admin/page-content", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      if (user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const contentData = insertPageContentSchema.parse(req.body);
      const content = await storage.upsertPageContent({
        ...contentData,
        updatedById: user.id,
      });
      
      res.json({ success: true, content });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        console.error("Error creating page content:", error);
        res.status(500).json({ error: "Failed to create page content" });
      }
    }
  });

  app.patch("/api/admin/page-content/:id", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      if (user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const { id } = req.params;
      const updateData = updatePageContentSchema.parse(req.body);
      const content = await storage.updatePageContent(id, {
        ...updateData,
        updatedById: user.id,
      });
      
      res.json({ success: true, content });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        console.error("Error updating page content:", error);
        res.status(500).json({ error: "Failed to update page content" });
      }
    }
  });

  app.delete("/api/admin/page-content/:id", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      if (user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const { id } = req.params;
      await storage.deletePageContent(id);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting page content:", error);
      res.status(500).json({ error: "Failed to delete page content" });
    }
  });

  // Trust Document Download Endpoints
  app.post("/api/trust-download-signup", async (req, res) => {
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
        console.error("Error processing trust download signup:", error);
        res.status(500).json({ error: "Failed to process signup" });
      }
    }
  });

  app.post("/api/track-download", async (req, res) => {
    try {
      const { documentType } = req.body;
      // Track download analytics if needed
      console.log(`Document downloaded: ${documentType} from IP: ${req.ip}`);
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking download:", error);
      res.status(500).json({ error: "Failed to track download" });
    }
  });

  // Serve the trust document PDF
  app.get("/api/trust-document-pdf", (req, res) => {
    // For now, redirect to a sample PDF or serve a placeholder
    // In production, this would serve the actual trust document
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="new-covenant-trust-document.pdf"');
    
    // Create a simple PDF placeholder response
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 24 Tf
100 700 Td
(New Covenant Trust Document) Tj
0 -50 Td
/F1 12 Tf
(This is a placeholder for the actual trust document.) Tj
0 -20 Td
(The complete biblical foundation and implementation) Tj
0 -20 Td
(guide will be available here.) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000062 00000 n 
0000000118 00000 n 
0000000266 00000 n 
0000000516 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
585
%%EOF`;
    
    res.send(Buffer.from(pdfContent));
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
      console.error("Error fetching trust downloads:", error);
      res.status(500).json({ error: "Failed to fetch trust downloads" });
    }
  });

  // Admin routes
  app.use('/api/admin', adminRoutes);

  const httpServer = createServer(app);
  return httpServer;
}

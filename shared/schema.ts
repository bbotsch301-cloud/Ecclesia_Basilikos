import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define user roles enum
export const userRoleEnum = pgEnum('user_role', ['student', 'instructor', 'moderator', 'admin']);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").unique(), // Optional username for forum display
  role: userRoleEnum("role").default('student'),
  isActive: boolean("is_active").default(true),
  isEmailVerified: boolean("is_email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationExpires: timestamp("email_verification_expires"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const newsletter_subscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  subscribed_at: timestamp("subscribed_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  level: text("level").notNull(), // beginner, intermediate, advanced
  duration: text("duration"), // e.g., "4 weeks", "8 hours"
  price: integer("price").default(0), // in cents, 0 for free
  imageUrl: text("image_url"),
  isPublished: boolean("is_published").default(false),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Videos table for standalone videos and teachings
export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url"), // Made optional for future video uploads
  embedUrl: text("embed_url"), // For YouTube, Vimeo, etc.
  thumbnailUrl: text("thumbnail_url"),
  category: text("category").notNull(),
  tags: text("tags"), // comma-separated tags
  duration: text("duration"), // e.g., "45 minutes"
  isPublished: boolean("is_published").default(false),
  isFeatured: boolean("is_featured").default(false),
  viewCount: integer("view_count").default(0),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course sections/modules for the New Covenant Trust course
export const courseSections = pgTable("course_sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  sectionOrder: integer("section_order").notNull(),
  videoId: varchar("video_id").references(() => videos.id),
  duration: text("duration").notNull(), // e.g., "5 min", "8 min"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Video attachments (PDFs, documents, etc.)
export const videoAttachments = pgTable("video_attachments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  videoId: varchar("video_id").notNull().references(() => videos.id),
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"), // in bytes
  fileType: text("file_type").notNull(), // pdf, docx, etc.
  downloadCount: integer("download_count").default(0),
  isPublic: boolean("is_public").default(false), // whether accessible without auth
  createdAt: timestamp("created_at").defaultNow(),
});

// Video progress tracking
export const videoProgress = pgTable("video_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  videoId: varchar("video_id").notNull().references(() => videos.id),
  watchedDuration: integer("watched_duration").default(0), // in seconds
  totalDuration: integer("total_duration"), // in seconds
  isCompleted: boolean("is_completed").default(false),
  lastWatchedAt: timestamp("last_watched_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Course section progress
export const sectionProgress = pgTable("section_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sectionId: varchar("section_id").notNull().references(() => courseSections.id),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Resources table for downloadable content
export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(), // pdf, audio, image, etc.
  fileSize: integer("file_size"), // in bytes
  isPublished: boolean("is_published").default(false),
  downloadCount: integer("download_count").default(0),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"), // lesson content/notes
  videoUrl: text("video_url"),
  order: integer("order").notNull().default(0),
  duration: text("duration"), // e.g., "30 minutes"
  createdAt: timestamp("created_at").defaultNow(),
});

export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  progress: integer("progress").default(0), // percentage 0-100
});

export const lesson_progress = pgTable("lesson_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  lessonId: varchar("lesson_id").notNull().references(() => lessons.id),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
});

export const downloads = pgTable("downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(), // pdf, doc, etc
  category: text("category").notNull(),
  isPublic: boolean("is_public").default(false), // true for public, false for enrolled students only
  courseId: varchar("course_id").references(() => courses.id), // optional, if tied to specific course
  createdAt: timestamp("created_at").defaultNow(),
});

// Page content management
export const page_content = pgTable("page_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageName: text("page_name").notNull(), // 'about', 'home', 'education', etc.
  contentKey: text("content_key").notNull(), // 'hero_background', 'main_image', etc.
  contentValue: text("content_value").notNull(), // URL or text content
  contentType: text("content_type").notNull(), // 'image', 'text', 'html'
  description: text("description"), // human-readable description
  updatedById: varchar("updated_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forum_categories = pgTable("forum_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("#3B82F6"), // hex color for category badge
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forum_threads = pgTable("forum_threads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  categoryId: varchar("category_id").notNull().references(() => forum_categories.id),
  authorId: varchar("author_id").notNull().references(() => users.id),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  viewCount: integer("view_count").default(0),
  replyCount: integer("reply_count").default(0),
  lastReplyAt: timestamp("last_reply_at"),
  lastReplyUserId: varchar("last_reply_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forum_replies = pgTable("forum_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  threadId: varchar("thread_id").notNull().references(() => forum_threads.id),
  authorId: varchar("author_id").notNull().references(() => users.id),
  parentReplyId: varchar("parent_reply_id"), // for nested replies - self-reference added separately
  isEdited: boolean("is_edited").default(false),
  editedAt: timestamp("edited_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forum_likes = pgTable("forum_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  threadId: varchar("thread_id").references(() => forum_threads.id),
  replyId: varchar("reply_id").references(() => forum_replies.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin audit log table
export const admin_audit_log = pgTable("admin_audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull().references(() => users.id),
  action: text("action").notNull(), // CREATE, UPDATE, DELETE, PUBLISH, UNPUBLISH
  entityType: text("entity_type").notNull(), // USER, COURSE, VIDEO, RESOURCE, etc.
  entityId: varchar("entity_id").notNull(),
  oldData: text("old_data"), // JSON string of previous state
  newData: text("new_data"), // JSON string of new state
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const userRelations = relations(users, ({ many }) => ({
  courses: many(courses),
  videos: many(videos),
  resources: many(resources),
  enrollments: many(enrollments),
  lessonProgress: many(lesson_progress),
  forumThreads: many(forum_threads),
  forumReplies: many(forum_replies),
  forumLikes: many(forum_likes),
  auditLogs: many(admin_audit_log),
  videoProgress: many(videoProgress),
  sectionProgress: many(sectionProgress),
}));

export const courseRelations = relations(courses, ({ one, many }) => ({
  creator: one(users, {
    fields: [courses.createdById],
    references: [users.id],
  }),
  lessons: many(lessons),
  enrollments: many(enrollments),
  downloads: many(downloads),
  sections: many(courseSections),
}));

export const videoRelations = relations(videos, ({ one, many }) => ({
  creator: one(users, {
    fields: [videos.createdById],
    references: [users.id],
  }),
  attachments: many(videoAttachments),
  progress: many(videoProgress),
  sections: many(courseSections),
}));

export const courseSectionRelations = relations(courseSections, ({ one }) => ({
  course: one(courses, {
    fields: [courseSections.courseId],
    references: [courses.id],
  }),
  video: one(videos, {
    fields: [courseSections.videoId],
    references: [videos.id],
  }),
}));

export const videoAttachmentRelations = relations(videoAttachments, ({ one }) => ({
  video: one(videos, {
    fields: [videoAttachments.videoId],
    references: [videos.id],
  }),
}));

export const videoProgressRelations = relations(videoProgress, ({ one }) => ({
  user: one(users, {
    fields: [videoProgress.userId],
    references: [users.id],
  }),
  video: one(videos, {
    fields: [videoProgress.videoId],
    references: [videos.id],
  }),
}));

export const sectionProgressRelations = relations(sectionProgress, ({ one }) => ({
  user: one(users, {
    fields: [sectionProgress.userId],
    references: [users.id],
  }),
  section: one(courseSections, {
    fields: [sectionProgress.sectionId],
    references: [courseSections.id],
  }),
}));



export const resourceRelations = relations(resources, ({ one }) => ({
  creator: one(users, {
    fields: [resources.createdById],
    references: [users.id],
  }),
}));

export const lessonRelations = relations(lessons, ({ one, many }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  progress: many(lesson_progress),
}));

export const forumCategoryRelations = relations(forum_categories, ({ many }) => ({
  threads: many(forum_threads),
}));

export const forumThreadRelations = relations(forum_threads, ({ one, many }) => ({
  category: one(forum_categories, {
    fields: [forum_threads.categoryId],
    references: [forum_categories.id],
  }),
  author: one(users, {
    fields: [forum_threads.authorId],
    references: [users.id],
  }),
  lastReplyUser: one(users, {
    fields: [forum_threads.lastReplyUserId],
    references: [users.id],
  }),
  replies: many(forum_replies),
  likes: many(forum_likes),
}));

export const forumReplyRelations = relations(forum_replies, ({ one, many }) => ({
  thread: one(forum_threads, {
    fields: [forum_replies.threadId],
    references: [forum_threads.id],
  }),
  author: one(users, {
    fields: [forum_replies.authorId],
    references: [users.id],
  }),
  likes: many(forum_likes),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isActive: true,
  createdAt: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  created_at: true,
});

export const insertNewsletterSchema = createInsertSchema(newsletter_subscribers).omit({
  id: true,
  subscribed_at: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
  completedAt: true,
  progress: true,
});

export const insertDownloadSchema = createInsertSchema(downloads).omit({
  id: true,
  createdAt: true,
});

export const insertForumCategorySchema = createInsertSchema(forum_categories).omit({
  id: true,
  createdAt: true,
});

export const insertForumThreadSchema = createInsertSchema(forum_threads).omit({
  id: true,
  viewCount: true,
  replyCount: true,
  lastReplyAt: true,
  lastReplyUserId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumReplySchema = createInsertSchema(forum_replies).omit({
  id: true,
  isEdited: true,
  editedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumLikeSchema = createInsertSchema(forum_likes).omit({
  id: true,
  createdAt: true,
});

// Admin-specific schemas
// Video management schemas
export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseSectionSchema = createInsertSchema(courseSections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVideoAttachmentSchema = createInsertSchema(videoAttachments).omit({
  id: true,
  downloadCount: true,
  createdAt: true,
});

export const insertVideoProgressSchema = createInsertSchema(videoProgress).omit({
  id: true,
  lastWatchedAt: true,
  createdAt: true,
});

export const insertSectionProgressSchema = createInsertSchema(sectionProgress).omit({
  id: true,
  completedAt: true,
  createdAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  downloadCount: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(['student', 'instructor', 'moderator', 'admin']),
});

export const adminAuditLogSchema = createInsertSchema(admin_audit_log).omit({
  id: true,
  createdAt: true,
});

export const insertPageContentSchema = createInsertSchema(page_content).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePageContentSchema = z.object({
  contentValue: z.string(),
  description: z.string().optional(),
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginUser = z.infer<typeof loginSchema>;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type Newsletter = typeof newsletter_subscribers.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type Download = typeof downloads.$inferSelect;

export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;
export type ForumCategory = typeof forum_categories.$inferSelect;

export type InsertForumThread = z.infer<typeof insertForumThreadSchema>;
export type ForumThread = typeof forum_threads.$inferSelect;

export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type ForumReply = typeof forum_replies.$inferSelect;

export type InsertForumLike = z.infer<typeof insertForumLikeSchema>;
export type ForumLike = typeof forum_likes.$inferSelect;

// Admin-specific types
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export type UpdateUserRole = z.infer<typeof updateUserRoleSchema>;
export type AdminAuditLog = typeof admin_audit_log.$inferSelect;

export type InsertPageContent = z.infer<typeof insertPageContentSchema>;
export type PageContent = typeof page_content.$inferSelect;
export type UpdatePageContent = z.infer<typeof updatePageContentSchema>;

// Trust document downloads table
export const trustDownloads = pgTable("trust_downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  downloadedAt: timestamp("downloaded_at").defaultNow(),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
});

export const insertTrustDownloadSchema = createInsertSchema(trustDownloads);
export type InsertTrustDownload = z.infer<typeof insertTrustDownloadSchema>;
export type TrustDownload = typeof trustDownloads.$inferSelect;

// Video management types
export type InsertCourseSection = z.infer<typeof insertCourseSectionSchema>;
export type CourseSection = typeof courseSections.$inferSelect;

export type InsertVideoAttachment = z.infer<typeof insertVideoAttachmentSchema>;
export type VideoAttachment = typeof videoAttachments.$inferSelect;

export type InsertVideoProgress = z.infer<typeof insertVideoProgressSchema>;
export type VideoProgress = typeof videoProgress.$inferSelect;

export type InsertSectionProgress = z.infer<typeof insertSectionProgressSchema>;
export type SectionProgress = typeof sectionProgress.$inferSelect;

import {
  type User,
  type InsertUser,
  type LoginUser,
  type Contact,
  type InsertContact,
  type Newsletter,
  type InsertNewsletter,
  type Course,
  type InsertCourse,
  type Lesson,
  type InsertLesson,
  type Enrollment,
  type InsertEnrollment,
  type Download,
  type InsertDownload,
  type ForumCategory,
  type InsertForumCategory,
  type ForumThread,
  type InsertForumThread,
  type ForumReply,
  type InsertForumReply,
  type ForumLike,
  type InsertForumLike,
  type Video,
  type InsertVideo,
  type Resource,
  type InsertResource,
  type UpdateUserRole,
  type AdminAuditLog,
  type PageContent,
  type InsertPageContent,
  type UpdatePageContent,
  type TrustDownload,
  type InsertTrustDownload,
  type CourseSection,
  type InsertCourseSection,
  type VideoAttachment,
  type InsertVideoAttachment,
  type VideoProgress,
  type InsertVideoProgress,
  type SectionProgress,
  type InsertSectionProgress,
  type DictionaryEntry,
  type InsertDictionaryEntry,
  users,
  contacts,
  newsletter_subscribers,
  courses,
  lessons,
  enrollments,
  downloads,
  lesson_progress,
  forum_categories,
  forum_threads,
  forum_replies,
  forum_likes,
  videos,
  resources,
  admin_audit_log,
  page_content,
  trustDownloads,
  courseSections,
  videoAttachments,
  videoProgress,
  sectionProgress,
  dictionaryEntries
} from "@shared/schema";
import { eq, and, desc, sql, or, inArray } from "drizzle-orm";
import { db } from "./db";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(userId: string, updates: Partial<InsertUser>): Promise<User>;
  verifyUserEmail(userId: string): Promise<User>;
  validateUser(email: string, password: string): Promise<User | null>;
  
  // Contact & Newsletter
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  createNewsletterSubscriber(subscriber: InsertNewsletter): Promise<Newsletter>;
  getNewsletterSubscriber(email: string): Promise<Newsletter | undefined>;
  
  // Course management
  getCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  getCourseLessons(courseId: string): Promise<Lesson[]>;
  
  // Enrollment management
  enrollUser(userId: string, courseId: string): Promise<Enrollment>;
  getUserEnrollments(userId: string): Promise<(Enrollment & { course: Course })[]>;
  isUserEnrolled(userId: string, courseId: string): Promise<boolean>;
  
  // Downloads
  getPublicDownloads(): Promise<Download[]>;
  getPublishedDownloads(): Promise<Download[]>;
  getCourseDownloads(courseId: string): Promise<Download[]>;
  getUserDownloads(userId: string): Promise<Download[]>;
  getAllDownloads(): Promise<Download[]>;
  getDownload(id: string): Promise<Download | undefined>;
  createDownload(download: InsertDownload): Promise<Download>;
  updateDownload(id: string, download: Partial<InsertDownload>): Promise<Download>;
  deleteDownload(id: string): Promise<void>;
  incrementDownloadCount(id: string): Promise<Download>;
  toggleDownloadPublished(id: string): Promise<Download>;
  
  // Admin: User Management
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: string, role: string): Promise<User>;
  toggleUserActive(userId: string): Promise<User>;
  deleteUser(userId: string): Promise<void>;
  
  // Admin: Content Management
  createVideo(video: InsertVideo): Promise<Video>;
  getAllVideos(): Promise<Video[]>;
  updateVideo(id: string, video: Partial<InsertVideo>): Promise<Video>;
  toggleVideoPublished(id: string): Promise<Video>;
  deleteVideo(id: string): Promise<void>;
  
  createResource(resource: InsertResource): Promise<Resource>;
  getAllResources(): Promise<Resource[]>;
  updateResource(id: string, resource: Partial<InsertResource>): Promise<Resource>;
  toggleResourcePublished(id: string): Promise<Resource>;
  deleteResource(id: string): Promise<void>;
  
  // Admin: Course Management
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course>;
  toggleCoursePublished(id: string): Promise<Course>;
  deleteCourse(id: string): Promise<void>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: string, lesson: Partial<InsertLesson>): Promise<Lesson>;
  deleteLesson(id: string): Promise<void>;

  // Video Management
  createCourseSection(section: InsertCourseSection): Promise<CourseSection>;
  getCourseSections(courseId: string): Promise<CourseSection[]>;
  updateCourseSection(id: string, section: Partial<InsertCourseSection>): Promise<CourseSection>;
  deleteCourseSection(id: string): Promise<void>;
  
  // Video Attachments
  createVideoAttachment(attachment: InsertVideoAttachment): Promise<VideoAttachment>;
  getVideoAttachments(videoId: string): Promise<VideoAttachment[]>;
  deleteVideoAttachment(id: string): Promise<void>;
  
  // Progress Tracking
  getUserVideoProgress(userId: string, videoId: string): Promise<VideoProgress | undefined>;
  updateVideoProgress(userId: string, videoId: string, progress: Partial<InsertVideoProgress>): Promise<VideoProgress>;
  getUserSectionProgress(userId: string, sectionId: string): Promise<SectionProgress | undefined>;
  completeSectionForUser(userId: string, sectionId: string): Promise<SectionProgress>;
  getCourseProgressForUser(userId: string, courseId: string): Promise<{ totalSections: number; completedSections: number }>;
  
  // Admin: Forum Management
  createForumCategory(category: InsertForumCategory): Promise<ForumCategory>;
  updateForumCategory(id: string, category: Partial<InsertForumCategory>): Promise<ForumCategory>;
  deleteForumCategory(id: string): Promise<void>;
  toggleThreadPinned(id: string): Promise<ForumThread>;
  toggleThreadLocked(id: string): Promise<ForumThread>;
  deleteForumThread(id: string): Promise<void>;
  deleteForumReply(id: string): Promise<void>;
  
  // Admin: Analytics & Monitoring
  getSystemStats(): Promise<{
    totalUsers: number;
    totalCourses: number;
    totalVideos: number;
    totalResources: number;
    totalEnrollments: number;
    totalForumThreads: number;
    totalForumReplies: number;
  }>;
  getRecentActivity(): Promise<AdminAuditLog[]>;
  createAuditLog(log: Omit<AdminAuditLog, 'id' | 'createdAt'>): Promise<AdminAuditLog>;
  
  // Admin: Page Content Management
  getAllPageContent(): Promise<PageContent[]>;
  getPageContent(pageName: string): Promise<PageContent[]>;
  getPageContentById(id: string): Promise<PageContent | undefined>;
  upsertPageContent(content: InsertPageContent): Promise<PageContent>;
  updatePageContent(id: string, updates: UpdatePageContent & { updatedById: string }): Promise<PageContent>;
  deletePageContent(id: string): Promise<void>;

  // Trust Document Downloads
  createTrustDownload(download: InsertTrustDownload): Promise<TrustDownload>;
  getTrustDownloadByEmail(email: string): Promise<TrustDownload | undefined>;
  getAllTrustDownloads(): Promise<TrustDownload[]>;

  // Dictionary
  searchDictionary(query: string, limit?: number): Promise<DictionaryEntry[]>;
  getDictionaryEntry(id: string): Promise<DictionaryEntry | undefined>;
  getDictionaryStats(): Promise<{ totalEntries: number; letters: string[] }>;
  getAllDictionaryTerms(): Promise<Pick<DictionaryEntry, 'id' | 'term' | 'termLower' | 'letter'>[]>;
  getDictionaryBatch(offset: number, limit: number): Promise<DictionaryEntry[]>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.emailVerificationToken, token));
    return user;
  }

  async updateUser(userId: string, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async verifyUserEmail(userId: string): Promise<User> {
    const [user] = await db.update(users)
      .set({ 
        isEmailVerified: true,
        isActive: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const verificationToken = randomUUID();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const [user] = await db
      .insert(users)
      .values({ 
        ...insertUser,
        password: hashedPassword,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
        isActive: true
      })
      .returning();
    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Contact & Newsletter
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.created_at));
  }

  async createNewsletterSubscriber(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const [subscriber] = await db
      .insert(newsletter_subscribers)
      .values(insertNewsletter)
      .returning();
    return subscriber;
  }

  async getNewsletterSubscriber(email: string): Promise<Newsletter | undefined> {
    const [subscriber] = await db
      .select()
      .from(newsletter_subscribers)
      .where(eq(newsletter_subscribers.email, email));
    return subscriber;
  }

  // Course management
  async getCourses(): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.isPublished, true));
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db
      .select()
      .from(courses)
      .where(and(eq(courses.id, id), eq(courses.isPublished, true)));
    return course;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db
      .insert(courses)
      .values(insertCourse)
      .returning();
    return course;
  }

  async getCourseLessons(courseId: string): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(lessons.order);
  }

  // Enrollment management
  async enrollUser(userId: string, courseId: string): Promise<Enrollment> {
    const [enrollment] = await db
      .insert(enrollments)
      .values({ userId, courseId })
      .returning();
    return enrollment;
  }

  async getUserEnrollments(userId: string): Promise<(Enrollment & { course: Course })[]> {
    return await db
      .select({
        id: enrollments.id,
        userId: enrollments.userId,
        courseId: enrollments.courseId,
        enrolledAt: enrollments.enrolledAt,
        completedAt: enrollments.completedAt,
        progress: enrollments.progress,
        course: courses
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId));
  }

  async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return !!enrollment;
  }

  // Downloads
  async getPublicDownloads(): Promise<Download[]> {
    return await db
      .select()
      .from(downloads)
      .where(eq(downloads.isPublic, true));
  }

  async getPublishedDownloads(): Promise<Download[]> {
    return await db
      .select()
      .from(downloads)
      .where(eq(downloads.isPublished, true))
      .orderBy(desc(downloads.createdAt));
  }

  async getAllDownloads(): Promise<Download[]> {
    return await db
      .select()
      .from(downloads)
      .orderBy(desc(downloads.createdAt));
  }

  async getDownload(id: string): Promise<Download | undefined> {
    const [download] = await db.select().from(downloads).where(eq(downloads.id, id));
    return download;
  }

  async createDownload(download: InsertDownload): Promise<Download> {
    const [newDownload] = await db.insert(downloads).values(download).returning();
    return newDownload;
  }

  async updateDownload(id: string, updates: Partial<InsertDownload>): Promise<Download> {
    const [updated] = await db
      .update(downloads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(downloads.id, id))
      .returning();
    return updated;
  }

  async deleteDownload(id: string): Promise<void> {
    await db.delete(downloads).where(eq(downloads.id, id));
  }

  async incrementDownloadCount(id: string): Promise<Download> {
    const [updated] = await db
      .update(downloads)
      .set({ downloadCount: sql`${downloads.downloadCount} + 1` })
      .where(eq(downloads.id, id))
      .returning();
    return updated;
  }

  async toggleDownloadPublished(id: string): Promise<Download> {
    const download = await this.getDownload(id);
    if (!download) throw new Error("Download not found");
    const [updated] = await db
      .update(downloads)
      .set({ isPublished: !download.isPublished, updatedAt: new Date() })
      .where(eq(downloads.id, id))
      .returning();
    return updated;
  }

  async getCourseDownloads(courseId: string): Promise<Download[]> {
    return await db
      .select()
      .from(downloads)
      .where(eq(downloads.courseId, courseId));
  }

  async getUserDownloads(userId: string): Promise<Download[]> {
    // Get downloads from enrolled courses + public downloads
    const userEnrollments = await this.getUserEnrollments(userId);
    const courseIds = userEnrollments.map(e => e.courseId);

    if (courseIds.length === 0) {
      return await this.getPublicDownloads();
    }

    return await db
      .select()
      .from(downloads)
      .where(
        or(
          eq(downloads.isPublic, true),
          inArray(downloads.courseId, courseIds)
        )
      )
      .orderBy(desc(downloads.createdAt));
  }

  // Forum Categories
  async getForumCategories(): Promise<ForumCategory[]> {
    return await db.select().from(forum_categories).where(eq(forum_categories.isActive, true)).orderBy(forum_categories.order, forum_categories.name);
  }

  async createForumCategory(category: InsertForumCategory): Promise<ForumCategory> {
    const [newCategory] = await db.insert(forum_categories).values(category).returning();
    return newCategory;
  }

  // Forum Threads
  async getForumThreadsByCategory(categoryId: string): Promise<Array<ForumThread & { author: User; category: ForumCategory; lastReplyUser?: User }>> {
    const threads = await db
      .select({
        thread: forum_threads,
        author: users,
        category: forum_categories,
        lastReplyUser: {
          id: sql<string>`last_user.id`,
          username: sql<string>`last_user.username`,
          email: sql<string>`last_user.email`,
          createdAt: sql<Date>`last_user.created_at`,
        }
      })
      .from(forum_threads)
      .innerJoin(users, eq(forum_threads.authorId, users.id))
      .innerJoin(forum_categories, eq(forum_threads.categoryId, forum_categories.id))
      .leftJoin(sql`users as last_user`, sql`${forum_threads.lastReplyUserId} = last_user.id`)
      .where(eq(forum_threads.categoryId, categoryId))
      .orderBy(desc(forum_threads.isPinned), desc(forum_threads.lastReplyAt), desc(forum_threads.createdAt));

    return threads.map(t => ({
      ...t.thread,
      author: t.author,
      category: t.category,
      lastReplyUser: t.lastReplyUser.id ? t.lastReplyUser as User : undefined
    }));
  }

  async getForumThreadById(id: string): Promise<(ForumThread & { author: User; category: ForumCategory }) | undefined> {
    const [thread] = await db
      .select({
        thread: forum_threads,
        author: users,
        category: forum_categories,
      })
      .from(forum_threads)
      .innerJoin(users, eq(forum_threads.authorId, users.id))
      .innerJoin(forum_categories, eq(forum_threads.categoryId, forum_categories.id))
      .where(eq(forum_threads.id, id));

    if (!thread) return undefined;

    return {
      ...thread.thread,
      author: thread.author,
      category: thread.category,
    };
  }

  async createForumThread(thread: InsertForumThread): Promise<ForumThread> {
    const [newThread] = await db.insert(forum_threads).values({
      ...thread,
      lastReplyAt: new Date(),
    }).returning();
    return newThread;
  }

  async incrementThreadViews(threadId: string): Promise<void> {
    await db.update(forum_threads)
      .set({ viewCount: sql`${forum_threads.viewCount} + 1` })
      .where(eq(forum_threads.id, threadId));
  }

  // Forum Replies
  async getForumRepliesByThread(threadId: string): Promise<Array<ForumReply & { author: User }>> {
    const replies = await db
      .select({
        reply: forum_replies,
        author: users,
      })
      .from(forum_replies)
      .innerJoin(users, eq(forum_replies.authorId, users.id))
      .where(eq(forum_replies.threadId, threadId))
      .orderBy(forum_replies.createdAt);

    return replies.map(r => ({
      ...r.reply,
      author: r.author,
    }));
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const [newReply] = await db.insert(forum_replies).values(reply).returning();
    
    // Update thread reply count and last reply info
    await db.update(forum_threads)
      .set({
        replyCount: sql`${forum_threads.replyCount} + 1`,
        lastReplyAt: new Date(),
        lastReplyUserId: reply.authorId,
      })
      .where(eq(forum_threads.id, reply.threadId));

    return newReply;
  }

  // Admin: User Management
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const [user] = await db.update(users)
      .set({ role: role as any, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async toggleUserActive(userId: string): Promise<User> {
    const [user] = await db.update(users)
      .set({ 
        isActive: sql`NOT ${users.isActive}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    await db.delete(users).where(eq(users.id, userId));
  }

  // Admin: Video Management
  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }

  async getAllVideos(): Promise<Video[]> {
    return await db.select().from(videos).orderBy(desc(videos.createdAt));
  }

  async updateVideo(id: string, video: Partial<InsertVideo>): Promise<Video> {
    const [updatedVideo] = await db.update(videos)
      .set({ ...video, updatedAt: new Date() })
      .where(eq(videos.id, id))
      .returning();
    return updatedVideo;
  }

  async toggleVideoPublished(id: string): Promise<Video> {
    const [video] = await db.update(videos)
      .set({ 
        isPublished: sql`NOT ${videos.isPublished}`,
        updatedAt: new Date()
      })
      .where(eq(videos.id, id))
      .returning();
    return video;
  }

  async deleteVideo(id: string): Promise<void> {
    await db.delete(videos).where(eq(videos.id, id));
  }

  // Admin: Resource Management
  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db.insert(resources).values(resource).returning();
    return newResource;
  }

  async getAllResources(): Promise<Resource[]> {
    return await db.select().from(resources).orderBy(desc(resources.createdAt));
  }

  async updateResource(id: string, resource: Partial<InsertResource>): Promise<Resource> {
    const [updatedResource] = await db.update(resources)
      .set({ ...resource, updatedAt: new Date() })
      .where(eq(resources.id, id))
      .returning();
    return updatedResource;
  }

  async toggleResourcePublished(id: string): Promise<Resource> {
    const [resource] = await db.update(resources)
      .set({ 
        isPublished: sql`NOT ${resources.isPublished}`,
        updatedAt: new Date()
      })
      .where(eq(resources.id, id))
      .returning();
    return resource;
  }

  async deleteResource(id: string): Promise<void> {
    await db.delete(resources).where(eq(resources.id, id));
  }

  // Admin: Course Management
  async updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course> {
    const [updatedCourse] = await db.update(courses)
      .set({ ...course, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async toggleCoursePublished(id: string): Promise<Course> {
    const [course] = await db.update(courses)
      .set({ 
        isPublished: sql`NOT ${courses.isPublished}`,
        updatedAt: new Date()
      })
      .where(eq(courses.id, id))
      .returning();
    return course;
  }

  async deleteCourse(id: string): Promise<void> {
    // Delete related lessons and enrollments first
    await db.delete(lesson_progress).where(
      sql`${lesson_progress.lessonId} IN (SELECT id FROM ${lessons} WHERE ${lessons.courseId} = ${id})`
    );
    await db.delete(lessons).where(eq(lessons.courseId, id));
    await db.delete(enrollments).where(eq(enrollments.courseId, id));
    await db.delete(courses).where(eq(courses.id, id));
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    return newLesson;
  }

  async updateLesson(id: string, lesson: Partial<InsertLesson>): Promise<Lesson> {
    const [updatedLesson] = await db.update(lessons)
      .set(lesson)
      .where(eq(lessons.id, id))
      .returning();
    return updatedLesson;
  }

  async deleteLesson(id: string): Promise<void> {
    await db.delete(lesson_progress).where(eq(lesson_progress.lessonId, id));
    await db.delete(lessons).where(eq(lessons.id, id));
  }

  // Admin: Forum Management
  async updateForumCategory(id: string, category: Partial<InsertForumCategory>): Promise<ForumCategory> {
    const [updatedCategory] = await db.update(forum_categories)
      .set(category)
      .where(eq(forum_categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteForumCategory(id: string): Promise<void> {
    // Delete all threads and replies in this category first
    const threadsInCategory = await db.select({ id: forum_threads.id })
      .from(forum_threads)
      .where(eq(forum_threads.categoryId, id));
    
    for (const thread of threadsInCategory) {
      await db.delete(forum_replies).where(eq(forum_replies.threadId, thread.id));
      await db.delete(forum_likes).where(eq(forum_likes.threadId, thread.id));
    }
    
    await db.delete(forum_threads).where(eq(forum_threads.categoryId, id));
    await db.delete(forum_categories).where(eq(forum_categories.id, id));
  }

  async toggleThreadPinned(id: string): Promise<ForumThread> {
    const [thread] = await db.update(forum_threads)
      .set({ 
        isPinned: sql`NOT ${forum_threads.isPinned}`,
        updatedAt: new Date()
      })
      .where(eq(forum_threads.id, id))
      .returning();
    return thread;
  }

  async toggleThreadLocked(id: string): Promise<ForumThread> {
    const [thread] = await db.update(forum_threads)
      .set({ 
        isLocked: sql`NOT ${forum_threads.isLocked}`,
        updatedAt: new Date()
      })
      .where(eq(forum_threads.id, id))
      .returning();
    return thread;
  }

  async deleteForumThread(id: string): Promise<void> {
    await db.delete(forum_replies).where(eq(forum_replies.threadId, id));
    await db.delete(forum_likes).where(eq(forum_likes.threadId, id));
    await db.delete(forum_threads).where(eq(forum_threads.id, id));
  }

  async deleteForumReply(id: string): Promise<void> {
    // Get the thread ID before deleting
    const [reply] = await db.select({ threadId: forum_replies.threadId })
      .from(forum_replies)
      .where(eq(forum_replies.id, id));
    
    await db.delete(forum_likes).where(eq(forum_likes.replyId, id));
    await db.delete(forum_replies).where(eq(forum_replies.id, id));
    
    // Update thread reply count
    if (reply) {
      await db.update(forum_threads)
        .set({ replyCount: sql`${forum_threads.replyCount} - 1` })
        .where(eq(forum_threads.id, reply.threadId));
    }
  }

  // Admin: Analytics & Monitoring
  async getSystemStats(): Promise<{
    totalUsers: number;
    totalCourses: number;
    totalVideos: number;
    totalResources: number;
    totalEnrollments: number;
    totalForumThreads: number;
    totalForumReplies: number;
  }> {
    const [stats] = await db.select({
      totalUsers: sql<number>`(SELECT COUNT(*) FROM ${users})`,
      totalCourses: sql<number>`(SELECT COUNT(*) FROM ${courses})`,
      totalVideos: sql<number>`(SELECT COUNT(*) FROM ${videos})`,
      totalResources: sql<number>`(SELECT COUNT(*) FROM ${resources})`,
      totalEnrollments: sql<number>`(SELECT COUNT(*) FROM ${enrollments})`,
      totalForumThreads: sql<number>`(SELECT COUNT(*) FROM ${forum_threads})`,
      totalForumReplies: sql<number>`(SELECT COUNT(*) FROM ${forum_replies})`,
    }).from(sql`(SELECT 1) as dummy`);
    
    return stats;
  }

  async getRecentActivity(): Promise<AdminAuditLog[]> {
    return await db.select().from(admin_audit_log)
      .orderBy(desc(admin_audit_log.createdAt))
      .limit(50);
  }

  async createAuditLog(log: Omit<AdminAuditLog, 'id' | 'createdAt'>): Promise<AdminAuditLog> {
    const [newLog] = await db.insert(admin_audit_log).values(log).returning();
    return newLog;
  }

  // Admin: Page Content Management
  async getAllPageContent(): Promise<PageContent[]> {
    return await db.select().from(page_content)
      .orderBy(page_content.pageName, page_content.contentKey);
  }

  async getPageContent(pageName: string): Promise<PageContent[]> {
    return await db.select().from(page_content)
      .where(eq(page_content.pageName, pageName))
      .orderBy(page_content.contentKey);
  }

  async getPageContentById(id: string): Promise<PageContent | undefined> {
    const [content] = await db.select().from(page_content)
      .where(eq(page_content.id, id));
    return content;
  }

  async upsertPageContent(content: InsertPageContent): Promise<PageContent> {
    // First try to find existing content by page + key
    const [existing] = await db.select().from(page_content)
      .where(
        and(
          eq(page_content.pageName, content.pageName),
          eq(page_content.contentKey, content.contentKey)
        )
      );

    if (existing) {
      // Update existing
      const [updated] = await db.update(page_content)
        .set({
          contentValue: content.contentValue,
          contentType: content.contentType,
          description: content.description,
          updatedById: content.updatedById,
          updatedAt: new Date()
        })
        .where(eq(page_content.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new
      const [newContent] = await db.insert(page_content)
        .values(content)
        .returning();
      return newContent;
    }
  }

  async updatePageContent(id: string, updates: UpdatePageContent & { updatedById: string }): Promise<PageContent> {
    const [updated] = await db.update(page_content)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(page_content.id, id))
      .returning();
    return updated;
  }

  async deletePageContent(id: string): Promise<void> {
    await db.delete(page_content).where(eq(page_content.id, id));
  }

  // Trust Document Downloads
  async createTrustDownload(downloadData: InsertTrustDownload): Promise<TrustDownload> {
    const [download] = await db.insert(trustDownloads)
      .values(downloadData)
      .returning();
    return download;
  }

  async getTrustDownloadByEmail(email: string): Promise<TrustDownload | undefined> {
    const [download] = await db.select().from(trustDownloads)
      .where(eq(trustDownloads.email, email));
    return download;
  }

  async getAllTrustDownloads(): Promise<TrustDownload[]> {
    return await db.select().from(trustDownloads)
      .orderBy(desc(trustDownloads.downloadedAt));
  }

  // Video Management Implementation
  async createCourseSection(section: InsertCourseSection): Promise<CourseSection> {
    const [newSection] = await db.insert(courseSections)
      .values(section)
      .returning();
    return newSection;
  }

  async getCourseSections(courseId: string): Promise<CourseSection[]> {
    return await db.select().from(courseSections)
      .where(eq(courseSections.courseId, courseId))
      .orderBy(courseSections.sectionOrder);
  }

  async updateCourseSection(id: string, section: Partial<InsertCourseSection>): Promise<CourseSection> {
    const [updated] = await db.update(courseSections)
      .set({ ...section, updatedAt: new Date() })
      .where(eq(courseSections.id, id))
      .returning();
    return updated;
  }

  async deleteCourseSection(id: string): Promise<void> {
    await db.delete(courseSections).where(eq(courseSections.id, id));
  }

  // Video Attachments
  async createVideoAttachment(attachment: InsertVideoAttachment): Promise<VideoAttachment> {
    const [newAttachment] = await db.insert(videoAttachments)
      .values(attachment)
      .returning();
    return newAttachment;
  }

  async getVideoAttachments(videoId: string): Promise<VideoAttachment[]> {
    return await db.select().from(videoAttachments)
      .where(eq(videoAttachments.videoId, videoId))
      .orderBy(videoAttachments.createdAt);
  }

  async deleteVideoAttachment(id: string): Promise<void> {
    await db.delete(videoAttachments).where(eq(videoAttachments.id, id));
  }

  // Progress Tracking
  async getUserVideoProgress(userId: string, videoId: string): Promise<VideoProgress | undefined> {
    const [progress] = await db.select().from(videoProgress)
      .where(and(
        eq(videoProgress.userId, userId),
        eq(videoProgress.videoId, videoId)
      ));
    return progress;
  }

  async updateVideoProgress(userId: string, videoId: string, progress: Partial<InsertVideoProgress>): Promise<VideoProgress> {
    // Check if progress record exists
    const existing = await this.getUserVideoProgress(userId, videoId);
    
    if (existing) {
      const [updated] = await db.update(videoProgress)
        .set({ ...progress, lastWatchedAt: new Date() })
        .where(and(
          eq(videoProgress.userId, userId),
          eq(videoProgress.videoId, videoId)
        ))
        .returning();
      return updated;
    } else {
      const [newProgress] = await db.insert(videoProgress)
        .values({
          userId,
          videoId,
          ...progress,
        })
        .returning();
      return newProgress;
    }
  }

  async getUserSectionProgress(userId: string, sectionId: string): Promise<SectionProgress | undefined> {
    const [progress] = await db.select().from(sectionProgress)
      .where(and(
        eq(sectionProgress.userId, userId),
        eq(sectionProgress.sectionId, sectionId)
      ));
    return progress;
  }

  async completeSectionForUser(userId: string, sectionId: string): Promise<SectionProgress> {
    // Check if progress record exists
    const existing = await this.getUserSectionProgress(userId, sectionId);
    
    if (existing) {
      const [updated] = await db.update(sectionProgress)
        .set({ 
          isCompleted: true, 
          completedAt: new Date() 
        })
        .where(and(
          eq(sectionProgress.userId, userId),
          eq(sectionProgress.sectionId, sectionId)
        ))
        .returning();
      return updated;
    } else {
      const [newProgress] = await db.insert(sectionProgress)
        .values({
          userId,
          sectionId,
          isCompleted: true,
          completedAt: new Date(),
        })
        .returning();
      return newProgress;
    }
  }

  async getCourseProgressForUser(userId: string, courseId: string): Promise<{ totalSections: number; completedSections: number }> {
    // Get total sections for course
    const totalSections = await db.select({ count: sql<number>`count(*)` })
      .from(courseSections)
      .where(eq(courseSections.courseId, courseId));

    // Get completed sections for user
    const completedSections = await db.select({ count: sql<number>`count(*)` })
      .from(sectionProgress)
      .innerJoin(courseSections, eq(sectionProgress.sectionId, courseSections.id))
      .where(and(
        eq(sectionProgress.userId, userId),
        eq(courseSections.courseId, courseId),
        eq(sectionProgress.isCompleted, true)
      ));

    return {
      totalSections: totalSections[0]?.count || 0,
      completedSections: completedSections[0]?.count || 0,
    };
  }
  // Dictionary
  async searchDictionary(query: string, limit: number = 20): Promise<DictionaryEntry[]> {
    const maxLimit = Math.min(limit, 50);
    const lowerQuery = query.toLowerCase().trim();

    if (lowerQuery.length < 2) return [];

    // Use a union approach: exact matches first, then prefix, then substring
    const results = await db.select().from(dictionaryEntries)
      .where(
        or(
          eq(dictionaryEntries.termLower, lowerQuery),
          sql`${dictionaryEntries.termLower} LIKE ${lowerQuery + '%'}`,
          sql`${dictionaryEntries.termLower} LIKE ${'%' + lowerQuery + '%'}`
        )
      )
      .orderBy(
        // Exact match first, then prefix, then substring
        sql`CASE
          WHEN ${dictionaryEntries.termLower} = ${lowerQuery} THEN 0
          WHEN ${dictionaryEntries.termLower} LIKE ${lowerQuery + '%'} THEN 1
          ELSE 2
        END`,
        sql`length(${dictionaryEntries.definition}) DESC`,
        dictionaryEntries.termLower
      )
      .limit(maxLimit);

    return results;
  }

  async getDictionaryEntry(id: string): Promise<DictionaryEntry | undefined> {
    const [entry] = await db.select().from(dictionaryEntries)
      .where(eq(dictionaryEntries.id, id));
    return entry;
  }

  async getDictionaryStats(): Promise<{ totalEntries: number; letters: string[] }> {
    const [countResult] = await db.select({
      count: sql<number>`count(*)`,
    }).from(dictionaryEntries);

    const letterResults = await db.selectDistinct({
      letter: dictionaryEntries.letter,
    }).from(dictionaryEntries)
      .orderBy(dictionaryEntries.letter);

    return {
      totalEntries: countResult?.count || 0,
      letters: letterResults.map(r => r.letter),
    };
  }

  async getAllDictionaryTerms(): Promise<Pick<DictionaryEntry, 'id' | 'term' | 'termLower' | 'letter'>[]> {
    return db.select({
      id: dictionaryEntries.id,
      term: dictionaryEntries.term,
      termLower: dictionaryEntries.termLower,
      letter: dictionaryEntries.letter,
    }).from(dictionaryEntries)
      .orderBy(dictionaryEntries.termLower);
  }

  async getDictionaryBatch(offset: number, limit: number): Promise<DictionaryEntry[]> {
    const maxLimit = Math.min(limit, 500);
    return db.select().from(dictionaryEntries)
      .orderBy(dictionaryEntries.termLower)
      .offset(offset)
      .limit(maxLimit);
  }
}

export const storage = new DatabaseStorage();

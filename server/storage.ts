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
  type Notification,
  type InsertNotification,
  type ThreadSubscription,
  type Comment,
  type InsertComment,
  type NewsletterCampaign,
  type InsertNewsletterCampaign,
  type UserDownload,
  type Subscription,
  type InsertSubscription,
  users,
  subscriptions,
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
  dictionaryEntries,
  notifications,
  threadSubscriptions,
  comments,
  newsletter_campaigns,
  userDownloads,
  proofs,
  type Proof,
  type InsertProof,
  beneficialUnits,
  trustEntities,
  trustRelationships,
  type TrustEntity,
  type InsertTrustEntity,
  type TrustRelationship,
  type InsertTrustRelationship,
} from "@shared/schema";
import { eq, and, desc, sql, or, inArray, ilike } from "drizzle-orm";
import { db } from "./db";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  getUserByPasswordResetToken(token: string): Promise<User | undefined>;
  getUserByStripeCustomerId(customerId: string): Promise<User | undefined>;
  createUser(user: Omit<InsertUser, 'pmaAgreementAccepted' | 'privacyAccepted'> & { termsAcceptedAt?: Date; pmaAgreementAcceptedAt?: Date }): Promise<User>;
  updateUser(userId: string, updates: Partial<InsertUser>): Promise<User>;
  setPasswordResetToken(userId: string, token: string, expires: Date): Promise<void>;
  resetPassword(userId: string, hashedPassword: string): Promise<void>;
  verifyUserEmail(userId: string): Promise<User>;
  validateUser(email: string, password: string): Promise<User | null>;
  issueBeneficialUnit(userId: string): Promise<any>;
  getBeneficialUnit(userId: string): Promise<any>;
  getTotalActiveBeneficiaries(): Promise<number>;
  withdrawBeneficialUnit(userId: string): Promise<void>;

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
  getLessonById(id: string): Promise<Lesson | undefined>;

  // Enrollment management
  enrollUser(userId: string, courseId: string): Promise<Enrollment>;
  getUserEnrollments(userId: string): Promise<(Enrollment & { course: Course })[]>;
  isUserEnrolled(userId: string, courseId: string): Promise<boolean>;
  completeEnrollment(userId: string, courseId: string): Promise<Enrollment>;
  
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
  trackUserDownload(userId: string, downloadId: string, ipAddress?: string): Promise<void>;
  getUserDownloadHistory(userId: string): Promise<any[]>;
  acceptTerms(userId: string): Promise<void>;

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
  reorderLessons(courseId: string, lessonIds: string[]): Promise<void>;
  duplicateLesson(lessonId: string): Promise<Lesson>;
  getCourseStats(courseId: string): Promise<{ enrollmentCount: number; completedCount: number; lessonStats: Array<{ lessonId: string; completedCount: number; totalStudents: number }> }>;
  getAuditLogForEntity(entityType: string, entityId: string): Promise<AdminAuditLog[]>;
  bulkDeleteLessons(lessonIds: string[]): Promise<void>;
  getCourseCategories(): Promise<string[]>;

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
  getCourseProgressForUser(userId: string, courseId: string): Promise<{ totalSections: number; completedSections: number; completedSectionIds: string[] }>;
  
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
    totalPremiumUsers: number;
    totalFreeUsers: number;
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

  // Public listings
  getPublishedVideos(): Promise<Video[]>;
  getPublishedResources(): Promise<Resource[]>;
  getRecentForumThreads(offset?: number, limit?: number): Promise<{ threads: Array<ForumThread & { author: User; category: ForumCategory }>; total: number }>;
  searchForumThreads(query: string): Promise<Array<ForumThread & { author: Pick<User, 'id' | 'firstName' | 'lastName' | 'username'>; category: ForumCategory }>>;
  getCoursesWithLessonCount(): Promise<(Course & { lessonCount: number })[]>;
  getAllCoursesWithLessonCount(): Promise<(Course & { lessonCount: number })[]>;

  // Forum: edit/delete helpers
  getForumReply(id: string): Promise<ForumReply | undefined>;
  updateForumThread(id: string, updates: { title?: string; content?: string }): Promise<ForumThread>;
  updateForumReply(id: string, updates: { content: string }): Promise<ForumReply>;

  // Newsletter: unsubscribe
  deleteNewsletterSubscriber(email: string): Promise<void>;

  // Dictionary
  searchDictionary(query: string, limit?: number): Promise<DictionaryEntry[]>;
  getDictionaryEntry(id: string): Promise<DictionaryEntry | undefined>;
  getDictionaryStats(): Promise<{ totalEntries: number; letters: string[] }>;
  getAllDictionaryTerms(): Promise<Pick<DictionaryEntry, 'id' | 'term' | 'termLower' | 'letter'>[]>;
  getDictionaryBatch(offset: number, limit: number): Promise<DictionaryEntry[]>;

  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotification(id: string): Promise<Notification | undefined>;
  getUserNotifications(userId: string, limit?: number): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<Notification>;
  markAllNotificationsRead(userId: string): Promise<void>;
  getUnreadNotificationCount(userId: string): Promise<number>;

  // Global search
  searchGlobal(query: string): Promise<{ courses: any[]; threads: any[]; downloads: any[] }>;

  // Forum likes
  likeThread(userId: string, threadId: string): Promise<void>;
  unlikeThread(userId: string, threadId: string): Promise<void>;
  likeReply(userId: string, replyId: string): Promise<void>;
  unlikeReply(userId: string, replyId: string): Promise<void>;
  getThreadLikeCounts(threadIds: string[]): Promise<Record<string, number>>;
  getReplyLikeCounts(replyIds: string[]): Promise<Record<string, number>>;
  getUserLikedThreadIds(userId: string, threadIds: string[]): Promise<Set<string>>;
  getUserLikedReplyIds(userId: string, replyIds: string[]): Promise<Set<string>>;
  getCategoryThreadCounts(): Promise<Record<string, number>>;

  // Thread subscriptions
  subscribeToThread(userId: string, threadId: string): Promise<ThreadSubscription>;
  unsubscribeFromThread(userId: string, threadId: string): Promise<void>;
  isSubscribedToThread(userId: string, threadId: string): Promise<boolean>;
  getThreadSubscribers(threadId: string): Promise<string[]>;

  // Public profile
  getPublicProfile(userId: string): Promise<{ user: any; threadCount: number; replyCount: number } | null>;

  // Dashboard
  getDashboardStats(userId: string): Promise<{
    coursesInProgress: number;
    coursesCompleted: number;
    availableCourses: number;
    forumPosts: number;
    videosWatched: number;
  }>;
  getRecentUserActivity(userId: string, limit?: number): Promise<any[]>;

  // Comments
  getCommentsByTarget(targetType: string, targetId: string): Promise<(Comment & { author: { id: string; firstName: string; lastName: string; username: string | null; role: string | null } })[]>;
  createComment(data: InsertComment): Promise<Comment>;
  getComment(id: string): Promise<Comment | undefined>;
  updateComment(id: string, data: { content: string }): Promise<Comment>;
  deleteComment(id: string): Promise<void>;

  // Newsletter Campaigns
  getAllNewsletterCampaigns(): Promise<NewsletterCampaign[]>;
  getNewsletterCampaign(id: string): Promise<NewsletterCampaign | undefined>;
  createNewsletterCampaign(data: InsertNewsletterCampaign): Promise<NewsletterCampaign>;
  updateNewsletterCampaign(id: string, data: Partial<InsertNewsletterCampaign>): Promise<NewsletterCampaign>;
  markNewsletterCampaignSent(id: string, recipientCount: number): Promise<NewsletterCampaign>;
  deleteNewsletterCampaign(id: string): Promise<void>;
  getAllNewsletterSubscribers(): Promise<Newsletter[]>;

  // Subscription management
  updateUserSubscription(userId: string, updates: Partial<{
    subscriptionTier: string;
    subscriptionStatus: string;
    subscriptionStartDate: Date;
    subscriptionEndDate: Date | null;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    premiumGrantedBy: string;
    premiumGrantedAt: Date;
  }>): Promise<User>;
  createSubscriptionRecord(data: InsertSubscription): Promise<Subscription>;
  getSubscriptionHistory(userId: string): Promise<Subscription[]>;
  getActiveSubscribers(): Promise<User[]>;
  getSubscriptionStats(): Promise<{ totalPremium: number; totalFree: number; recentSubscriptions: number }>;
  getAllSubscribers(search?: string): Promise<User[]>;
  getSubscriptionStatsWithChurn(): Promise<{ totalPremium: number; totalFree: number; recentSubscriptions: number; churnRate: number }>;
  adminUpdateSubscription(userId: string, updates: { status: string; plan: string; endDate: string | null }): Promise<User>;

  // GDPR data export helpers
  getUserForumThreads(userId: string): Promise<any[]>;
  getUserForumReplies(userId: string): Promise<any[]>;
  getUserComments(userId: string): Promise<any[]>;

  // GDPR account deletion
  deleteAllUserData(userId: string): Promise<void>;

  // Trust Structure
  getTrustEntities(): Promise<TrustEntity[]>;
  getTrustEntity(id: string): Promise<TrustEntity | undefined>;
  createTrustEntity(entity: InsertTrustEntity): Promise<TrustEntity>;
  updateTrustEntity(id: string, updates: Partial<InsertTrustEntity>): Promise<TrustEntity>;
  deleteTrustEntity(id: string): Promise<void>;
  getTrustRelationships(): Promise<TrustRelationship[]>;
  createTrustRelationship(rel: InsertTrustRelationship): Promise<TrustRelationship>;
  deleteTrustRelationship(id: string): Promise<void>;
  getTrustStructure(): Promise<{ entities: TrustEntity[]; relationships: TrustRelationship[] }>;
  seedTrustStructure(): Promise<void>;
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

  async getUserByPasswordResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.passwordResetToken, token));
    return user;
  }

  async getUserByStripeCustomerId(customerId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, customerId));
    return user;
  }

  async setPasswordResetToken(userId: string, token: string, expires: Date): Promise<void> {
    await db.update(users)
      .set({ passwordResetToken: token, passwordResetExpires: expires, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async resetPassword(userId: string, hashedPassword: string): Promise<void> {
    await db.update(users)
      .set({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
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

  async createUser(insertUser: Omit<InsertUser, 'pmaAgreementAccepted' | 'privacyAccepted'> & { termsAcceptedAt?: Date; pmaAgreementAcceptedAt?: Date }): Promise<User> {
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

  async issueBeneficialUnit(userId: string): Promise<any> {
    // Get next unit number
    const result = await db.select({ maxNum: sql<number>`COALESCE(MAX(${beneficialUnits.unitNumber}), 0)` }).from(beneficialUnits);
    const nextNumber = (result[0]?.maxNum || 0) + 1;

    const [unit] = await db
      .insert(beneficialUnits)
      .values({
        userId,
        unitNumber: nextNumber,
        status: 'active',
      })
      .returning();

    // Update user with unit reference
    await db.update(users).set({ beneficialUnitId: unit.id }).where(eq(users.id, userId));

    return unit;
  }

  async getBeneficialUnit(userId: string): Promise<any> {
    const [unit] = await db
      .select()
      .from(beneficialUnits)
      .where(eq(beneficialUnits.userId, userId));
    return unit || null;
  }

  async getTotalActiveBeneficiaries(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(beneficialUnits)
      .where(eq(beneficialUnits.status, 'active'));
    return Number(result[0]?.count || 0);
  }

  async withdrawBeneficialUnit(userId: string): Promise<void> {
    await db
      .update(beneficialUnits)
      .set({ status: 'withdrawn', withdrawnAt: new Date() })
      .where(eq(beneficialUnits.userId, userId));
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

  async getLessonById(id: string): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
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

  async completeEnrollment(userId: string, courseId: string): Promise<Enrollment> {
    const [updated] = await db
      .update(enrollments)
      .set({ completedAt: new Date(), progress: 100 })
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
      .returning();
    if (!updated) throw new Error("Enrollment not found");
    return updated;
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

  async trackUserDownload(userId: string, downloadId: string, ipAddress?: string): Promise<void> {
    await db
      .insert(userDownloads)
      .values({ userId, downloadId, ipAddress: ipAddress ?? null });
  }

  async getUserDownloadHistory(userId: string): Promise<any[]> {
    return await db
      .select({
        id: userDownloads.id,
        userId: userDownloads.userId,
        downloadId: userDownloads.downloadId,
        downloadedAt: userDownloads.downloadedAt,
        ipAddress: userDownloads.ipAddress,
        title: downloads.title,
        fileType: downloads.fileType,
        category: downloads.category,
      })
      .from(userDownloads)
      .innerJoin(downloads, eq(userDownloads.downloadId, downloads.id))
      .where(eq(userDownloads.userId, userId))
      .orderBy(desc(userDownloads.downloadedAt))
      .limit(100);
  }

  async acceptTerms(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ termsAcceptedAt: new Date() })
      .where(eq(users.id, userId));
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

  async getForumCategoryById(id: string): Promise<ForumCategory | undefined> {
    const [category] = await db.select().from(forum_categories).where(eq(forum_categories.id, id));
    return category;
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
    // Delete related lessons and enrollments in a transaction to ensure data integrity
    await db.transaction(async (tx) => {
      await tx.delete(lesson_progress).where(
        sql`${lesson_progress.lessonId} IN (SELECT id FROM ${lessons} WHERE ${lessons.courseId} = ${id})`
      );
      await tx.delete(lessons).where(eq(lessons.courseId, id));
      await tx.delete(enrollments).where(eq(enrollments.courseId, id));
      await tx.delete(courses).where(eq(courses.id, id));
    });
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

  async reorderLessons(courseId: string, lessonIds: string[]): Promise<void> {
    await Promise.all(
      lessonIds.map((id, i) =>
        db.update(lessons).set({ order: i + 1 }).where(and(eq(lessons.id, id), eq(lessons.courseId, courseId)))
      )
    );
  }

  async duplicateLesson(lessonId: string): Promise<Lesson> {
    const [original] = await db.select().from(lessons).where(eq(lessons.id, lessonId));
    if (!original) throw new Error("Lesson not found");
    const [newLesson] = await db.insert(lessons).values({
      courseId: original.courseId,
      title: `${original.title} (Copy)`,
      description: original.description,
      content: original.content,
      videoUrl: original.videoUrl,
      order: original.order + 1,
      duration: original.duration,
    }).returning();
    return newLesson;
  }

  async getCourseStats(courseId: string): Promise<{ enrollmentCount: number; completedCount: number; lessonStats: Array<{ lessonId: string; completedCount: number; totalStudents: number }> }> {
    const enrollmentRows = await db.select().from(enrollments).where(eq(enrollments.courseId, courseId));
    const enrollmentCount = enrollmentRows.length;
    const completedCount = enrollmentRows.filter(e => e.completedAt !== null).length;

    // Get lessons for this course
    const courseLessons = await db.select().from(lessons).where(eq(lessons.courseId, courseId));
    const lessonIds = courseLessons.map(l => l.id);

    // Get progress for these lessons
    const progressRows = lessonIds.length > 0
      ? await db.select().from(lesson_progress).where(inArray(lesson_progress.lessonId, lessonIds))
      : [];

    const lessonStats = courseLessons.map(l => ({
      lessonId: l.id,
      completedCount: progressRows.filter(p => p.lessonId === l.id && p.completed).length,
      totalStudents: enrollmentCount,
    }));

    return { enrollmentCount, completedCount, lessonStats };
  }

  async getAuditLogForEntity(entityType: string, entityId: string): Promise<AdminAuditLog[]> {
    return db.select().from(admin_audit_log)
      .where(and(eq(admin_audit_log.entityType, entityType), eq(admin_audit_log.entityId, entityId)))
      .orderBy(desc(admin_audit_log.createdAt))
      .limit(50);
  }

  async bulkDeleteLessons(lessonIds: string[]): Promise<void> {
    if (lessonIds.length === 0) return;
    await db.delete(lesson_progress).where(inArray(lesson_progress.lessonId, lessonIds));
    await db.delete(lessons).where(inArray(lessons.id, lessonIds));
  }

  async getCourseCategories(): Promise<string[]> {
    const rows = await db.selectDistinct({ category: courses.category }).from(courses).orderBy(courses.category);
    return rows.map(r => r.category);
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
    // Cascade deletes handle threads → replies → likes automatically
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
    // Cascade deletes handle replies → likes and thread subscriptions automatically
    await db.delete(forum_threads).where(eq(forum_threads.id, id));
  }

  async deleteForumReply(id: string): Promise<void> {
    // Get the thread ID before deleting so we can update the count
    const [reply] = await db.select({ threadId: forum_replies.threadId })
      .from(forum_replies)
      .where(eq(forum_replies.id, id));

    // Cascade deletes handle likes automatically
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
    totalPremiumUsers: number;
    totalFreeUsers: number;
  }> {
    const [stats] = await db.select({
      totalUsers: sql<number>`(SELECT COUNT(*) FROM ${users})`,
      totalCourses: sql<number>`(SELECT COUNT(*) FROM ${courses})`,
      totalVideos: sql<number>`(SELECT COUNT(*) FROM ${videos})`,
      totalResources: sql<number>`(SELECT COUNT(*) FROM ${resources})`,
      totalEnrollments: sql<number>`(SELECT COUNT(*) FROM ${enrollments})`,
      totalForumThreads: sql<number>`(SELECT COUNT(*) FROM ${forum_threads})`,
      totalForumReplies: sql<number>`(SELECT COUNT(*) FROM ${forum_replies})`,
      totalPremiumUsers: sql<number>`(SELECT COUNT(*) FROM ${users} WHERE subscription_tier = 'premium' AND subscription_status = 'active')`,
      totalFreeUsers: sql<number>`(SELECT COUNT(*) FROM ${users} WHERE subscription_tier = 'free' OR subscription_tier IS NULL)`,
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

  async getCourseProgressForUser(userId: string, courseId: string): Promise<{ totalSections: number; completedSections: number; completedSectionIds: string[] }> {
    // Get total sections for course
    const totalSections = await db.select({ count: sql<number>`count(*)` })
      .from(courseSections)
      .where(eq(courseSections.courseId, courseId));

    // Get completed sections for user (with IDs)
    const completedRows = await db.select({ sectionId: sectionProgress.sectionId })
      .from(sectionProgress)
      .innerJoin(courseSections, eq(sectionProgress.sectionId, courseSections.id))
      .where(and(
        eq(sectionProgress.userId, userId),
        eq(courseSections.courseId, courseId),
        eq(sectionProgress.isCompleted, true)
      ));

    const completedSectionIds = completedRows.map(r => r.sectionId);

    return {
      totalSections: totalSections[0]?.count || 0,
      completedSections: completedSectionIds.length,
      completedSectionIds,
    };
  }
  // Forum: edit/delete helpers
  async getForumReply(id: string): Promise<ForumReply | undefined> {
    const [reply] = await db.select().from(forum_replies).where(eq(forum_replies.id, id));
    return reply;
  }

  async updateForumThread(id: string, updates: { title?: string; content?: string }): Promise<ForumThread> {
    const [thread] = await db.update(forum_threads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(forum_threads.id, id))
      .returning();
    return thread;
  }

  async updateForumReply(id: string, updates: { content: string }): Promise<ForumReply> {
    const [reply] = await db.update(forum_replies)
      .set({ content: updates.content, isEdited: true, editedAt: new Date(), updatedAt: new Date() })
      .where(eq(forum_replies.id, id))
      .returning();
    return reply;
  }

  // Newsletter: unsubscribe
  async deleteNewsletterSubscriber(email: string): Promise<void> {
    await db.delete(newsletter_subscribers).where(eq(newsletter_subscribers.email, email));
  }

  // Public listings
  async getPublishedVideos(): Promise<Video[]> {
    return await db.select().from(videos)
      .where(eq(videos.isPublished, true))
      .orderBy(desc(videos.createdAt));
  }

  async getPublishedResources(): Promise<Resource[]> {
    return await db.select().from(resources)
      .where(eq(resources.isPublished, true))
      .orderBy(desc(resources.createdAt));
  }

  async getRecentForumThreads(offset = 0, limit = 20): Promise<{ threads: Array<ForumThread & { author: User; category: ForumCategory }>; total: number }> {
    const [totalResult, threads] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(forum_threads),
      db
        .select({
          thread: forum_threads,
          author: users,
          category: forum_categories,
        })
        .from(forum_threads)
        .innerJoin(users, eq(forum_threads.authorId, users.id))
        .innerJoin(forum_categories, eq(forum_threads.categoryId, forum_categories.id))
        .orderBy(desc(forum_threads.isPinned), desc(forum_threads.lastReplyAt), desc(forum_threads.createdAt))
        .limit(limit)
        .offset(offset),
    ]);

    return {
      threads: threads.map(t => ({
        ...t.thread,
        author: t.author,
        category: t.category,
      })),
      total: totalResult[0]?.count ?? 0,
    };
  }

  async searchForumThreads(query: string): Promise<Array<ForumThread & { author: Pick<User, 'id' | 'firstName' | 'lastName' | 'username'>; category: ForumCategory }>> {
    const searchPattern = `%${query}%`;

    const threads = await db
      .select({
        thread: forum_threads,
        author: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          username: users.username,
        },
        category: forum_categories,
        relevance: sql<number>`CASE WHEN ${forum_threads.title} ILIKE ${searchPattern} THEN 1 ELSE 2 END`,
      })
      .from(forum_threads)
      .innerJoin(users, eq(forum_threads.authorId, users.id))
      .innerJoin(forum_categories, eq(forum_threads.categoryId, forum_categories.id))
      .where(
        or(
          sql`${forum_threads.title} ILIKE ${searchPattern}`,
          sql`${forum_threads.content} ILIKE ${searchPattern}`
        )
      )
      .orderBy(sql`CASE WHEN ${forum_threads.title} ILIKE ${searchPattern} THEN 1 ELSE 2 END`, desc(forum_threads.createdAt))
      .limit(50);

    return threads.map(t => ({
      ...t.thread,
      author: t.author as any,
      category: t.category,
    }));
  }

  async getCoursesWithLessonCount(): Promise<(Course & { lessonCount: number })[]> {
    const result = await db
      .select({
        course: courses,
        lessonCount: sql<number>`count(${lessons.id})::int`,
      })
      .from(courses)
      .leftJoin(lessons, eq(courses.id, lessons.courseId))
      .where(eq(courses.isPublished, true))
      .groupBy(courses.id);

    return result.map(r => ({
      ...r.course,
      lessonCount: r.lessonCount || 0,
    }));
  }

  async getAllCoursesWithLessonCount(): Promise<(Course & { lessonCount: number })[]> {
    const result = await db
      .select({
        course: courses,
        lessonCount: sql<number>`count(${lessons.id})::int`,
      })
      .from(courses)
      .leftJoin(lessons, eq(courses.id, lessons.courseId))
      .groupBy(courses.id);

    return result.map(r => ({
      ...r.course,
      lessonCount: r.lessonCount || 0,
    }));
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

  // Notifications
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [n] = await db.insert(notifications).values(notification).returning();
    return n;
  }

  async getUserNotifications(userId: string, limit: number = 30): Promise<Notification[]> {
    return db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  async getNotification(id: string): Promise<Notification | undefined> {
    const [n] = await db.select().from(notifications).where(eq(notifications.id, id));
    return n;
  }

  async markNotificationRead(id: string): Promise<Notification> {
    const [n] = await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return n;
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    await db.update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return result?.count || 0;
  }

  // Global search
  async searchGlobal(query: string): Promise<{ courses: any[]; threads: any[]; downloads: any[] }> {
    const term = query.trim();
    if (term.length < 2) return { courses: [], threads: [], downloads: [] };

    const pattern = `%${term}%`;

    const [courseResults, threadResults, downloadResults] = await Promise.all([
      db.select({ id: courses.id, title: courses.title, description: courses.description, category: courses.category })
        .from(courses)
        .where(and(
          eq(courses.isPublished, true),
          or(sql`${courses.title} ILIKE ${pattern}`, sql`${courses.description} ILIKE ${pattern}`)
        ))
        .limit(5),
      db.select({
          id: forum_threads.id,
          title: forum_threads.title,
          categoryId: forum_threads.categoryId,
          createdAt: forum_threads.createdAt,
        })
        .from(forum_threads)
        .where(or(sql`${forum_threads.title} ILIKE ${pattern}`, sql`${forum_threads.content} ILIKE ${pattern}`))
        .orderBy(desc(forum_threads.createdAt))
        .limit(5),
      db.select({ id: downloads.id, title: downloads.title, description: downloads.description, category: downloads.category })
        .from(downloads)
        .where(and(
          eq(downloads.isPublished, true),
          or(sql`${downloads.title} ILIKE ${pattern}`, sql`${downloads.description} ILIKE ${pattern}`)
        ))
        .limit(5),
    ]);

    return {
      courses: courseResults,
      threads: threadResults,
      downloads: downloadResults,
    };
  }

  // Thread subscriptions
  async subscribeToThread(userId: string, threadId: string): Promise<ThreadSubscription> {
    const [sub] = await db.insert(threadSubscriptions)
      .values({ userId, threadId })
      .onConflictDoNothing()
      .returning();
    // If conflict (already subscribed), fetch existing
    if (!sub) {
      const [existing] = await db.select().from(threadSubscriptions)
        .where(and(eq(threadSubscriptions.userId, userId), eq(threadSubscriptions.threadId, threadId)));
      return existing;
    }
    return sub;
  }

  async unsubscribeFromThread(userId: string, threadId: string): Promise<void> {
    await db.delete(threadSubscriptions)
      .where(and(eq(threadSubscriptions.userId, userId), eq(threadSubscriptions.threadId, threadId)));
  }

  async isSubscribedToThread(userId: string, threadId: string): Promise<boolean> {
    const [sub] = await db.select({ id: threadSubscriptions.id }).from(threadSubscriptions)
      .where(and(eq(threadSubscriptions.userId, userId), eq(threadSubscriptions.threadId, threadId)));
    return !!sub;
  }

  async getThreadSubscribers(threadId: string): Promise<string[]> {
    const subs = await db.select({ userId: threadSubscriptions.userId }).from(threadSubscriptions)
      .where(eq(threadSubscriptions.threadId, threadId));
    return subs.map(s => s.userId);
  }

  // Forum likes
  async likeThread(userId: string, threadId: string): Promise<void> {
    await db.insert(forum_likes).values({ userId, threadId }).onConflictDoNothing();
  }

  async unlikeThread(userId: string, threadId: string): Promise<void> {
    await db.delete(forum_likes)
      .where(and(eq(forum_likes.userId, userId), eq(forum_likes.threadId, threadId)));
  }

  async likeReply(userId: string, replyId: string): Promise<void> {
    await db.insert(forum_likes).values({ userId, replyId }).onConflictDoNothing();
  }

  async unlikeReply(userId: string, replyId: string): Promise<void> {
    await db.delete(forum_likes)
      .where(and(eq(forum_likes.userId, userId), eq(forum_likes.replyId, replyId)));
  }

  async getThreadLikeCounts(threadIds: string[]): Promise<Record<string, number>> {
    if (threadIds.length === 0) return {};
    const rows = await db.select({
      threadId: forum_likes.threadId,
      count: sql<number>`count(*)::int`,
    }).from(forum_likes)
      .where(inArray(forum_likes.threadId!, threadIds))
      .groupBy(forum_likes.threadId);
    const map: Record<string, number> = {};
    for (const r of rows) if (r.threadId) map[r.threadId] = r.count;
    return map;
  }

  async getReplyLikeCounts(replyIds: string[]): Promise<Record<string, number>> {
    if (replyIds.length === 0) return {};
    const rows = await db.select({
      replyId: forum_likes.replyId,
      count: sql<number>`count(*)::int`,
    }).from(forum_likes)
      .where(inArray(forum_likes.replyId!, replyIds))
      .groupBy(forum_likes.replyId);
    const map: Record<string, number> = {};
    for (const r of rows) if (r.replyId) map[r.replyId] = r.count;
    return map;
  }

  async getUserLikedThreadIds(userId: string, threadIds: string[]): Promise<Set<string>> {
    if (threadIds.length === 0) return new Set();
    const rows = await db.select({ threadId: forum_likes.threadId }).from(forum_likes)
      .where(and(eq(forum_likes.userId, userId), inArray(forum_likes.threadId!, threadIds)));
    return new Set(rows.map(r => r.threadId!).filter(Boolean));
  }

  async getUserLikedReplyIds(userId: string, replyIds: string[]): Promise<Set<string>> {
    if (replyIds.length === 0) return new Set();
    const rows = await db.select({ replyId: forum_likes.replyId }).from(forum_likes)
      .where(and(eq(forum_likes.userId, userId), inArray(forum_likes.replyId!, replyIds)));
    return new Set(rows.map(r => r.replyId!).filter(Boolean));
  }

  async getCategoryThreadCounts(): Promise<Record<string, number>> {
    const rows = await db.select({
      categoryId: forum_threads.categoryId,
      count: sql<number>`count(*)::int`,
    }).from(forum_threads)
      .groupBy(forum_threads.categoryId);
    const map: Record<string, number> = {};
    for (const r of rows) map[r.categoryId] = r.count;
    return map;
  }

  // Public profile
  async getPublicProfile(userId: string): Promise<{ user: any; threadCount: number; replyCount: number } | null> {
    const [user] = await db.select({
      id: users.id,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      createdAt: users.createdAt,
    }).from(users).where(eq(users.id, userId));

    if (!user) return null;

    const [threadStats] = await db.select({ count: sql<number>`count(*)` })
      .from(forum_threads).where(eq(forum_threads.authorId, userId));

    const [replyStats] = await db.select({ count: sql<number>`count(*)` })
      .from(forum_replies).where(eq(forum_replies.authorId, userId));

    return {
      user,
      threadCount: threadStats?.count || 0,
      replyCount: replyStats?.count || 0,
    };
  }

  // Dashboard
  async getDashboardStats(userId: string): Promise<{
    coursesInProgress: number;
    coursesCompleted: number;
    availableCourses: number;
    forumPosts: number;
    videosWatched: number;
  }> {
    const [inProgressResult] = await db.select({ count: sql<number>`count(*)` })
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), sql`${enrollments.completedAt} IS NULL`));

    const [completedResult] = await db.select({ count: sql<number>`count(*)` })
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), sql`${enrollments.completedAt} IS NOT NULL`));

    const [availableResult] = await db.select({ count: sql<number>`count(*)` })
      .from(courses)
      .where(eq(courses.isPublished, true));

    const [threadCount] = await db.select({ count: sql<number>`count(*)` })
      .from(forum_threads).where(eq(forum_threads.authorId, userId));

    const [replyCount] = await db.select({ count: sql<number>`count(*)` })
      .from(forum_replies).where(eq(forum_replies.authorId, userId));

    const [videosResult] = await db.select({ count: sql<number>`count(*)` })
      .from(videoProgress)
      .where(and(eq(videoProgress.userId, userId), eq(videoProgress.isCompleted, true)));

    return {
      coursesInProgress: inProgressResult?.count || 0,
      coursesCompleted: completedResult?.count || 0,
      availableCourses: availableResult?.count || 0,
      forumPosts: (threadCount?.count || 0) + (replyCount?.count || 0),
      videosWatched: videosResult?.count || 0,
    };
  }

  async getRecentUserActivity(userId: string, limit: number = 10): Promise<any[]> {
    // Get recent enrollments
    const recentEnrollments = await db.select({
      id: enrollments.id,
      type: sql<string>`'enrollment'`,
      title: courses.title,
      date: enrollments.enrolledAt,
    })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt))
      .limit(limit);

    // Get recent forum threads
    const recentThreads = await db.select({
      id: forum_threads.id,
      type: sql<string>`'forum_thread'`,
      title: forum_threads.title,
      date: forum_threads.createdAt,
    })
      .from(forum_threads)
      .where(eq(forum_threads.authorId, userId))
      .orderBy(desc(forum_threads.createdAt))
      .limit(limit);

    // Get recent forum replies
    const recentReplies = await db.select({
      id: forum_replies.id,
      type: sql<string>`'forum_reply'`,
      title: forum_threads.title,
      date: forum_replies.createdAt,
    })
      .from(forum_replies)
      .innerJoin(forum_threads, eq(forum_replies.threadId, forum_threads.id))
      .where(eq(forum_replies.authorId, userId))
      .orderBy(desc(forum_replies.createdAt))
      .limit(limit);

    // Get recent video watches
    const recentVideos = await db.select({
      id: videoProgress.id,
      type: sql<string>`'video_watch'`,
      title: videos.title,
      date: videoProgress.lastWatchedAt,
    })
      .from(videoProgress)
      .innerJoin(videos, eq(videoProgress.videoId, videos.id))
      .where(eq(videoProgress.userId, userId))
      .orderBy(desc(videoProgress.lastWatchedAt))
      .limit(limit);

    // Combine and sort by date
    const allActivity = [
      ...recentEnrollments,
      ...recentThreads,
      ...recentReplies,
      ...recentVideos,
    ].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

    return allActivity.slice(0, limit);
  }

  // Comments
  async getCommentsByTarget(targetType: string, targetId: string): Promise<(Comment & { author: { id: string; firstName: string; lastName: string; username: string | null; role: string | null } })[]> {
    const results = await db
      .select({
        comment: comments,
        author: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          username: users.username,
          role: users.role,
        },
      })
      .from(comments)
      .innerJoin(users, eq(comments.authorId, users.id))
      .where(and(eq(comments.targetType, targetType), eq(comments.targetId, targetId)))
      .orderBy(comments.createdAt);

    return results.map(r => ({
      ...r.comment,
      author: r.author,
    }));
  }

  async createComment(data: InsertComment): Promise<Comment> {
    const [comment] = await db.insert(comments).values(data).returning();
    return comment;
  }

  async getComment(id: string): Promise<Comment | undefined> {
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    return comment;
  }

  async updateComment(id: string, data: { content: string }): Promise<Comment> {
    const [comment] = await db.update(comments)
      .set({ content: data.content, isEdited: true, editedAt: new Date(), updatedAt: new Date() })
      .where(eq(comments.id, id))
      .returning();
    return comment;
  }

  async deleteComment(id: string): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }

  // Newsletter Campaigns
  async getAllNewsletterCampaigns(): Promise<NewsletterCampaign[]> {
    return await db.select().from(newsletter_campaigns)
      .orderBy(desc(newsletter_campaigns.createdAt));
  }

  async getNewsletterCampaign(id: string): Promise<NewsletterCampaign | undefined> {
    const [campaign] = await db.select().from(newsletter_campaigns)
      .where(eq(newsletter_campaigns.id, id));
    return campaign;
  }

  async createNewsletterCampaign(data: InsertNewsletterCampaign): Promise<NewsletterCampaign> {
    const [campaign] = await db.insert(newsletter_campaigns).values(data).returning();
    return campaign;
  }

  async updateNewsletterCampaign(id: string, data: Partial<InsertNewsletterCampaign>): Promise<NewsletterCampaign> {
    const [campaign] = await db.update(newsletter_campaigns)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(newsletter_campaigns.id, id))
      .returning();
    return campaign;
  }

  async markNewsletterCampaignSent(id: string, recipientCount: number): Promise<NewsletterCampaign> {
    const [campaign] = await db.update(newsletter_campaigns)
      .set({ status: 'sent', sentAt: new Date(), recipientCount, updatedAt: new Date() })
      .where(eq(newsletter_campaigns.id, id))
      .returning();
    return campaign;
  }

  async deleteNewsletterCampaign(id: string): Promise<void> {
    await db.delete(newsletter_campaigns).where(eq(newsletter_campaigns.id, id));
  }

  async getAllNewsletterSubscribers(): Promise<Newsletter[]> {
    return await db.select().from(newsletter_subscribers)
      .orderBy(desc(newsletter_subscribers.subscribed_at));
  }
  // Subscription management
  async updateUserSubscription(userId: string, updates: Partial<{
    subscriptionTier: string;
    subscriptionStatus: string;
    subscriptionStartDate: Date;
    subscriptionEndDate: Date | null;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    premiumGrantedBy: string;
    premiumGrantedAt: Date;
  }>): Promise<User> {
    const [updated] = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async createSubscriptionRecord(data: InsertSubscription): Promise<Subscription> {
    const [record] = await db.insert(subscriptions).values(data).returning();
    return record;
  }

  async getSubscriptionHistory(userId: string): Promise<Subscription[]> {
    return await db.select().from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt));
  }

  async getActiveSubscribers(): Promise<User[]> {
    return await db.select().from(users)
      .where(and(
        eq(users.subscriptionTier, 'premium'),
        eq(users.subscriptionStatus, 'active'),
      ))
      .orderBy(desc(users.subscriptionStartDate));
  }

  // Proof Vault operations
  async createProof(data: InsertProof): Promise<Proof> {
    const [proof] = await db.insert(proofs).values(data).returning();
    return proof;
  }

  async getProof(id: string, userId: string): Promise<Proof | undefined> {
    const [proof] = await db.select().from(proofs)
      .where(and(eq(proofs.id, id), eq(proofs.userId, userId)));
    return proof;
  }

  async getUserProofs(userId: string): Promise<Proof[]> {
    return db.select().from(proofs)
      .where(eq(proofs.userId, userId))
      .orderBy(desc(proofs.createdAt));
  }

  async getUserProofsByStatus(userId: string, status: string): Promise<Proof[]> {
    return db.select().from(proofs)
      .where(and(eq(proofs.userId, userId), eq(proofs.status, status as any)))
      .orderBy(desc(proofs.createdAt));
  }

  async updateProof(id: string, updates: Partial<{ status: string; otsProof: string | null; lastUpgradeAttemptAt: Date; updatedAt: Date; errorMessage: string | null }>, userId?: string): Promise<Proof> {
    const condition = userId
      ? and(eq(proofs.id, id), eq(proofs.userId, userId))
      : eq(proofs.id, id);
    const [updated] = await db.update(proofs)
      .set(updates as any)
      .where(condition)
      .returning();
    return updated;
  }

  async findProofsByHash(sha256: string, userId: string): Promise<Proof[]> {
    return db.select().from(proofs)
      .where(and(eq(proofs.sha256, sha256), eq(proofs.userId, userId)));
  }

  async getSubscriptionStats(): Promise<{ totalPremium: number; totalFree: number; recentSubscriptions: number }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [stats] = await db.select({
      totalPremium: sql<number>`(SELECT COUNT(*) FROM ${users} WHERE subscription_tier = 'premium' AND subscription_status = 'active')`,
      totalFree: sql<number>`(SELECT COUNT(*) FROM ${users} WHERE subscription_tier = 'free' OR subscription_tier IS NULL)`,
      recentSubscriptions: sql<number>`(SELECT COUNT(*) FROM ${subscriptions} WHERE created_at > ${thirtyDaysAgo})`,
    }).from(sql`(SELECT 1) as dummy`);

    return stats;
  }

  async getAllSubscribers(search?: string): Promise<User[]> {
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      return await db.select().from(users)
        .where(
          or(
            ilike(users.firstName, term),
            ilike(users.lastName, term),
            ilike(users.email, term),
          )
        )
        .orderBy(desc(users.createdAt));
    }
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getSubscriptionStatsWithChurn(): Promise<{ totalPremium: number; totalFree: number; recentSubscriptions: number; churnRate: number }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [stats] = await db.select({
      totalPremium: sql<number>`(SELECT COUNT(*) FROM ${users} WHERE subscription_tier = 'premium' AND subscription_status = 'active')`,
      totalFree: sql<number>`(SELECT COUNT(*) FROM ${users} WHERE subscription_tier = 'free' OR subscription_tier IS NULL OR subscription_status = 'none' OR subscription_status IS NULL)`,
      recentSubscriptions: sql<number>`(SELECT COUNT(*) FROM ${subscriptions} WHERE created_at > ${thirtyDaysAgo})`,
      cancelledLast30: sql<number>`(SELECT COUNT(*) FROM ${users} WHERE subscription_status = 'cancelled' AND updated_at > ${thirtyDaysAgo})`,
      totalEverPremium: sql<number>`(SELECT COUNT(*) FROM ${users} WHERE subscription_tier = 'premium' OR subscription_status IN ('active', 'cancelled', 'expired'))`,
    }).from(sql`(SELECT 1) as dummy`);

    const churnRate = Number(stats.totalEverPremium) > 0
      ? Math.round((Number(stats.cancelledLast30) / Number(stats.totalEverPremium)) * 100 * 10) / 10
      : 0;

    return {
      totalPremium: Number(stats.totalPremium),
      totalFree: Number(stats.totalFree),
      recentSubscriptions: Number(stats.recentSubscriptions),
      churnRate,
    };
  }

  async adminUpdateSubscription(userId: string, updates: { status: string; plan: string; endDate: string | null }): Promise<User> {
    const subscriptionUpdates: Record<string, any> = {
      subscriptionStatus: updates.status,
      subscriptionTier: updates.plan,
      updatedAt: new Date(),
    };

    if (updates.endDate) {
      subscriptionUpdates.subscriptionEndDate = new Date(updates.endDate);
    } else {
      subscriptionUpdates.subscriptionEndDate = null;
    }

    // If setting to active and no start date exists, set one
    if (updates.status === 'active') {
      const user = await this.getUser(userId);
      if (user && !user.subscriptionStartDate) {
        subscriptionUpdates.subscriptionStartDate = new Date();
      }
    }

    const [updated] = await db.update(users)
      .set(subscriptionUpdates)
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  // GDPR data export helpers
  async getUserForumThreads(userId: string): Promise<any[]> {
    return await db.select().from(forum_threads).where(eq(forum_threads.authorId, userId)).orderBy(desc(forum_threads.createdAt));
  }

  async getUserForumReplies(userId: string): Promise<any[]> {
    return await db.select().from(forum_replies).where(eq(forum_replies.authorId, userId)).orderBy(desc(forum_replies.createdAt));
  }

  async getUserComments(userId: string): Promise<any[]> {
    return await db.select().from(comments).where(eq(comments.authorId, userId)).orderBy(desc(comments.createdAt));
  }

  // GDPR account deletion - delete all user data in a transaction
  async deleteAllUserData(userId: string): Promise<void> {
    await db.transaction(async (tx) => {
      // Delete in order respecting foreign key constraints
      await tx.delete(notifications).where(eq(notifications.userId, userId));
      await tx.delete(comments).where(eq(comments.authorId, userId));
      await tx.delete(forum_likes).where(eq(forum_likes.userId, userId));
      await tx.delete(forum_replies).where(eq(forum_replies.authorId, userId));
      await tx.delete(forum_threads).where(eq(forum_threads.authorId, userId));
      await tx.delete(lesson_progress).where(eq(lesson_progress.userId, userId));
      await tx.delete(sectionProgress).where(eq(sectionProgress.userId, userId));
      await tx.delete(videoProgress).where(eq(videoProgress.userId, userId));
      await tx.delete(enrollments).where(eq(enrollments.userId, userId));
      await tx.delete(userDownloads).where(eq(userDownloads.userId, userId));
      await tx.delete(proofs).where(eq(proofs.userId, userId));
      await tx.delete(subscriptions).where(eq(subscriptions.userId, userId));
      await tx.delete(threadSubscriptions).where(eq(threadSubscriptions.userId, userId));
      // Clear lastReplyUserId references on threads before deleting user
      await tx.update(forum_threads).set({ lastReplyUserId: null }).where(eq(forum_threads.lastReplyUserId, userId));
      // Finally delete the user record
      await tx.delete(users).where(eq(users.id, userId));
    });
  }

  // ====== Trust Structure ======

  async getTrustEntities(): Promise<TrustEntity[]> {
    return await db.select().from(trustEntities).orderBy(trustEntities.sortOrder);
  }

  async getTrustEntity(id: string): Promise<TrustEntity | undefined> {
    const [entity] = await db.select().from(trustEntities).where(eq(trustEntities.id, id));
    return entity;
  }

  async createTrustEntity(entity: InsertTrustEntity): Promise<TrustEntity> {
    const [created] = await db.insert(trustEntities).values(entity).returning();
    return created;
  }

  async updateTrustEntity(id: string, updates: Partial<InsertTrustEntity>): Promise<TrustEntity> {
    const [updated] = await db
      .update(trustEntities)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(trustEntities.id, id))
      .returning();
    return updated;
  }

  async deleteTrustEntity(id: string): Promise<void> {
    // Delete relationships first
    await db.delete(trustRelationships).where(
      or(eq(trustRelationships.fromEntityId, id), eq(trustRelationships.toEntityId, id))
    );
    await db.delete(trustEntities).where(eq(trustEntities.id, id));
  }

  async getTrustRelationships(): Promise<TrustRelationship[]> {
    return await db.select().from(trustRelationships);
  }

  async createTrustRelationship(rel: InsertTrustRelationship): Promise<TrustRelationship> {
    const [created] = await db.insert(trustRelationships).values(rel).returning();
    return created;
  }

  async deleteTrustRelationship(id: string): Promise<void> {
    await db.delete(trustRelationships).where(eq(trustRelationships.id, id));
  }

  async getTrustStructure(): Promise<{ entities: TrustEntity[]; relationships: TrustRelationship[] }> {
    const [entities, relationships] = await Promise.all([
      this.getTrustEntities(),
      this.getTrustRelationships(),
    ]);
    return { entities, relationships };
  }

  async seedTrustStructure(): Promise<void> {
    // Only seed if empty
    const existing = await db.select().from(trustEntities).limit(1);
    if (existing.length > 0) return;

    // === LAYER 1: CHARTER ===
    const [charter] = await db.insert(trustEntities).values({
      name: "New Covenant Legacy Trust",
      subtitle: "Constitutional Root",
      layer: "charter",
      entityType: "charter",
      description: "The covenant charter established under divine authority. Source of all governance, stewardship mandates, and community philosophy. Holds intellectual property, core charter documents, and long-term reserves.",
      charter: "Established under the authority of the New Covenant, this charter anchors the entire trust network in divine law and constitutional principles.",
      legalBasis: "First Amendment right of free association; Constitutional trust principles",
      trusteeLabel: "Mission Founder (Grantor)",
      protectorLabel: "Protector Council",
      color: "#DC2626",
      icon: "scroll",
      sortOrder: 1,
      status: "active",
    }).returning();

    // === LAYER 2: TRUST (Mission Anchor) ===
    const [ebt] = await db.insert(trustEntities).values({
      name: "Ecclesia Basilikos Trust",
      subtitle: "Mission Anchor",
      layer: "trust",
      entityType: "trust",
      description: "The mission anchor trust. Stewards the mission, protects the charter, oversees governance principles, authorizes new chapters and communes, and safeguards core assets including IP, platform ownership, and major land assets.",
      trusteeLabel: "Administrative Steward (Trustee)",
      protectorLabel: "Protector Council — checks & balance oversight",
      color: "#1E3A5F",
      icon: "crown",
      sortOrder: 2,
      status: "active",
    }).returning();

    // === LAYER 3: OPERATIONAL TRUSTS ===
    const [landTrust] = await db.insert(trustEntities).values({
      name: "Land Trust",
      subtitle: "Stewardship of Land",
      layer: "operational",
      entityType: "trust",
      description: "Holds and administers all real property, acreage, and land-based assets. Separates land ownership from community operations for legal protection.",
      color: "#16A34A",
      icon: "map-pin",
      sortOrder: 10,
      status: "active",
      acreage: "59.8 acres",
      totalValue: 34180000, // $341,800 in cents
    }).returning();

    const [housingTrust] = await db.insert(trustEntities).values({
      name: "Housing Trust",
      subtitle: "Shelter & Dwellings",
      layer: "operational",
      entityType: "trust",
      description: "Administers housing structures, shelters, and dwellings. Ensures community members have access to covenant-aligned shelter.",
      color: "#CA8A04",
      icon: "home",
      sortOrder: 11,
      status: "active",
    }).returning();

    const [treasuryTrust] = await db.insert(trustEntities).values({
      name: "Treasury Trust",
      subtitle: "Finance & Allocation",
      layer: "operational",
      entityType: "trust",
      description: "Manages financial contributions, allocations, reserves, and the economic infrastructure of the trust network. Handles PMA contributions and redistribution.",
      color: "#2563EB",
      icon: "banknote",
      sortOrder: 12,
      status: "active",
      annualRevenue: 5240000, // $52,400 in cents
    }).returning();

    const [enterpriseTrust] = await db.insert(trustEntities).values({
      name: "Enterprise Trust",
      subtitle: "Commerce & Revenue",
      layer: "operational",
      entityType: "trust",
      description: "Oversees commercial activities, revenue generation, and enterprise development. If one activity has legal problems, it doesn't endanger the entire system.",
      color: "#9333EA",
      icon: "building",
      sortOrder: 13,
      status: "active",
    }).returning();

    const [educationTrust] = await db.insert(trustEntities).values({
      name: "Education Trust",
      subtitle: "Academy & Training",
      layer: "operational",
      entityType: "trust",
      description: "Administers educational programs, courses, curriculum development, and the training infrastructure for community members and leadership.",
      color: "#0EA5E9",
      icon: "graduation-cap",
      sortOrder: 14,
      status: "active",
    }).returning();

    // === LAYER 4: PMA (People Layer) ===
    const [mainPma] = await db.insert(trustEntities).values({
      name: "Ecclesia Basilikos PMA",
      subtitle: "People Layer",
      layer: "pma",
      entityType: "pma",
      description: "The primary Private Membership Association. Members join the community through the PMA. They are beneficiary participants, not owners of trust assets. Protects internal community governance, voluntary association rights, and private member interaction.",
      legalBasis: "First Amendment right of free association",
      color: "#7C3AED",
      icon: "users",
      sortOrder: 20,
      status: "active",
      memberCount: 24,
    }).returning();

    // === LAYER 5: PLATFORM (Community OS) ===
    const [platform] = await db.insert(trustEntities).values({
      name: "Ecclesia Platform",
      subtitle: "Community OS",
      layer: "platform",
      entityType: "platform",
      description: "The digital platform layer — the administrative operating system of the trust network. Manages membership records, chapter structure, project coordination, education systems, governance tools, and communication.",
      color: "#F59E0B",
      icon: "monitor",
      sortOrder: 25,
      status: "active",
    }).returning();

    // === LAYER 6: CHAPTERS (Geographic) ===
    const [hg1] = await db.insert(trustEntities).values({
      name: "Heaven's Gate 1",
      subtitle: "Rural · 42 acres",
      layer: "chapter",
      entityType: "chapter",
      description: "Rural chapter settlement on 42 acres. Agricultural stewardship, sustainable living, and covenant fellowship. Coordinates local members, meetups, resource sharing, and project launches.",
      location: "Rural",
      acreage: "42 acres",
      color: "#059669",
      icon: "trees",
      sortOrder: 30,
      status: "active",
      memberCount: 0,
      totalValue: 20000000, // example
    }).returning();

    const [hg2] = await db.insert(trustEntities).values({
      name: "Heaven's Gate 2",
      subtitle: "Gateway · 17 acres",
      layer: "chapter",
      entityType: "chapter",
      description: "Gateway chapter on 17 acres. Transitional housing, training center, and preparation for covenant community life.",
      location: "Gateway",
      acreage: "17 acres",
      color: "#0891B2",
      icon: "door-open",
      sortOrder: 31,
      status: "active",
      memberCount: 0,
      totalValue: 14180000,
    }).returning();

    const [hg3] = await db.insert(trustEntities).values({
      name: "Heaven's Gate 3",
      subtitle: "Urban Refuge",
      layer: "chapter",
      entityType: "chapter",
      description: "Urban refuge and embassy. Outreach, education, and gathering point for the ecclesia in urban settings.",
      location: "Urban",
      color: "#6366F1",
      icon: "building-2",
      sortOrder: 32,
      status: "planned",
      memberCount: 0,
    }).returning();

    // === LAYER 7: COMMUNES (Functional Communities) ===
    const [farmCommune] = await db.insert(trustEntities).values({
      name: "HG1 Farming Commune",
      subtitle: "Agricultural Stewardship",
      layer: "commune",
      entityType: "commune",
      description: "Farming commune within Heaven's Gate 1. Shared agricultural operations, crop management, livestock, and food production.",
      color: "#65A30D",
      icon: "wheat",
      sortOrder: 40,
      status: "planned",
    }).returning();

    const [discCommune] = await db.insert(trustEntities).values({
      name: "HG2 Discipleship House",
      subtitle: "Training & Formation",
      layer: "commune",
      entityType: "commune",
      description: "Discipleship commune within Heaven's Gate 2. Intensive training, mentorship, and preparation for community leadership.",
      color: "#D97706",
      icon: "book-open",
      sortOrder: 41,
      status: "planned",
    }).returning();

    // === LAYER 4b: Chapter PMAs ===
    const [hg1pma] = await db.insert(trustEntities).values({
      name: "HG1 PMA",
      subtitle: "Membership · Rural",
      layer: "pma",
      entityType: "pma",
      description: "Local PMA for Heaven's Gate 1 rural chapter. Governs member rights, obligations, and community participation at the chapter level.",
      color: "#8B5CF6",
      icon: "shield-check",
      sortOrder: 50,
      status: "active",
    }).returning();

    const [hg2pma] = await db.insert(trustEntities).values({
      name: "HG2 PMA",
      subtitle: "Membership · Gateway",
      layer: "pma",
      entityType: "pma",
      description: "Local PMA for Heaven's Gate 2 gateway chapter.",
      color: "#8B5CF6",
      icon: "shield-check",
      sortOrder: 51,
      status: "active",
    }).returning();

    const [hg3pma] = await db.insert(trustEntities).values({
      name: "HG3 PMA",
      subtitle: "Membership · Urban",
      layer: "pma",
      entityType: "pma",
      description: "Local PMA for Heaven's Gate 3 urban chapter.",
      color: "#8B5CF6",
      icon: "shield-check",
      sortOrder: 52,
      status: "planned",
    }).returning();

    // === RELATIONSHIPS ===

    // Charter → Trust (Authority)
    await db.insert(trustRelationships).values({ fromEntityId: charter.id, toEntityId: ebt.id, relationshipType: "authority", label: "Authorizes" });

    // Trust → Operational (Grants)
    await db.insert(trustRelationships).values([
      { fromEntityId: ebt.id, toEntityId: landTrust.id, relationshipType: "grants", label: "Stewardship mandate" },
      { fromEntityId: ebt.id, toEntityId: housingTrust.id, relationshipType: "grants" },
      { fromEntityId: ebt.id, toEntityId: treasuryTrust.id, relationshipType: "grants" },
      { fromEntityId: ebt.id, toEntityId: enterpriseTrust.id, relationshipType: "oversees" },
      { fromEntityId: ebt.id, toEntityId: educationTrust.id, relationshipType: "grants" },
    ]);

    // Trust → PMA (Establishes)
    await db.insert(trustRelationships).values({ fromEntityId: ebt.id, toEntityId: mainPma.id, relationshipType: "establishes_pma", label: "Establishes" });

    // PMA → Platform (Oversees)
    await db.insert(trustRelationships).values({ fromEntityId: mainPma.id, toEntityId: platform.id, relationshipType: "oversees", label: "Administers" });

    // Operational → Chapters (Land, Funds)
    await db.insert(trustRelationships).values([
      { fromEntityId: landTrust.id, toEntityId: hg1.id, relationshipType: "land" },
      { fromEntityId: landTrust.id, toEntityId: hg2.id, relationshipType: "land" },
      { fromEntityId: housingTrust.id, toEntityId: hg1.id, relationshipType: "funds" },
      { fromEntityId: housingTrust.id, toEntityId: hg2.id, relationshipType: "funds" },
      { fromEntityId: housingTrust.id, toEntityId: hg3.id, relationshipType: "funds" },
      { fromEntityId: treasuryTrust.id, toEntityId: enterpriseTrust.id, relationshipType: "funds" },
      { fromEntityId: educationTrust.id, toEntityId: platform.id, relationshipType: "funds", label: "Curriculum & courses" },
    ]);

    // Chapters → Chapter PMAs (Establishes PMA)
    await db.insert(trustRelationships).values([
      { fromEntityId: hg1.id, toEntityId: hg1pma.id, relationshipType: "establishes_pma" },
      { fromEntityId: hg2.id, toEntityId: hg2pma.id, relationshipType: "establishes_pma" },
      { fromEntityId: hg3.id, toEntityId: hg3pma.id, relationshipType: "establishes_pma" },
    ]);

    // Chapter PMAs → Chapters (Remits)
    await db.insert(trustRelationships).values([
      { fromEntityId: hg1pma.id, toEntityId: hg1.id, relationshipType: "remits" },
      { fromEntityId: hg2pma.id, toEntityId: hg2.id, relationshipType: "remits" },
      { fromEntityId: hg3pma.id, toEntityId: hg3.id, relationshipType: "remits" },
    ]);

    // Chapters → Communes
    await db.insert(trustRelationships).values([
      { fromEntityId: hg1.id, toEntityId: farmCommune.id, relationshipType: "oversees" },
      { fromEntityId: hg2.id, toEntityId: discCommune.id, relationshipType: "oversees" },
    ]);

    // Cross-coordination
    await db.insert(trustRelationships).values([
      { fromEntityId: hg1.id, toEntityId: hg2.id, relationshipType: "coordinates" },
      { fromEntityId: hg2.id, toEntityId: hg3.id, relationshipType: "coordinates" },
    ]);

    // Main PMA → Chapter PMAs (Authority)
    await db.insert(trustRelationships).values([
      { fromEntityId: mainPma.id, toEntityId: hg1pma.id, relationshipType: "authority" },
      { fromEntityId: mainPma.id, toEntityId: hg2pma.id, relationshipType: "authority" },
      { fromEntityId: mainPma.id, toEntityId: hg3pma.id, relationshipType: "authority" },
    ]);
  }
}

export const storage = new DatabaseStorage();

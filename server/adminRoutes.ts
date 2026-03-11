import { Router } from 'express';
import { z } from 'zod';
import { storage } from './storage';
import { requireAuth, requireAdmin, requireModerator, requireInstructor, loadUser, auditLog } from './adminMiddleware';
import { sendEmail, generateBulkEmailHtml } from './email';
import { generateDownloadMetadata } from './ai';
import logger from './logger';
import {
  insertVideoSchema,
  insertResourceSchema,
  insertCourseSchema,
  insertLessonSchema,
  insertForumCategorySchema,
  insertPageContentSchema,
  updatePageContentSchema,
  insertDownloadSchema,
  insertTrustEntitySchema,
  insertTrustRelationshipSchema,
} from '@shared/schema';

const router = Router();

// Apply user loading middleware to all admin routes
router.use(loadUser);

// ================================
// USER MANAGEMENT (ADMIN ONLY)
// ================================

// Get all users
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await storage.getAllUsers();
    res.json(users);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching users:');
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role
router.patch('/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = z.object({ role: z.enum(['student', 'instructor', 'moderator', 'admin']) }).parse(req.body);
    
    const oldUser = await storage.getUser(id);
    const updatedUser = await storage.updateUserRole(id, role);
    
    await auditLog(
      req.user!.id, 
      'UPDATE', 
      'USER', 
      id, 
      { role: oldUser?.role }, 
      { role },
      req.ip,
      req.get('User-Agent')
    );
    
    res.json(updatedUser);
  } catch (error) {
    logger.error({ err: error }, 'Error updating user role:');
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Toggle user active status
router.patch('/users/:id/toggle-active', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const oldUser = await storage.getUser(id);
    const updatedUser = await storage.toggleUserActive(id);
    
    await auditLog(
      req.user!.id, 
      'UPDATE', 
      'USER', 
      id, 
      { isActive: oldUser?.isActive }, 
      { isActive: updatedUser.isActive },
      req.ip,
      req.get('User-Agent')
    );
    
    res.json(updatedUser);
  } catch (error) {
    logger.error({ err: error }, 'Error toggling user status:');
    res.status(500).json({ error: 'Failed to toggle user status' });
  }
});

// Delete user
router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const oldUser = await storage.getUser(id);
    await storage.deleteUser(id);
    
    await auditLog(
      req.user!.id, 
      'DELETE', 
      'USER', 
      id, 
      oldUser, 
      null,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting user:');
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Send bulk email to all active users
router.post('/users/email', requireAdmin, async (req, res) => {
  try {
    const { subject, html } = z.object({
      subject: z.string().min(1, 'Subject is required'),
      html: z.string().min(1, 'Message body is required'),
    }).parse(req.body);

    const users = await storage.getAllUsers();
    const activeUsers = users.filter(u => u.isActive && u.email);

    if (activeUsers.length === 0) {
      return res.status(400).json({ error: 'No active users with valid emails found' });
    }

    const emailBody = generateBulkEmailHtml(subject, html);
    const bccList = activeUsers.map(u => u.email).join(',');

    const success = await sendEmail({
      to: process.env.GMAIL_EMAIL || '',
      subject,
      html: emailBody,
      bcc: bccList,
    });

    const result = {
      sent: success ? activeUsers.length : 0,
      failed: success ? 0 : activeUsers.length,
      total: activeUsers.length,
    };

    await auditLog(
      req.user!.id,
      'CREATE',
      'BULK_EMAIL',
      '',
      null,
      { subject, recipientCount: activeUsers.length, success },
      req.ip,
      req.get('User-Agent')
    );

    if (!success) {
      return res.status(500).json({ error: 'Failed to send email', ...result });
    }

    res.json(result);
  } catch (error) {
    logger.error({ err: error }, 'Error sending bulk email:');
    res.status(500).json({ error: 'Failed to send bulk email' });
  }
});

// ================================
// VIDEO MANAGEMENT (INSTRUCTOR+)
// ================================

// Get all videos
router.get('/videos', requireInstructor, async (req, res) => {
  try {
    const videos = await storage.getAllVideos();
    res.json(videos);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching videos:');
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Create video
router.post('/videos', requireInstructor, async (req, res) => {
  try {
    const videoData = insertVideoSchema.omit({ createdById: true }).parse(req.body);
    const video = await storage.createVideo({
      ...videoData,
      createdById: req.user!.id,
    });
    
    await auditLog(
      req.user!.id, 
      'CREATE', 
      'VIDEO', 
      video.id, 
      null, 
      video,
      req.ip,
      req.get('User-Agent')
    );
    
    res.status(201).json(video);
  } catch (error) {
    logger.error({ err: error }, 'Error creating video:');
    res.status(500).json({ error: 'Failed to create video' });
  }
});

// Update video
router.patch('/videos/:id', requireInstructor, async (req, res) => {
  try {
    const { id } = req.params;
    const videoData = insertVideoSchema.partial().parse(req.body);
    
    const oldVideo = await storage.getAllVideos().then(videos => videos.find(v => v.id === id));
    const updatedVideo = await storage.updateVideo(id, videoData);
    
    await auditLog(
      req.user!.id, 
      'UPDATE', 
      'VIDEO', 
      id, 
      oldVideo, 
      updatedVideo,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json(updatedVideo);
  } catch (error) {
    logger.error({ err: error }, 'Error updating video:');
    res.status(500).json({ error: 'Failed to update video' });
  }
});

// Toggle video published status
router.patch('/videos/:id/toggle-published', requireInstructor, async (req, res) => {
  try {
    const { id } = req.params;
    
    const oldVideo = await storage.getAllVideos().then(videos => videos.find(v => v.id === id));
    const updatedVideo = await storage.toggleVideoPublished(id);
    
    await auditLog(
      req.user!.id, 
      'UPDATE', 
      'VIDEO', 
      id, 
      { isPublished: oldVideo?.isPublished }, 
      { isPublished: updatedVideo.isPublished },
      req.ip,
      req.get('User-Agent')
    );
    
    res.json(updatedVideo);
  } catch (error) {
    logger.error({ err: error }, 'Error toggling video status:');
    res.status(500).json({ error: 'Failed to toggle video status' });
  }
});

// Delete video
router.delete('/videos/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const oldVideo = await storage.getAllVideos().then(videos => videos.find(v => v.id === id));
    await storage.deleteVideo(id);
    
    await auditLog(
      req.user!.id, 
      'DELETE', 
      'VIDEO', 
      id, 
      oldVideo, 
      null,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting video:');
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

// ================================
// RESOURCE MANAGEMENT (INSTRUCTOR+)
// ================================

// Get all resources
router.get('/resources', requireInstructor, async (req, res) => {
  try {
    const resources = await storage.getAllResources();
    res.json(resources);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching resources:');
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Create resource
router.post('/resources', requireInstructor, async (req, res) => {
  try {
    const resourceData = insertResourceSchema.omit({ createdById: true }).parse(req.body);
    const resource = await storage.createResource({
      ...resourceData,
      createdById: req.user!.id,
    });
    
    await auditLog(
      req.user!.id, 
      'CREATE', 
      'RESOURCE', 
      resource.id, 
      null, 
      resource,
      req.ip,
      req.get('User-Agent')
    );
    
    res.status(201).json(resource);
  } catch (error) {
    logger.error({ err: error }, 'Error creating resource:');
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

// Update resource
router.patch('/resources/:id', requireInstructor, async (req, res) => {
  try {
    const { id } = req.params;
    const resourceData = insertResourceSchema.partial().parse(req.body);
    
    const oldResource = await storage.getAllResources().then(resources => resources.find(r => r.id === id));
    const updatedResource = await storage.updateResource(id, resourceData);
    
    await auditLog(
      req.user!.id, 
      'UPDATE', 
      'RESOURCE', 
      id, 
      oldResource, 
      updatedResource,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json(updatedResource);
  } catch (error) {
    logger.error({ err: error }, 'Error updating resource:');
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// Toggle resource published status
router.patch('/resources/:id/toggle-published', requireInstructor, async (req, res) => {
  try {
    const { id } = req.params;
    
    const oldResource = await storage.getAllResources().then(resources => resources.find(r => r.id === id));
    const updatedResource = await storage.toggleResourcePublished(id);
    
    await auditLog(
      req.user!.id, 
      'UPDATE', 
      'RESOURCE', 
      id, 
      { isPublished: oldResource?.isPublished }, 
      { isPublished: updatedResource.isPublished },
      req.ip,
      req.get('User-Agent')
    );
    
    res.json(updatedResource);
  } catch (error) {
    logger.error({ err: error }, 'Error toggling resource status:');
    res.status(500).json({ error: 'Failed to toggle resource status' });
  }
});

// Delete resource
router.delete('/resources/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const oldResource = await storage.getAllResources().then(resources => resources.find(r => r.id === id));
    await storage.deleteResource(id);
    
    await auditLog(
      req.user!.id, 
      'DELETE', 
      'RESOURCE', 
      id, 
      oldResource, 
      null,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting resource:');
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

// ================================
// COURSE MANAGEMENT (INSTRUCTOR+)
// ================================

// Get all courses (including unpublished) for admin editor
router.get('/courses', requireInstructor, async (req, res) => {
  try {
    const courses = await storage.getAllCoursesWithLessonCount();
    res.json(courses);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching all courses:');
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Create course
router.post('/courses', requireInstructor, async (req, res) => {
  try {
    const courseData = insertCourseSchema.parse({ ...req.body, createdById: req.user!.id });
    const course = await storage.createCourse(courseData);

    await auditLog(
      req.user!.id,
      'CREATE',
      'COURSE',
      course.id,
      null,
      course,
      req.ip,
      req.get('User-Agent')
    );

    res.status(201).json(course);
  } catch (error) {
    logger.error({ err: error }, 'Error creating course:');
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update course
router.patch('/courses/:id', requireInstructor, async (req, res) => {
  try {
    const { id } = req.params;
    const courseData = insertCourseSchema.partial().parse(req.body);
    
    const oldCourse = await storage.getCourse(id);
    const updatedCourse = await storage.updateCourse(id, courseData);
    
    await auditLog(
      req.user!.id, 
      'UPDATE', 
      'COURSE', 
      id, 
      oldCourse, 
      updatedCourse,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json(updatedCourse);
  } catch (error) {
    logger.error({ err: error }, 'Error updating course:');
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Toggle course published status
router.patch('/courses/:id/toggle-published', requireInstructor, async (req, res) => {
  try {
    const { id } = req.params;
    
    const oldCourse = await storage.getCourse(id);
    const updatedCourse = await storage.toggleCoursePublished(id);
    
    await auditLog(
      req.user!.id, 
      'UPDATE', 
      'COURSE', 
      id, 
      { isPublished: oldCourse?.isPublished }, 
      { isPublished: updatedCourse.isPublished },
      req.ip,
      req.get('User-Agent')
    );
    
    res.json(updatedCourse);
  } catch (error) {
    logger.error({ err: error }, 'Error toggling course status:');
    res.status(500).json({ error: 'Failed to toggle course status' });
  }
});

// Delete course
router.delete('/courses/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const oldCourse = await storage.getCourse(id);
    await storage.deleteCourse(id);
    
    await auditLog(
      req.user!.id, 
      'DELETE', 
      'COURSE', 
      id, 
      oldCourse, 
      null,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting course:');
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Create lesson
router.post('/courses/:courseId/lessons', requireInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessonData = insertLessonSchema.parse({ ...req.body, courseId });
    
    const lesson = await storage.createLesson(lessonData);
    
    await auditLog(
      req.user!.id, 
      'CREATE', 
      'LESSON', 
      lesson.id, 
      null, 
      lesson,
      req.ip,
      req.get('User-Agent')
    );
    
    res.status(201).json(lesson);
  } catch (error) {
    logger.error({ err: error }, 'Error creating lesson:');
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// Update lesson
router.patch('/lessons/:id', requireInstructor, async (req, res) => {
  try {
    const { id } = req.params;
    const lessonData = insertLessonSchema.partial().parse(req.body);
    
    const oldLesson = await storage.getLessonById(id);
    const updatedLesson = await storage.updateLesson(id, lessonData);
    
    await auditLog(
      req.user!.id, 
      'UPDATE', 
      'LESSON', 
      id, 
      oldLesson, 
      updatedLesson,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json(updatedLesson);
  } catch (error) {
    logger.error({ err: error }, 'Error updating lesson:');
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// Delete lesson
router.delete('/lessons/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const oldLesson = await storage.getLessonById(id);
    await storage.deleteLesson(id);

    await auditLog(
      req.user!.id,
      'DELETE',
      'LESSON',
      id,
      oldLesson,
      null,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting lesson:');
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// Reorder lessons
router.patch('/courses/:courseId/lessons/reorder', requireInstructor, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonIds } = z.object({ lessonIds: z.array(z.string()) }).parse(req.body);
    await storage.reorderLessons(courseId, lessonIds);
    await auditLog(req.user!.id, 'UPDATE', 'COURSE', courseId, null, { action: 'reorder_lessons' }, req.ip, req.get('User-Agent'));
    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error reordering lessons:');
    res.status(500).json({ error: 'Failed to reorder lessons' });
  }
});

// Duplicate lesson
router.post('/lessons/:id/duplicate', requireInstructor, async (req, res) => {
  try {
    const { id } = req.params;
    const newLesson = await storage.duplicateLesson(id);
    await auditLog(req.user!.id, 'CREATE', 'LESSON', newLesson.id, null, newLesson, req.ip, req.get('User-Agent'));
    res.status(201).json(newLesson);
  } catch (error) {
    logger.error({ err: error }, 'Error duplicating lesson:');
    res.status(500).json({ error: 'Failed to duplicate lesson' });
  }
});

// Course enrollment stats
router.get('/courses/:courseId/stats', requireInstructor, async (req, res) => {
  try {
    const stats = await storage.getCourseStats(req.params.courseId);
    res.json(stats);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching course stats:');
    res.status(500).json({ error: 'Failed to fetch course stats' });
  }
});

// Audit log for specific entity
router.get('/audit-log', requireAdmin, async (req, res) => {
  try {
    const { entityType, entityId } = z.object({
      entityType: z.string(),
      entityId: z.string(),
    }).parse(req.query);
    const logs = await storage.getAuditLogForEntity(entityType, entityId);
    res.json(logs);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching audit log:');
    res.status(500).json({ error: 'Failed to fetch audit log' });
  }
});

// Bulk delete lessons
router.post('/courses/:courseId/lessons/bulk-delete', requireAdmin, async (req, res) => {
  try {
    const { lessonIds } = z.object({ lessonIds: z.array(z.string()) }).parse(req.body);
    await storage.bulkDeleteLessons(lessonIds);
    await auditLog(req.user!.id, 'DELETE', 'LESSON', req.params.courseId, { lessonIds }, null, req.ip, req.get('User-Agent'));
    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error bulk deleting lessons:');
    res.status(500).json({ error: 'Failed to bulk delete lessons' });
  }
});

// Course categories
router.get('/courses/categories', requireInstructor, async (req, res) => {
  try {
    const categories = await storage.getCourseCategories();
    res.json(categories);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching categories:');
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ================================
// FORUM MANAGEMENT (MODERATOR+)
// ================================

// Create forum category
router.post('/forum/categories', requireModerator, async (req, res) => {
  try {
    const categoryData = insertForumCategorySchema.parse(req.body);
    const category = await storage.createForumCategory(categoryData);
    
    await auditLog(
      req.user!.id, 
      'CREATE', 
      'FORUM_CATEGORY', 
      category.id, 
      null, 
      category,
      req.ip,
      req.get('User-Agent')
    );
    
    res.status(201).json(category);
  } catch (error) {
    logger.error({ err: error }, 'Error creating forum category:');
    res.status(500).json({ error: 'Failed to create forum category' });
  }
});

// Update forum category
router.patch('/forum/categories/:id', requireModerator, async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = insertForumCategorySchema.partial().parse(req.body);
    
    const oldCategory = await storage.getForumCategoryById(id);
    const updatedCategory = await storage.updateForumCategory(id, categoryData);
    
    await auditLog(
      req.user!.id, 
      'UPDATE', 
      'FORUM_CATEGORY', 
      id, 
      oldCategory, 
      updatedCategory,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json(updatedCategory);
  } catch (error) {
    logger.error({ err: error }, 'Error updating forum category:');
    res.status(500).json({ error: 'Failed to update forum category' });
  }
});

// Delete forum category
router.delete('/forum/categories/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const oldCategory = await storage.getForumCategoryById(id);
    await storage.deleteForumCategory(id);
    
    await auditLog(
      req.user!.id, 
      'DELETE', 
      'FORUM_CATEGORY', 
      id, 
      oldCategory, 
      null,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting forum category:');
    res.status(500).json({ error: 'Failed to delete forum category' });
  }
});

// Toggle thread pinned
router.patch('/forum/threads/:id/toggle-pinned', requireModerator, async (req, res) => {
  try {
    const { id } = req.params;
    
    const oldThread = await storage.getForumThreadById(id);
    const updatedThread = await storage.toggleThreadPinned(id);
    
    await auditLog(
      req.user!.id, 
      'UPDATE', 
      'FORUM_THREAD', 
      id, 
      { isPinned: oldThread?.isPinned }, 
      { isPinned: updatedThread.isPinned },
      req.ip,
      req.get('User-Agent')
    );
    
    res.json(updatedThread);
  } catch (error) {
    logger.error({ err: error }, 'Error toggling thread pinned:');
    res.status(500).json({ error: 'Failed to toggle thread pinned' });
  }
});

// Toggle thread locked
router.patch('/forum/threads/:id/toggle-locked', requireModerator, async (req, res) => {
  try {
    const { id } = req.params;
    
    const oldThread = await storage.getForumThreadById(id);
    const updatedThread = await storage.toggleThreadLocked(id);
    
    await auditLog(
      req.user!.id, 
      'UPDATE', 
      'FORUM_THREAD', 
      id, 
      { isLocked: oldThread?.isLocked }, 
      { isLocked: updatedThread.isLocked },
      req.ip,
      req.get('User-Agent')
    );
    
    res.json(updatedThread);
  } catch (error) {
    logger.error({ err: error }, 'Error toggling thread locked:');
    res.status(500).json({ error: 'Failed to toggle thread locked' });
  }
});

// Delete forum thread
router.delete('/forum/threads/:id', requireModerator, async (req, res) => {
  try {
    const { id } = req.params;
    
    const oldThread = await storage.getForumThreadById(id);
    await storage.deleteForumThread(id);
    
    await auditLog(
      req.user!.id, 
      'DELETE', 
      'FORUM_THREAD', 
      id, 
      oldThread, 
      null,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting forum thread:');
    res.status(500).json({ error: 'Failed to delete forum thread' });
  }
});

// Delete forum reply
router.delete('/forum/replies/:id', requireModerator, async (req, res) => {
  try {
    const { id } = req.params;
    
    await storage.deleteForumReply(id);
    
    await auditLog(
      req.user!.id, 
      'DELETE', 
      'FORUM_REPLY', 
      id, 
      null, 
      null,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting forum reply:');
    res.status(500).json({ error: 'Failed to delete forum reply' });
  }
});

// ================================
// ANALYTICS & MONITORING (ADMIN)
// ================================

// Get system statistics
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const stats = await storage.getSystemStats();
    res.json(stats);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching system stats:');
    res.status(500).json({ error: 'Failed to fetch system stats' });
  }
});

// Get recent activity audit log
router.get('/activity', requireAdmin, async (req, res) => {
  try {
    const activity = await storage.getRecentActivity();
    res.json(activity);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching recent activity:');
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

// ================================
// PAGE CONTENT MANAGEMENT (ADMIN)
// ================================

// Get all page content
router.get('/page-content', requireAdmin, async (req, res) => {
  try {
    const pageContent = await storage.getAllPageContent();
    res.json(pageContent);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching page content:');
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

// Get page content by page name
router.get('/page-content/:pageName', requireAdmin, async (req, res) => {
  try {
    const { pageName } = req.params;
    const pageContent = await storage.getPageContent(pageName);
    res.json(pageContent);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching page content:');
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

// Create or update page content
router.post('/page-content', requireAdmin, async (req, res) => {
  try {
    const contentData = insertPageContentSchema.parse({
      ...req.body,
      updatedById: req.user!.id
    });
    
    const pageContent = await storage.upsertPageContent(contentData);
    
    await auditLog(
      req.user!.id, 
      'CREATE', 
      'PAGE_CONTENT', 
      pageContent.id, 
      null, 
      pageContent,
      req.ip,
      req.get('User-Agent')
    );
    
    res.status(201).json(pageContent);
  } catch (error) {
    logger.error({ err: error }, 'Error creating page content:');
    res.status(500).json({ error: 'Failed to create page content' });
  }
});

// Update specific page content
router.patch('/page-content/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = updatePageContentSchema.parse(req.body);
    
    const oldContent = await storage.getPageContentById(id);
    const updatedContent = await storage.updatePageContent(id, {
      ...updates,
      updatedById: req.user!.id
    });
    
    await auditLog(
      req.user!.id, 
      'UPDATE', 
      'PAGE_CONTENT', 
      id, 
      oldContent, 
      updatedContent,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json(updatedContent);
  } catch (error) {
    logger.error({ err: error }, 'Error updating page content:');
    res.status(500).json({ error: 'Failed to update page content' });
  }
});

// Delete page content
router.delete('/page-content/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const oldContent = await storage.getPageContentById(id);
    await storage.deletePageContent(id);
    
    await auditLog(
      req.user!.id, 
      'DELETE', 
      'PAGE_CONTENT', 
      id, 
      oldContent, 
      null,
      req.ip,
      req.get('User-Agent')
    );
    
    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting page content:');
    res.status(500).json({ error: 'Failed to delete page content' });
  }
});

// ================================
// DOWNLOADS MANAGEMENT (ADMIN ONLY)
// ================================

// Get all downloads
router.get('/downloads', requireAdmin, async (req, res) => {
  try {
    const allDownloads = await storage.getAllDownloads();
    res.json(allDownloads);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching downloads:');
    res.status(500).json({ error: 'Failed to fetch downloads' });
  }
});

router.get('/downloads/:id', requireAdmin, async (req, res) => {
  try {
    const download = await storage.getDownload(req.params.id);
    if (!download) {
      return res.status(404).json({ error: 'Download not found' });
    }
    res.json(download);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching download:');
    res.status(500).json({ error: 'Failed to fetch download' });
  }
});

router.post('/downloads', requireAdmin, async (req, res) => {
  try {
    const downloadData = insertDownloadSchema.parse(req.body);
    const download = await storage.createDownload(downloadData);

    await auditLog(
      req.user!.id,
      'CREATE',
      'DOWNLOAD',
      download.id,
      null,
      download,
      req.ip,
      req.get('User-Agent')
    );

    res.status(201).json(download);
  } catch (error) {
    logger.error({ err: error }, 'Error creating download:');
    res.status(500).json({ error: 'Failed to create download' });
  }
});

router.put('/downloads/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const oldDownload = await storage.getDownload(id);
    const updates = insertDownloadSchema.partial().parse(req.body);
    const updated = await storage.updateDownload(id, updates);

    await auditLog(
      req.user!.id,
      'UPDATE',
      'DOWNLOAD',
      id,
      oldDownload,
      updated,
      req.ip,
      req.get('User-Agent')
    );

    res.json(updated);
  } catch (error) {
    logger.error({ err: error }, 'Error updating download:');
    res.status(500).json({ error: 'Failed to update download' });
  }
});

router.patch('/downloads/:id/toggle-published', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const oldDownload = await storage.getDownload(id);
    const updated = await storage.toggleDownloadPublished(id);

    await auditLog(
      req.user!.id,
      'UPDATE',
      'DOWNLOAD',
      id,
      { isPublished: oldDownload?.isPublished },
      { isPublished: updated.isPublished },
      req.ip,
      req.get('User-Agent')
    );

    res.json(updated);
  } catch (error) {
    logger.error({ err: error }, 'Error toggling download published:');
    res.status(500).json({ error: 'Failed to toggle download published' });
  }
});

router.delete('/downloads/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const oldDownload = await storage.getDownload(id);
    await storage.deleteDownload(id);

    await auditLog(
      req.user!.id,
      'DELETE',
      'DOWNLOAD',
      id,
      oldDownload,
      null,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting download:');
    res.status(500).json({ error: 'Failed to delete download' });
  }
});

// ================================
// AI-GENERATED DOWNLOAD METADATA
// ================================

// Simple in-memory rate limiter for AI endpoint
const aiRateLimits = new Map<string, number[]>();

router.post('/downloads/ai-generate', requireAdmin, async (req, res) => {
  try {
    // Rate limiting: 5 requests per minute per user
    const userId = req.user!.id;
    const now = Date.now();
    const windowMs = 60_000;
    const maxRequests = 5;

    const timestamps = aiRateLimits.get(userId) || [];
    const recent = timestamps.filter(t => now - t < windowMs);

    if (recent.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many AI generation requests. Please wait a minute.' });
    }

    recent.push(now);
    aiRateLimits.set(userId, recent);

    const { fileName, fileType, fileSize, title } = z.object({
      fileName: z.string().min(1),
      fileType: z.string().min(1),
      fileSize: z.string().optional(),
      title: z.string().optional(),
    }).parse(req.body);

    const metadata = await generateDownloadMetadata({ fileName, fileType, fileSize, title });
    res.json(metadata);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    logger.error({ err: error }, 'Error generating AI download metadata');
    const message = error.message?.includes('ANTHROPIC_API_KEY')
      ? 'AI service is not configured'
      : 'Failed to generate metadata';
    res.status(500).json({ error: message });
  }
});

// ================================
// NEWSLETTER CAMPAIGNS (ADMIN ONLY)
// ================================

// Get all newsletter subscribers
router.get('/newsletter-subscribers', requireAdmin, async (req, res) => {
  try {
    const subscribers = await storage.getAllNewsletterSubscribers();
    res.json({ subscribers, count: subscribers.length });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching newsletter subscribers:');
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// Get all campaigns
router.get('/newsletter-campaigns', requireAdmin, async (req, res) => {
  try {
    const campaigns = await storage.getAllNewsletterCampaigns();
    res.json(campaigns);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching newsletter campaigns:');
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Create draft campaign
router.post('/newsletter-campaigns', requireAdmin, async (req, res) => {
  try {
    const { subject, body } = z.object({
      subject: z.string().min(1, 'Subject is required'),
      body: z.string().min(1, 'Body is required'),
    }).parse(req.body);

    const campaign = await storage.createNewsletterCampaign({
      subject,
      body,
      createdById: req.user!.id,
    });

    await auditLog(
      req.user!.id,
      'CREATE',
      'NEWSLETTER_CAMPAIGN',
      campaign.id,
      null,
      { subject },
      req.ip,
      req.get('User-Agent')
    );

    res.status(201).json(campaign);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
    logger.error({ err: error }, 'Error creating newsletter campaign:');
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Get single campaign
router.get('/newsletter-campaigns/:id', requireAdmin, async (req, res) => {
  try {
    const campaign = await storage.getNewsletterCampaign(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching newsletter campaign:');
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// Update draft campaign
router.put('/newsletter-campaigns/:id', requireAdmin, async (req, res) => {
  try {
    const campaign = await storage.getNewsletterCampaign(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    if (campaign.status === 'sent') return res.status(400).json({ error: 'Cannot edit a sent campaign' });

    const { subject, body } = z.object({
      subject: z.string().min(1).optional(),
      body: z.string().min(1).optional(),
    }).parse(req.body);

    const updated = await storage.updateNewsletterCampaign(req.params.id, { subject, body } as any);
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ errors: error.errors });
    logger.error({ err: error }, 'Error updating newsletter campaign:');
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// Send campaign
router.post('/newsletter-campaigns/:id/send', requireAdmin, async (req, res) => {
  try {
    const campaign = await storage.getNewsletterCampaign(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    if (campaign.status === 'sent') return res.status(400).json({ error: 'Campaign already sent' });

    const subscribers = await storage.getAllNewsletterSubscribers();
    if (subscribers.length === 0) {
      return res.status(400).json({ error: 'No subscribers to send to' });
    }

    const emailBody = generateBulkEmailHtml(campaign.subject, campaign.body);
    const bccList = subscribers.map(s => s.email).join(',');

    const success = await sendEmail({
      to: process.env.GMAIL_EMAIL || '',
      subject: campaign.subject,
      html: emailBody,
      bcc: bccList,
    });

    if (!success) {
      return res.status(500).json({ error: 'Failed to send campaign email' });
    }

    // Update campaign status
    await storage.markNewsletterCampaignSent(req.params.id, subscribers.length);

    await auditLog(
      req.user!.id,
      'CREATE',
      'NEWSLETTER_SEND',
      req.params.id,
      null,
      { subject: campaign.subject, recipientCount: subscribers.length },
      req.ip,
      req.get('User-Agent')
    );

    res.json({ success: true, recipientCount: subscribers.length });
  } catch (error) {
    logger.error({ err: error }, 'Error sending newsletter campaign:');
    res.status(500).json({ error: 'Failed to send campaign' });
  }
});

// Delete campaign
router.delete('/newsletter-campaigns/:id', requireAdmin, async (req, res) => {
  try {
    const campaign = await storage.getNewsletterCampaign(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    await storage.deleteNewsletterCampaign(req.params.id);

    await auditLog(
      req.user!.id,
      'DELETE',
      'NEWSLETTER_CAMPAIGN',
      req.params.id,
      { subject: campaign.subject },
      null,
      req.ip,
      req.get('User-Agent')
    );

    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting newsletter campaign:');
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

// ================================
// SUBSCRIPTION MANAGEMENT (ADMIN ONLY)
// ================================

// Grant or revoke premium subscription
router.patch('/users/:id/subscription', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = z.object({
      action: z.enum(['grant', 'revoke']),
    }).parse(req.body);

    const targetUser = await storage.getUser(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const oldData = {
      subscriptionTier: targetUser.subscriptionTier,
      subscriptionStatus: targetUser.subscriptionStatus,
    };

    if (action === 'grant') {
      const now = new Date();
      await storage.updateUserSubscription(id, {
        subscriptionTier: 'premium',
        subscriptionStatus: 'active',
        subscriptionStartDate: now,
        subscriptionEndDate: null,
        premiumGrantedBy: req.user!.id,
        premiumGrantedAt: now,
      });

      await storage.createSubscriptionRecord({
        userId: id,
        tier: 'premium',
        status: 'active',
        source: 'admin_grant',
        startDate: now,
        grantedByAdminId: req.user!.id,
        notes: `Premium granted by admin ${req.user!.email || req.user!.id}`,
      });
    } else {
      await storage.updateUserSubscription(id, {
        subscriptionTier: 'free',
        subscriptionStatus: 'none',
        subscriptionEndDate: new Date(),
      });

      await storage.createSubscriptionRecord({
        userId: id,
        tier: 'free',
        status: 'cancelled',
        source: 'admin_grant',
        startDate: new Date(),
        cancelledAt: new Date(),
        grantedByAdminId: req.user!.id,
        notes: `Premium revoked by admin ${req.user!.email || req.user!.id}`,
      });
    }

    const updatedUser = await storage.getUser(id);

    await auditLog(
      req.user!.id,
      action === 'grant' ? 'GRANT_PREMIUM' : 'REVOKE_PREMIUM',
      'USER',
      id,
      oldData,
      { subscriptionTier: updatedUser?.subscriptionTier, subscriptionStatus: updatedUser?.subscriptionStatus },
      req.ip,
      req.get('User-Agent')
    );

    res.json(updatedUser);
  } catch (error) {
    logger.error({ err: error }, 'Error updating subscription:');
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// Get subscription stats (with churn rate)
router.get('/subscription-stats', requireAdmin, async (req, res) => {
  try {
    const stats = await storage.getSubscriptionStatsWithChurn();
    res.json(stats);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching subscription stats:');
    res.status(500).json({ error: 'Failed to fetch subscription stats' });
  }
});

// List all users with subscription info (supports search)
router.get('/subscribers', requireAdmin, async (req, res) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const subscribers = await storage.getAllSubscribers(search);
    // Return relevant subscription fields
    const result = subscribers.map(u => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      subscriptionStatus: u.subscriptionStatus || 'none',
      subscriptionTier: u.subscriptionTier || 'free',
      subscriptionStartDate: u.subscriptionStartDate,
      subscriptionEndDate: u.subscriptionEndDate,
      stripeCustomerId: u.stripeCustomerId,
      createdAt: u.createdAt,
    }));
    res.json(result);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching subscribers:');
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// Admin manually update a user's subscription
router.patch('/subscribers/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const schema = z.object({
      status: z.enum(['active', 'cancelled', 'expired']),
      plan: z.string().min(1),
      endDate: z.string().nullable(),
    });
    const data = schema.parse(req.body);

    const oldUser = await storage.getUser(userId);
    if (!oldUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await storage.adminUpdateSubscription(userId, data);

    // Create a subscription history record
    await storage.createSubscriptionRecord({
      userId,
      tier: data.plan,
      status: data.status,
      source: 'manual',
      startDate: updatedUser.subscriptionStartDate || new Date(),
      endDate: data.endDate ? new Date(data.endDate) : null,
      grantedByAdminId: req.user!.id,
      notes: `Manual override by admin ${req.user!.email || req.user!.id}: status=${data.status}, plan=${data.plan}`,
    });

    await auditLog(
      req.user!.id,
      'UPDATE',
      'SUBSCRIPTION',
      userId,
      { subscriptionStatus: oldUser.subscriptionStatus, subscriptionTier: oldUser.subscriptionTier },
      { subscriptionStatus: data.status, subscriptionTier: data.plan },
      req.ip,
      req.get('User-Agent')
    );

    res.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    logger.error({ err: error }, 'Error updating subscriber:');
    res.status(500).json({ error: 'Failed to update subscriber' });
  }
});

// ================================
// TRUST STRUCTURE (ADMIN ONLY)
// ================================

// Get entire trust structure (entities + relationships)
router.get('/trust-structure', requireAdmin, async (req, res) => {
  try {
    const structure = await storage.getTrustStructure();
    res.json(structure);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching trust structure');
    res.status(500).json({ error: 'Failed to fetch trust structure' });
  }
});

// Seed trust structure with default data
router.post('/trust-structure/seed', requireAdmin, async (req, res) => {
  try {
    await storage.seedTrustStructure();
    const structure = await storage.getTrustStructure();
    res.json(structure);
  } catch (error) {
    logger.error({ err: error }, 'Error seeding trust structure');
    res.status(500).json({ error: 'Failed to seed trust structure' });
  }
});

// Create a trust entity
router.post('/trust-entities', requireAdmin, async (req, res) => {
  try {
    const data = insertTrustEntitySchema.parse(req.body);
    const entity = await storage.createTrustEntity(data);
    await auditLog(req.user!.id, 'CREATE', 'TRUST_ENTITY', entity.id, null, { name: entity.name, layer: entity.layer }, req.ip, req.headers['user-agent']);
    res.json(entity);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    logger.error({ err: error }, 'Error creating trust entity');
    res.status(500).json({ error: 'Failed to create trust entity' });
  }
});

// Update a trust entity
router.put('/trust-entities/:id', requireAdmin, async (req, res) => {
  try {
    const entity = await storage.updateTrustEntity(req.params.id, req.body);
    await auditLog(req.user!.id, 'UPDATE', 'TRUST_ENTITY', entity.id, null, { name: entity.name }, req.ip, req.headers['user-agent']);
    res.json(entity);
  } catch (error) {
    logger.error({ err: error }, 'Error updating trust entity');
    res.status(500).json({ error: 'Failed to update trust entity' });
  }
});

// Delete a trust entity
router.delete('/trust-entities/:id', requireAdmin, async (req, res) => {
  try {
    await storage.deleteTrustEntity(req.params.id);
    await auditLog(req.user!.id, 'DELETE', 'TRUST_ENTITY', req.params.id, null, null, req.ip, req.headers['user-agent']);
    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting trust entity');
    res.status(500).json({ error: 'Failed to delete trust entity' });
  }
});

// Create a trust relationship
router.post('/trust-relationships', requireAdmin, async (req, res) => {
  try {
    const data = insertTrustRelationshipSchema.parse(req.body);
    const rel = await storage.createTrustRelationship(data);
    res.json(rel);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    logger.error({ err: error }, 'Error creating trust relationship');
    res.status(500).json({ error: 'Failed to create trust relationship' });
  }
});

// Delete a trust relationship
router.delete('/trust-relationships/:id', requireAdmin, async (req, res) => {
  try {
    await storage.deleteTrustRelationship(req.params.id);
    res.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Error deleting trust relationship');
    res.status(500).json({ error: 'Failed to delete trust relationship' });
  }
});

export default router;
import { Router } from 'express';
import { storage } from './storage';
import { requireAuth, requireAdmin, requireModerator, requireInstructor, loadUser, auditLog } from './adminMiddleware';
import { 
  insertVideoSchema, 
  insertResourceSchema, 
  insertCourseSchema, 
  insertLessonSchema,
  insertForumCategorySchema,
  updateUserRoleSchema,
  insertPageContentSchema,
  updatePageContentSchema,
  insertDownloadSchema
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
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role
router.patch('/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = updateUserRoleSchema.parse(req.body);
    
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
    console.error('Error updating user role:', error);
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
    console.error('Error toggling user status:', error);
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
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
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
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Create video
router.post('/videos', requireInstructor, async (req, res) => {
  try {
    const videoData = insertVideoSchema.parse(req.body);
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
    console.error('Error creating video:', error);
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
    console.error('Error updating video:', error);
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
    console.error('Error toggling video status:', error);
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
    console.error('Error deleting video:', error);
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
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Create resource
router.post('/resources', requireInstructor, async (req, res) => {
  try {
    const resourceData = insertResourceSchema.parse(req.body);
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
    console.error('Error creating resource:', error);
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
    console.error('Error updating resource:', error);
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
    console.error('Error toggling resource status:', error);
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
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

// ================================
// COURSE MANAGEMENT (INSTRUCTOR+)
// ================================

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
    console.error('Error updating course:', error);
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
    console.error('Error toggling course status:', error);
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
    console.error('Error deleting course:', error);
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
    console.error('Error creating lesson:', error);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// Update lesson
router.patch('/lessons/:id', requireInstructor, async (req, res) => {
  try {
    const { id } = req.params;
    const lessonData = insertLessonSchema.partial().parse(req.body);
    
    const oldLesson = await storage.getCourseLessons('').then(lessons => lessons.find(l => l.id === id));
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
    console.error('Error updating lesson:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// Delete lesson
router.delete('/lessons/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const oldLesson = await storage.getCourseLessons('').then(lessons => lessons.find(l => l.id === id));
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
    console.error('Error deleting lesson:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
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
    console.error('Error creating forum category:', error);
    res.status(500).json({ error: 'Failed to create forum category' });
  }
});

// Update forum category
router.patch('/forum/categories/:id', requireModerator, async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = insertForumCategorySchema.partial().parse(req.body);
    
    const oldCategory = await storage.getForumCategories().then(cats => cats.find(c => c.id === id));
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
    console.error('Error updating forum category:', error);
    res.status(500).json({ error: 'Failed to update forum category' });
  }
});

// Delete forum category
router.delete('/forum/categories/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const oldCategory = await storage.getForumCategories().then(cats => cats.find(c => c.id === id));
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
    console.error('Error deleting forum category:', error);
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
    console.error('Error toggling thread pinned:', error);
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
    console.error('Error toggling thread locked:', error);
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
    console.error('Error deleting forum thread:', error);
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
    console.error('Error deleting forum reply:', error);
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
    console.error('Error fetching system stats:', error);
    res.status(500).json({ error: 'Failed to fetch system stats' });
  }
});

// Get recent activity audit log
router.get('/activity', requireAdmin, async (req, res) => {
  try {
    const activity = await storage.getRecentActivity();
    res.json(activity);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
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
    console.error('Error fetching page content:', error);
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
    console.error('Error fetching page content:', error);
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
    console.error('Error creating page content:', error);
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
    console.error('Error updating page content:', error);
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
    console.error('Error deleting page content:', error);
    res.status(500).json({ error: 'Failed to delete page content' });
  }
});

// ================================
// DOWNLOADS MANAGEMENT (ADMIN ONLY)
// ================================

router.get('/downloads', requireAdmin, async (req, res) => {
  try {
    const allDownloads = await storage.getAllDownloads();
    res.json(allDownloads);
  } catch (error) {
    console.error('Error fetching downloads:', error);
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
    console.error('Error fetching download:', error);
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

    res.json(download);
  } catch (error) {
    console.error('Error creating download:', error);
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
    console.error('Error updating download:', error);
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
    console.error('Error toggling download published:', error);
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
    console.error('Error deleting download:', error);
    res.status(500).json({ error: 'Failed to delete download' });
  }
});

export default router;
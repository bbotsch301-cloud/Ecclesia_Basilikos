import { Request, Response, NextFunction } from 'express';
import type { User } from '@shared/schema';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Middleware to check if user is authenticated
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Middleware to check if user has admin role
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

// Middleware to check if user has moderator or admin role
export const requireModerator = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (!['admin', 'moderator'].includes(req.user.role || '')) {
    return res.status(403).json({ error: 'Moderator access required' });
  }
  
  next();
};

// Middleware to check if user has instructor, moderator, or admin role
export const requireInstructor = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (!['admin', 'moderator', 'instructor'].includes(req.user.role || '')) {
    return res.status(403).json({ error: 'Instructor access required' });
  }
  
  next();
};

// Middleware to load user data into request
export const loadUser = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.userId) {
    try {
      const { storage } = await import('./storage');
      const user = await storage.getUser(req.session.userId);
      if (user) {
        req.user = user;
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }
  next();
};

// Audit logging helper
export const auditLog = async (
  adminId: string,
  action: string,
  entityType: string,
  entityId: string,
  oldData?: any,
  newData?: any,
  ipAddress?: string,
  userAgent?: string
) => {
  try {
    const { storage } = await import('./storage');
    await storage.createAuditLog({
      adminId,
      action,
      entityType,
      entityId,
      oldData: oldData ? JSON.stringify(oldData) : null,
      newData: newData ? JSON.stringify(newData) : null,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};
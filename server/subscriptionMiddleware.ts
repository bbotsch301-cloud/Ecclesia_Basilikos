import { Request, Response, NextFunction } from 'express';
import type { User } from '@shared/schema';

/**
 * Check if a user has premium access (premium subscriber or admin).
 */
export function isPremiumUser(user: User | undefined): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.subscriptionTier !== 'premium') return false;
  // Active subscriptions are always valid
  if (user.subscriptionStatus === 'active') return true;
  // Cancelled subscriptions retain access until end date
  if (user.subscriptionStatus === 'cancelled' && user.subscriptionEndDate) {
    return new Date() < new Date(user.subscriptionEndDate);
  }
  return false;
}

/**
 * Middleware: requires the user to have an active premium subscription or be an admin.
 * Must be used after authentication middleware (req.user must be populated).
 */
export const requireSubscription = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (isPremiumUser(req.user)) {
    return next();
  }

  return res.status(403).json({
    error: 'Premium subscription required',
    code: 'PREMIUM_REQUIRED',
  });
};

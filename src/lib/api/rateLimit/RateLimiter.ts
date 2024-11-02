import { RATE_LIMIT_CONFIG } from './config';

interface RateLimit {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

export class RateLimiter {
  private static limits = new Map<string, RateLimit>();

  static checkLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.limits.get(userId);

    // Clear expired rate limits and blocks
    if (userLimit) {
      if (userLimit.blockedUntil && now > userLimit.blockedUntil) {
        this.limits.delete(userId);
      } else if (now > userLimit.resetTime) {
        this.limits.delete(userId);
      }
    }

    // Check if user is blocked
    if (userLimit?.blockedUntil && now < userLimit.blockedUntil) {
      return false;
    }

    // Initialize new rate limit
    if (!userLimit || now > userLimit.resetTime) {
      this.limits.set(userId, {
        count: 1,
        resetTime: now + RATE_LIMIT_CONFIG.WINDOW_MS
      });
      return true;
    }

    // Check if limit exceeded
    if (userLimit.count >= RATE_LIMIT_CONFIG.MAX_REQUESTS) {
      // Block user for the configured duration
      this.limits.set(userId, {
        ...userLimit,
        blockedUntil: now + RATE_LIMIT_CONFIG.BLOCK_DURATION_MS
      });
      return false;
    }

    // Increment counter
    userLimit.count += 1;
    this.limits.set(userId, userLimit);
    return true;
  }

  static getRemainingRequests(userId: string): number {
    const now = Date.now();
    const userLimit = this.limits.get(userId);
    
    if (!userLimit || now > userLimit.resetTime) {
      return RATE_LIMIT_CONFIG.MAX_REQUESTS;
    }
    
    return Math.max(0, RATE_LIMIT_CONFIG.MAX_REQUESTS - userLimit.count);
  }

  static getTimeUntilReset(userId: string): number | null {
    const userLimit = this.limits.get(userId);
    if (!userLimit) return null;
    
    const now = Date.now();
    if (userLimit.blockedUntil && now < userLimit.blockedUntil) {
      return userLimit.blockedUntil - now;
    }
    return userLimit.resetTime - now;
  }
}
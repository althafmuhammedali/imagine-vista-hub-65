import { RATE_LIMIT_CONFIG } from './config';
import { toast } from "@/components/ui/use-toast";

interface RateLimit {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

interface RateLimitStore {
  [key: string]: RateLimit;
}

export class RateLimiter {
  private static limits = new Map<string, RateLimit>();
  private static cleanupInterval: NodeJS.Timeout | null = null;

  static {
    // Initialize from localStorage
    try {
      const stored = localStorage.getItem(RATE_LIMIT_CONFIG.STORAGE_KEY);
      if (stored) {
        const data: RateLimitStore = JSON.parse(stored);
        Object.entries(data).forEach(([userId, limit]) => {
          this.limits.set(userId, limit);
        });
      }
    } catch (error) {
      console.error('Failed to load rate limit data:', error);
    }

    // Start cleanup interval
    this.startCleanup();
  }

  private static startCleanup() {
    if (this.cleanupInterval) return;
    
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      let changed = false;

      for (const [userId, limit] of this.limits.entries()) {
        if ((limit.blockedUntil && now > limit.blockedUntil) || now > limit.resetTime) {
          this.limits.delete(userId);
          changed = true;
        }
      }

      if (changed) {
        this.persistToStorage();
      }
    }, RATE_LIMIT_CONFIG.CLEANUP_INTERVAL_MS);
  }

  private static persistToStorage() {
    try {
      const data: RateLimitStore = {};
      this.limits.forEach((limit, userId) => {
        data[userId] = limit;
      });
      localStorage.setItem(RATE_LIMIT_CONFIG.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist rate limit data:', error);
    }
  }

  static checkLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.limits.get(userId);

    // Check if user is blocked
    if (userLimit?.blockedUntil && now < userLimit.blockedUntil) {
      const remainingTime = Math.ceil((userLimit.blockedUntil - now) / 1000);
      toast({
        title: "Access Blocked",
        description: `Please wait ${remainingTime} seconds before trying again.`,
        variant: "destructive"
      });
      return false;
    }

    // Initialize new rate limit or reset expired one
    if (!userLimit || now > userLimit.resetTime) {
      this.limits.set(userId, {
        count: 1,
        resetTime: now + RATE_LIMIT_CONFIG.WINDOW_MS
      });
      this.persistToStorage();
      return true;
    }

    // Check if limit exceeded
    if (userLimit.count >= RATE_LIMIT_CONFIG.MAX_REQUESTS) {
      const blockedUntil = now + RATE_LIMIT_CONFIG.BLOCK_DURATION_MS;
      this.limits.set(userId, {
        ...userLimit,
        blockedUntil
      });
      this.persistToStorage();
      
      toast({
        title: "Rate Limit Exceeded",
        description: `Too many requests. You've been blocked for ${RATE_LIMIT_CONFIG.BLOCK_DURATION_MS / 60000} minutes.`,
        variant: "destructive"
      });
      return false;
    }

    // Increment counter
    userLimit.count += 1;
    this.limits.set(userId, userLimit);
    this.persistToStorage();
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

  static cleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}
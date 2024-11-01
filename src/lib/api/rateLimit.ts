import { RateLimitInfo } from './types';
import { API_CONFIG } from './constants';

const rateLimitStore = new Map<string, RateLimitInfo>();

export const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(userId, {
      count: 1,
      resetTime: now + API_CONFIG.RATE_WINDOW
    });
    return true;
  }

  if (userLimit.count >= API_CONFIG.RATE_LIMIT) {
    return false;
  }

  userLimit.count += 1;
  rateLimitStore.set(userId, userLimit);
  return true;
};
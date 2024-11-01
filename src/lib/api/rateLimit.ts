const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // Reduced from 10 to 5 requests per window
const RATE_WINDOW = 60000; // 1 minute in milliseconds

export const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(userId, {
      count: 1,
      resetTime: now + RATE_WINDOW
    });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count += 1;
  rateLimitStore.set(userId, userLimit);
  return true;
};

export const getRemainingRequests = (userId: string): number => {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    return RATE_LIMIT;
  }
  
  return Math.max(0, RATE_LIMIT - userLimit.count);
};

export const getResetTime = (userId: string): number | null => {
  const userLimit = rateLimitStore.get(userId);
  return userLimit ? userLimit.resetTime : null;
};
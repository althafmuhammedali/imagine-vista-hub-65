const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);

  // Clear expired rate limits
  if (userLimit && now > userLimit.resetTime) {
    rateLimitStore.delete(userId);
  }

  // Initialize new rate limit
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(userId, {
      count: 1,
      resetTime: now + 60000 // 1 minute window
    });
    return true;
  }

  // Check if limit exceeded
  if (userLimit.count >= 10) { // Increased to 10 requests per minute
    return false;
  }

  // Increment counter
  userLimit.count += 1;
  rateLimitStore.set(userId, userLimit);
  return true;
};

export const getRemainingRequests = (userId: string): number => {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    return 10; // Increased limit
  }
  
  return Math.max(0, 10 - userLimit.count);
};

export const getResetTime = (userId: string): number | null => {
  const userLimit = rateLimitStore.get(userId);
  return userLimit ? userLimit.resetTime : null;
};
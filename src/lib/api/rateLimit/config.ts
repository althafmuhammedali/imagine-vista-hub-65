export const RATE_LIMIT_CONFIG = {
  MAX_REQUESTS: 1000, // Increased from 10
  WINDOW_MS: 60000 * 60, // 1 hour window instead of 1 minute
  BLOCK_DURATION_MS: 60000, // Reduced block duration to 1 minute
  CLEANUP_INTERVAL_MS: 300000, // 5 minutes
  STORAGE_KEY: 'rate_limit_data'
};
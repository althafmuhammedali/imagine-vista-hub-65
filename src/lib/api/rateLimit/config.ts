export const RATE_LIMIT_CONFIG = {
  MAX_REQUESTS: 10000, // Increased significantly for heavy usage
  WINDOW_MS: 60000 * 60 * 24, // 24 hour window
  BLOCK_DURATION_MS: 30000, // Reduced block duration to 30 seconds
  CLEANUP_INTERVAL_MS: 300000, // 5 minutes
  STORAGE_KEY: 'rate_limit_data'
};
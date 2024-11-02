export const RATE_LIMIT_CONFIG = {
  MAX_REQUESTS: 10,
  WINDOW_MS: 60000, // 1 minute
  BLOCK_DURATION_MS: 60000 * 5, // 5 minutes
  CLEANUP_INTERVAL_MS: 300000, // 5 minutes
  STORAGE_KEY: 'rate_limit_data'
};
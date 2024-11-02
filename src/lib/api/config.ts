export const MODELS = {
  PRIMARY: "black-forest-labs/FLUX.1-schnell", // Only using the primary model now
};

export const MAX_RETRIES = 3;
export const TIMEOUT_DURATION = 180000; // 3 minutes
export const INITIAL_RETRY_DELAY = 1000;
export const RATE_LIMIT = 10; // requests per window
export const RATE_WINDOW = 60000; // 1 minute in milliseconds
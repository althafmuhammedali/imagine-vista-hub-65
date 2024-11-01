export const MODELS = {
  PRIMARY: "stabilityai/stable-diffusion-xl-base-1.0",
  FALLBACK: "runwayml/stable-diffusion-v1-5",
};

export const MAX_RETRIES = 3;
export const TIMEOUT_DURATION = 180000; // 3 minutes
export const INITIAL_RETRY_DELAY = 1000;
export const RATE_LIMIT = 10; // requests per window
export const RATE_WINDOW = 60000; // 1 minute in milliseconds
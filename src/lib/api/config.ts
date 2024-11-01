export const MODELS = {
  PRIMARY: "runwayml/stable-diffusion-v1-5", // Free model
  FALLBACK: "CompVis/stable-diffusion-v1-4", // Free backup model
};

export const MAX_RETRIES = 3;
export const TIMEOUT_DURATION = 180000; // 3 minutes
export const INITIAL_RETRY_DELAY = 1000;
export const RATE_LIMIT = 10; // requests per window
export const RATE_WINDOW = 60000; // 1 minute in milliseconds
export const API_ENDPOINTS = {
  PRIMARY: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
  FALLBACK: "runwayml/stable-diffusion-v1-4"
};

export const API_CONFIG = {
  MAX_RETRIES: 3,
  TIMEOUT_DURATION: 180000, // 3 minutes
  INITIAL_RETRY_DELAY: 1000,
  RATE_LIMIT: 10,
  RATE_WINDOW: 60000 // 1 minute
};
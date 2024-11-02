export const API_ENDPOINTS = {
  PRIMARY: "stabilityai/stable-diffusion-xl-base-1.0",
  FALLBACK: "runwayml/stable-diffusion-v1-5",
};

export const API_CONFIG = {
  MAX_RETRIES: 3,
  TIMEOUT_DURATION: 90000,
  INITIAL_RETRY_DELAY: 500,
  RATE_LIMIT: {
    MAX_REQUESTS: 5, // Maximum requests per time window
    TIME_WINDOW: 3600000, // 1 hour in milliseconds
    FREE_TIER_MAX: 5, // Maximum images for free tier users
  },
  DEFAULT_PARAMS: {
    num_inference_steps: 30, // Optimized for speed while maintaining quality
    guidance_scale: 7.5,
    scheduler: "EulerAncestralDiscreteScheduler", // Faster scheduler
    use_karras_sigmas: true,
    clip_skip: 2,
    tiling: false,
    use_safetensors: true,
    options: {
      wait_for_model: true,
      use_gpu: true
    }
  }
};

export const ERROR_MESSAGES = {
  RATE_LIMIT_EXCEEDED: "You have reached your image generation limit. Please try again later or upgrade your plan.",
  MISSING_API_KEY: "API key is missing. Please check your environment variables.",
  TIMEOUT: "Request timed out. Please try again with a simpler prompt.",
  EMPTY_PROMPT: "Please enter a prompt before generating.",
  SHORT_PROMPT: "Prompt must be at least 3 characters long.",
  GENERATION_FAILED: "Failed to generate image. Please try again.",
  MODEL_LOADING: "Model is still loading. Please wait...",
  INVALID_RESPONSE: "Received invalid response from the server.",
  RATE_LIMIT: "Too many requests. Please wait before trying again.",
};

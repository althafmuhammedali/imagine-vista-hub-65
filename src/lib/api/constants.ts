export const API_ENDPOINTS = {
  PRIMARY: "black-forest-labs/FLUX.1-dev",
  FALLBACK: "runwayml/stable-diffusion-v1-5"
};

export const API_CONFIG = {
  MAX_RETRIES: 1, // Reduced retries to speed up error responses
  TIMEOUT_DURATION: 20000, // Further reduced timeout to 20 seconds
  INITIAL_RETRY_DELAY: 100, // Faster retry attempts
  RATE_LIMIT: {
    MAX_REQUESTS: Infinity,
    TIME_WINDOW: 3600000,
    FREE_TIER_MAX: Infinity,
  },
  GENERATION_PARAMS: {
    num_inference_steps: 8, // Reduced steps for faster generation
    guidance_scale: 7.0, // Slightly reduced for speed
    scheduler: "LMSDiscreteScheduler", // Even faster scheduler
    use_karras_sigmas: false, // Disabled for speed
    clip_skip: 1, // Reduced for speed
    tiling: false,
    use_safetensors: true,
    options: {
      wait_for_model: false,
      use_gpu: true,
      max_memory: {
        'free': 0.8, // Use 80% of available memory for faster processing
      }
    }
  }
};

export const ERROR_MESSAGES = {
  MISSING_API_KEY: "API key is missing. Please check your environment variables.",
  TIMEOUT: "Request timed out. Please try again with a simpler prompt.",
  EMPTY_PROMPT: "Please enter a prompt before generating.",
  SHORT_PROMPT: "Prompt must be at least 3 characters long.",
  GENERATION_FAILED: "Failed to generate image. Please try again.",
  MODEL_LOADING: "Model is still loading. Please wait...",
  INVALID_RESPONSE: "Received invalid response from the server.",
  RATE_LIMIT: "Too many requests. Please wait before trying again.",
};
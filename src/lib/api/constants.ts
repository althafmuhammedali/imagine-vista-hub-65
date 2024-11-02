export const API_ENDPOINTS = {
  PRIMARY: "black-forest-labs/FLUX.1-dev",
  FALLBACK: "runwayml/stable-diffusion-v1-5"
};

export const API_CONFIG = {
  MAX_RETRIES: 3,
  TIMEOUT_DURATION: 60000, // Reduced from 90000 to 60000 for faster timeout
  INITIAL_RETRY_DELAY: 500,
  RATE_LIMIT: {
    MAX_REQUESTS: Infinity,
    TIME_WINDOW: 3600000,
    FREE_TIER_MAX: Infinity,
  },
  GENERATION_PARAMS: {
    num_inference_steps: 20, // Reduced from 30 for faster generation
    guidance_scale: 8.5, // Increased from 7.5 for better quality
    scheduler: "DPMSolverMultistepScheduler", // Changed to faster scheduler
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
  MISSING_API_KEY: "API key is missing. Please check your environment variables.",
  TIMEOUT: "Request timed out. Please try again with a simpler prompt.",
  EMPTY_PROMPT: "Please enter a prompt before generating.",
  SHORT_PROMPT: "Prompt must be at least 3 characters long.",
  GENERATION_FAILED: "Failed to generate image. Please try again.",
  MODEL_LOADING: "Model is still loading. Please wait...",
  INVALID_RESPONSE: "Received invalid response from the server.",
  RATE_LIMIT: "Too many requests. Please wait before trying again.",
};
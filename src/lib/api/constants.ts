export const API_ENDPOINTS = {
  PRIMARY: "black-forest-labs/FLUX.1-dev",
  FALLBACK: "runwayml/stable-diffusion-v1-5"
};

export const API_CONFIG = {
  MAX_RETRIES: 2,
  TIMEOUT_DURATION: 180000, // 3 minutes
  INITIAL_RETRY_DELAY: 1000,
  RATE_LIMIT: {
    MAX_REQUESTS: Infinity,
    TIME_WINDOW: 3600000,
    FREE_TIER_MAX: Infinity,
  },
  GENERATION_PARAMS: {
    num_inference_steps: 100,
    guidance_scale: 12.0,
    scheduler: "EulerAncestralDiscreteScheduler",
    use_karras_sigmas: true,
    clip_skip: 2,
    tiling: false,
    use_safetensors: true,
    options: {
      wait_for_model: false,
      use_gpu: true,
      max_memory: {
        'free': 0.99,
      },
      enable_cuda_graph: true,
      torch_compile: true,
      enable_vae_slicing: true,
      enable_vae_tiling: true,
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
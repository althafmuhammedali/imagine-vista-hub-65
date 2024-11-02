export const API_ENDPOINTS = {
  PRIMARY: "stabilityai/stable-diffusion-xl-base-1.0",
  FALLBACK: "stabilityai/stable-diffusion-xl-refiner-1.0"
};

export const API_CONFIG = {
  MAX_RETRIES: 2,
  TIMEOUT_DURATION: 240000, // Increased to 4 minutes for higher quality processing
  INITIAL_RETRY_DELAY: 1000,
  RATE_LIMIT: {
    MAX_REQUESTS: Infinity,
    TIME_WINDOW: 3600000,
    FREE_TIER_MAX: Infinity,
  },
  GENERATION_PARAMS: {
    num_inference_steps: 30, // Optimized steps
    guidance_scale: 9.5, // Enhanced quality
    scheduler: "EulerAncestralDiscreteScheduler",
    tiling: true,
    use_safetensors: true,
    options: {
      wait_for_model: false,
      use_gpu: true,
      max_memory: {
        'cuda': 0.99, // Maximum GPU utilization
        'cpu': 0.8
      },
      enable_cuda_graph: true,
      torch_compile: true,
      enable_vae_slicing: true,
      enable_vae_tiling: true,
      cross_attention_optimization: true,
      refiner_steps: 10 // Added refiner steps for extra quality
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
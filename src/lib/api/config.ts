export const API_CONFIG = {
  MAX_RETRIES: 3,
  TIMEOUT_DURATION: 180000, // 3 minutes
  INITIAL_RETRY_DELAY: 1000,
  RATE_LIMIT: 10,
  RATE_WINDOW: 60000,
  GENERATION_PARAMS: {
    num_inference_steps: 30, // Optimized for faster generation
    guidance_scale: 9.5, // Increased for better quality
    scheduler: "DPMSolverMultistepScheduler", // Best balance of speed and quality
    tiling: true,
    use_safetensors: true,
    options: {
      wait_for_model: true,
      use_gpu: true,
      max_memory: {
        'cuda': 0.99, // Maximum GPU utilization
        'cpu': 0.8
      },
      torch_compile: true,
      enable_vae_slicing: true,
      enable_vae_tiling: true,
      cross_attention_optimization: true,
      enable_cuda_graph: true
    }
  }
};

export const API_ENDPOINTS = {
  PRIMARY: "stabilityai/stable-diffusion-xl-base-1.0",
  FALLBACK: "stabilityai/stable-diffusion-xl-refiner-1.0" // Added SDXL refiner for higher quality
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
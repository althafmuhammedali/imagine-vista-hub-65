export const API_ENDPOINTS = {
  PRIMARY: "stabilityai/stable-diffusion-xl-base-1.0",
  FALLBACK: "runwayml/stable-diffusion-v1-5"
};

export const API_CONFIG = {
  MAX_RETRIES: 2,
  TIMEOUT_DURATION: 180000, // 3 minutes - balanced for speed and quality
  INITIAL_RETRY_DELAY: 1000,
  RATE_LIMIT: {
    MAX_REQUESTS: Infinity,
    TIME_WINDOW: 3600000,
    FREE_TIER_MAX: Infinity,
  },
  GENERATION_PARAMS: {
    num_inference_steps: 100, // Balanced for speed and quality
    guidance_scale: 10.0, // Strong prompt adherence while maintaining speed
    scheduler: "EulerAncestralDiscreteScheduler", // Fastest high-quality scheduler
    use_karras_sigmas: true, // Enhanced sampling
    clip_skip: 2, // Optimal for better prompt understanding
    tiling: false,
    use_safetensors: true,
    options: {
      wait_for_model: false, // Don't wait for model loading
      use_gpu: true,
      max_memory: {
        'free': 0.99, // Using maximum available memory
      },
      enable_cuda_graph: true, // Enable CUDA optimization
      torch_compile: true, // Enable PyTorch 2.0 compilation
      enable_vae_slicing: true, // Enable VAE slicing for faster processing
      enable_vae_tiling: true, // Enable VAE tiling for parallel processing
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
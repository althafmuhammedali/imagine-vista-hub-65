export const API_ENDPOINTS = {
  PRIMARY: "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"
};

export const API_CONFIG = {
  MAX_RETRIES: 2,
  TIMEOUT_DURATION: 45000, // 45 seconds - balanced timeout
  INITIAL_RETRY_DELAY: 300,
  RATE_LIMIT: {
    MAX_REQUESTS: 50,
    TIME_WINDOW: 3600000, // 1 hour
  },
  GENERATION_PARAMS: {
    num_inference_steps: 25, // Increased steps for better quality
    guidance_scale: 8.5, // Higher guidance scale for better adherence to prompt
    scheduler: "DDIMScheduler",
    tiling: false,
    use_safetensors: true,
    options: {
      wait_for_model: true,
      use_gpu: true,
      max_memory: {
        'cuda': 0.9, // Increased GPU memory allocation
        'cpu': 0.7  // Increased CPU memory allocation
      },
      torch_compile: true,
      enable_vae_slicing: true,
      enable_vae_tiling: false,
      cross_attention_optimization: true,
      enable_cuda_graph: true
    }
  }
};

export const ERROR_MESSAGES = {
  MISSING_API_KEY: "Our servers are experiencing configuration issues. We're working on it!",
  TIMEOUT: "The request took too long to process. Please try again with a simpler prompt.",
  EMPTY_PROMPT: "Please enter a prompt before generating.",
  SHORT_PROMPT: "Prompt must be at least 3 characters long.",
  GENERATION_FAILED: "Our servers are currently experiencing high load. Please try again in a few minutes.",
  MODEL_LOADING: "Our servers are warming up. Please try again in a moment...",
  INVALID_RESPONSE: "Something went wrong on our end. Please try again.",
  RATE_LIMIT: "You've reached the maximum number of requests. Please wait a moment before trying again.",
};
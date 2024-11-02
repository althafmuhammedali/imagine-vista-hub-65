export const API_ENDPOINTS = {
  PRIMARY: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev"
};

export const API_CONFIG = {
  MAX_RETRIES: 2,
  TIMEOUT_DURATION: 60000, // Reduced to 1 minute
  INITIAL_RETRY_DELAY: 300, // Further reduced retry delay
  RATE_LIMIT: {
    MAX_REQUESTS: 50,
    TIME_WINDOW: 3600000, // 1 hour
  },
  GENERATION_PARAMS: {
    num_inference_steps: 15, // Further reduced steps while maintaining quality
    guidance_scale: 7.0, // Slightly reduced for faster generation
    scheduler: "DPMSolverMultistepScheduler",
    tiling: true,
    use_safetensors: true,
    options: {
      wait_for_model: true,
      use_gpu: true,
      max_memory: {
        'cuda': 0.99,
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
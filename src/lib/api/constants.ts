export const API_ENDPOINTS = {
  PRIMARY: "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"
};

export const API_CONFIG = {
  MAX_RETRIES: 2,
  TIMEOUT_DURATION: 30000, // 30 seconds
  INITIAL_RETRY_DELAY: 300,
  RATE_LIMIT: {
    MAX_REQUESTS: 50,
    TIME_WINDOW: 3600000, // 1 hour
  },
  GENERATION_PARAMS: {
    num_inference_steps: 20,
    guidance_scale: 7.5,
    scheduler: "DDIMScheduler",
    tiling: false,
    use_safetensors: true,
    options: {
      wait_for_model: true,
      use_gpu: true,
      max_memory: {
        'cuda': 0.8,
        'cpu': 0.6
      },
      torch_compile: false,
      enable_vae_slicing: true,
      enable_vae_tiling: false,
      cross_attention_optimization: false,
      enable_cuda_graph: false
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
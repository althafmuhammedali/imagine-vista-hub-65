export const API_ENDPOINTS = {
  PRIMARY: "stabilityai/stable-diffusion-xl-base-1.0",
  FALLBACK: "runwayml/stable-diffusion-v1-5",
};

export const API_CONFIG = {
  MAX_RETRIES: 3,
  TIMEOUT_DURATION: 90000, // Reduced from 180s to 90s for faster feedback
  INITIAL_RETRY_DELAY: 500, // Reduced from 1000ms to 500ms
  RATE_LIMIT: 10, // Increased from 5 to 10 requests per minute
  RATE_WINDOW: 60000,
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

export const PROMPT_ENHANCERS = {
  QUALITY: "masterpiece, best quality, highly detailed",
  LIGHTING: "studio lighting, dramatic lighting",
  CAMERA: "8k uhd, dslr",
  STYLE: "trending on artstation"
};
export const API_ENDPOINTS = {
  PRIMARY: "stabilityai/stable-diffusion-xl-base-1.0",
  FALLBACK: "runwayml/stable-diffusion-v1-5",
  ENHANCED: "stabilityai/stable-diffusion-xl-refiner-1.0"
};

export const API_CONFIG = {
  MAX_RETRIES: 3,
  TIMEOUT_DURATION: 180000, // 3 minutes
  INITIAL_RETRY_DELAY: 1000,
  RATE_LIMIT: 5,
  RATE_WINDOW: 60000, // 1 minute
  DEFAULT_PARAMS: {
    num_inference_steps: 50, // Increased from 30 for better quality
    guidance_scale: 8.5, // Increased from 7.5 for stronger prompt adherence
    scheduler: "DPMSolverMultistepScheduler",
    use_karras_sigmas: true,
    clip_skip: 2,
    tiling: false,
    use_safetensors: true,
  }
};

export const PROMPT_ENHANCERS = {
  QUALITY: "masterpiece, best quality, highly detailed, ultra detailed, professional",
  LIGHTING: "studio lighting, dramatic lighting, cinematic",
  CAMERA: "8k uhd, dslr, soft focus, high resolution, detailed",
  STYLE: "trending on artstation, award winning, professional"
};
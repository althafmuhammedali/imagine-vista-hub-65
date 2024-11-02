export const API_ENDPOINTS = {
  PRIMARY: "black-forest-labs/FLUX.1-dev",
  FALLBACK: "runwayml/stable-diffusion-v1-5",
};

export const API_CONFIG = {
  MAX_RETRIES: 3,
  TIMEOUT_DURATION: 180000, // 3 minutes
  INITIAL_RETRY_DELAY: 1000,
  RATE_LIMIT: 10, // 10 requests per minute
  RATE_WINDOW: 60000, // Changed to 1 minute (60000ms)
  DEFAULT_PARAMS: {
    num_inference_steps: 50,
    guidance_scale: 8.5,
    scheduler: "DPMSolverMultistepScheduler",
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
  QUALITY: "masterpiece, best quality, highly detailed, ultra-detailed, professional",
  LIGHTING: "studio lighting, dramatic lighting, volumetric lighting",
  CAMERA: "8k uhd, dslr, high resolution",
  STYLE: "trending on artstation, award winning"
};
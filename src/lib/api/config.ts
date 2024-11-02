export const API_CONFIG = {
  MAX_RETRIES: 3,
  TIMEOUT_DURATION: 180000, // 3 minutes
  INITIAL_RETRY_DELAY: 1000,
  RATE_LIMIT: 10,
  RATE_WINDOW: 60000,
  GENERATION_PARAMS: {
    num_inference_steps: 50, // Increased from 30 for better quality
    guidance_scale: 8.5, // Increased from 7.5 for better prompt adherence
    scheduler: "DPMSolverMultistepScheduler", // Better quality scheduler
    use_karras_sigmas: true,
    clip_skip: 1, // Changed from 2 for better quality
    tiling: false,
    use_safetensors: true,
    options: {
      wait_for_model: true,
      use_gpu: true
    }
  }
};

export const API_ENDPOINTS = {
  PRIMARY: "stabilityai/stable-diffusion-xl-base-1.0",
  FALLBACK: "runwayml/stable-diffusion-v1-5"
};
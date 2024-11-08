export const API_CONFIG = {
  BASE_URL: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
  TIMEOUT: 120000, // Reduced to 2 minutes for faster response
  HEADERS: {
    "Content-Type": "application/json",
    "Authorization": "Bearer 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",
  },
  DEFAULT_PARAMS: {
    num_inference_steps: 30, // Reduced steps for faster generation
    guidance_scale: 7.5,
    scheduler: "DPMSolverMultistepScheduler",
    use_karras_sigmas: true,
    clip_skip: 2,
    tiling: false,
    use_safetensors: true,
    quality: 100, // Maximum quality
    options: {
      wait_for_model: true,
      use_gpu: true,
      timeout: 30000, // 30 seconds model timeout
    }
  }
};
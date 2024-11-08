export const API_CONFIG = {
  BASE_URL: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
  TIMEOUT: 180000, // 3 minutes
  HEADERS: {
    "Content-Type": "application/json",
    "Authorization": "Bearer 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",
  },
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
      use_gpu: true,
      timeout: 60000, // 60 seconds model timeout
    }
  }
};
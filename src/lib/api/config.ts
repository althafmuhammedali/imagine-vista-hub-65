export const API_CONFIG = {
  BASE_URL: "https://api-inference.huggingface.co/models",
  TIMEOUT: 90000, // 90 seconds
  HEADERS: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
  },
  DEFAULT_PARAMS: {
    num_inference_steps: 50,
    guidance_scale: 7.5,
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
  },
  RATE_LIMIT: {
    MAX_REQUESTS_PER_MINUTE: 10,
    COOLDOWN_PERIOD: 60000, // 1 minute in milliseconds
  }
};
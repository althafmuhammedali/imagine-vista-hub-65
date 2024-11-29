export const API_CONFIG = {
  BASE_URL: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
  TIMEOUT: 180000, // 3 minutes
  HEADERS: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
  },
  DEFAULT_PARAMS: {
    num_inference_steps: 20,
    guidance_scale: 7.5,
    scheduler: "DPMSolverMultistepScheduler",
    use_karras_sigmas: true,
    clip_skip: 1,
    tiling: false,
    use_safetensors: true,
    options: {
      wait_for_model: true,
      use_gpu: true,
      quality: "maximum",
      stream_output: true
    }
  }
};
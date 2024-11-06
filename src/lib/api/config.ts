export const API_CONFIG = {
  BASE_URL: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
  TIMEOUT: 90000, // Reduced to 90 seconds for faster timeout
  HEADERS: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
  },
  DEFAULT_PARAMS: {
    num_inference_steps: 30, // Reduced steps for faster generation
    guidance_scale: 7.5, // Optimized for speed/quality balance
    scheduler: "DPMSolverMultistepScheduler", // Faster scheduler
    use_karras_sigmas: true,
    clip_skip: 1,
    tiling: false,
    use_safetensors: true,
    options: {
      wait_for_model: false, // Don't wait for model to load
      use_gpu: true,
      stream_progress: true // Enable progress streaming
    }
  }
};
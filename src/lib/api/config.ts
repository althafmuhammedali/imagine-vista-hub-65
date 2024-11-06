export const API_CONFIG = {
  BASE_URL: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
  TIMEOUT: 90000,
  HEADERS: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
  },
  DEFAULT_PARAMS: {
    num_inference_steps: 150,
    guidance_scale: 12.5,
    scheduler: "DPMSolverMultistepScheduler",
    use_karras_sigmas: true,
    clip_skip: 1,
    tiling: false,
    use_safetensors: true,
    denoising_strength: 1.0,
    aesthetic_score: 9.0,
    negative_aesthetic_score: 2.5,
    options: {
      wait_for_model: true,
      use_gpu: true,
      stream_progress: true
    }
  }
};
export const API_CONFIG = {
  BASE_URL: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
  TIMEOUT: 180000, // 3 minutes
  HEADERS: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
    "Cache-Control": "no-cache",
    "Pragma": "no-cache"
  },
  DEFAULT_PARAMS: {
    num_inference_steps: 30,
    guidance_scale: 7.5,
    scheduler: "DPMSolverMultistepScheduler",
    use_karras_sigmas: true,
    clip_skip: 1,
    tiling: false,
    use_safetensors: true,
    image_format: "png",
    output_format: "png",
    high_noise_frac: 0.8,
    options: {
      wait_for_model: true,
      use_gpu: true,
      quality: "maximum",
      stream_output: false,
      use_cache: false
    }
  }
};
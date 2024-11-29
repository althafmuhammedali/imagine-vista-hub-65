export const API_CONFIG = {
  BASE_URL: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
  TIMEOUT: 180000, // 3 minutes
  HEADERS: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
  },
  DEFAULT_PARAMS: {
    num_inference_steps: 20, // Reduced for faster generation
    guidance_scale: 7.5, // Optimized for better speed/quality balance
    scheduler: "DPMSolverMultistepScheduler", // Faster scheduler
    use_karras_sigmas: true,
    clip_skip: 1,
    tiling: false,
    use_safetensors: true,
    options: {
      wait_for_model: true,
      use_gpu: true,
      quality: "maximum", // Set to maximum quality
      stream_output: true // Enable streaming for faster initial display
    }
  }
};
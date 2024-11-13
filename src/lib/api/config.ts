export const API_CONFIG = {
  BASE_URL: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
  TIMEOUT: 180000, // 3 minutes
  HEADERS: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
  },
  DEFAULT_PARAMS: {
    num_inference_steps: 30, // Reduced from 150 for faster generation while maintaining quality
    guidance_scale: 12, // Increased from 9.5 for better quality
    scheduler: "EulerAncestralDiscreteScheduler", // Changed to faster scheduler
    use_karras_sigmas: true,
    clip_skip: 2, // Optimized for better prompt understanding
    tiling: false,
    use_safetensors: true,
    options: {
      wait_for_model: true,
      use_gpu: true,
      quality: "balanced", // Changed from maximum to balanced for better speed/quality ratio
      stream_output: true // Enable streaming for faster initial display
    }
  }
};
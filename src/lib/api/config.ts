export const API_CONFIG = {
  BASE_URL: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
  TIMEOUT: 180000, // 3 minutes
  HEADERS: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
  },
  DEFAULT_PARAMS: {
    num_inference_steps: 50, // Increased from 30 for better quality
    guidance_scale: 8.5, // Increased from 7.5 for more realistic adherence to prompt
    scheduler: "EulerAncestralDiscreteScheduler", // Changed for better quality
    use_karras_sigmas: true,
    clip_skip: 1, // Changed from 2 for better semantic understanding
    tiling: false,
    use_safetensors: true,
    options: {
      wait_for_model: true,
      use_gpu: true
    }
  }
};
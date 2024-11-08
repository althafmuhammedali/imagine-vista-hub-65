export const API_CONFIG = {
  BASE_URL: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
  TIMEOUT: 180000, // 3 minutes
  HEADERS: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
  },
  DEFAULT_PARAMS: {
    num_inference_steps: 30,
    guidance_scale: 7.5,
    negative_prompt: "blurry, bad quality, distorted, disfigured",
    width: 1024,
    height: 1024,
    options: {
      wait_for_model: true,
      use_gpu: true,
      timeout: 60000, // 60 seconds model timeout
    }
  }
};

export const API_CONFIG = {
  BASE_URL: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
  HEADERS: {
    "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
    "Content-Type": "application/json",
  },
  TIMEOUT: 180000, // 3 minutes
  DEFAULT_PARAMS: {
    num_inference_steps: 50,
    guidance_scale: 7.5,
    scheduler: "DPMSolverMultistep",
    safetensor: true,
  },
  DEFAULT_MODEL: "stabilityai/stable-diffusion-xl-base-1.0",
  FALLBACK_MODEL: "runwayml/stable-diffusion-v1-5",
};

export const TRANSLATION_API = {
  BASE_URL: "https://api-inference.huggingface.co/models/facebook/m2m100_418M",
  HEADERS: {
    "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
    "Content-Type": "application/json",
  },
  TIMEOUT: 30000,
};

export const RATE_LIMIT = {
  MAX_REQUESTS: 10,
  TIME_WINDOW: 60 * 60 * 1000, // 1 hour
  RESET_TIME: 60 * 60 * 1000, // 1 hour
};

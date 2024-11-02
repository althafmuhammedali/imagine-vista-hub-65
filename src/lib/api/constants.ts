export const API_ENDPOINTS = {
  PRIMARY: "black-forest-labs/FLUX.1-schnell",
  FALLBACK: "runwayml/stable-diffusion-v1-5",
};

export const API_CONFIG = {
  MAX_RETRIES: 3,
  TIMEOUT_DURATION: 90000,
  INITIAL_RETRY_DELAY: 500,
  RATE_LIMIT: 10,
  RATE_WINDOW: 60000,
  DEFAULT_PARAMS: {
    num_inference_steps: 30,
    guidance_scale: 7.5,
    scheduler: "EulerAncestralDiscreteScheduler",
    use_karras_sigmas: true,
    clip_skip: 2,
    tiling: false,
    use_safetensors: true,
    options: {
      wait_for_model: true,
      use_gpu: true
    }
  }
};

export const PROMPT_ENHANCERS = {
  QUALITY: "masterpiece, best quality, highly detailed",
  LIGHTING: "studio lighting, dramatic lighting",
  CAMERA: "8k uhd, dslr",
  STYLE: "trending on artstation"
};
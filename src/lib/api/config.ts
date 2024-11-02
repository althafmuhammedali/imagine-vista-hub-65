export const API_CONFIG = {
  BASE_URL: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
  TIMEOUT: 180000, // 3 minutes
  HEADERS: {
    "Content-Type": "application/json",
  },
  DEFAULT_PARAMS: {
    num_inference_steps: 50, // Increased for better quality
    guidance_scale: 8.5, // Increased for better adherence to prompt
    scheduler: "DPMSolverMultistepScheduler", // Better scheduler
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

export const getAuthHeaders = () => {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  if (!apiKey?.startsWith('hf_')) {
    throw new Error("Invalid Hugging Face API key format. Key should start with 'hf_'");
  }
  return {
    Authorization: `Bearer ${apiKey}`,
  };
};
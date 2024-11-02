export const API_CONFIG = {
  BASE_URL: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
  TIMEOUT: 180000, // 3 minutes
  HEADERS: {
    "Content-Type": "application/json",
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
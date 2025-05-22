
import { toast } from "@/components/ui/use-toast";
import { HfInference } from '@huggingface/inference';

export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
}

const MODELS = {
  PRIMARY: "black-forest-labs/FLUX.1-dev",
  FALLBACK: "runwayml/stable-diffusion-v1-5",
};

// Create a storage key for the API key
const HF_API_KEY_STORAGE = "huggingface_api_key";

// Get stored API key or use the default one as fallback
const getApiKey = (): string => {
  const storedKey = localStorage.getItem(HF_API_KEY_STORAGE);
  return storedKey || import.meta.env.VITE_HUGGINGFACE_API_KEY || "";
};

// Set API key in local storage
export const setApiKey = (key: string): void => {
  localStorage.setItem(HF_API_KEY_STORAGE, key);
};

// Check if user has set their own API key
export const hasCustomApiKey = (): boolean => {
  return !!localStorage.getItem(HF_API_KEY_STORAGE);
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff(fn: () => Promise<Response>, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fn();
      
      if (response.status === 503) {
        const data = await response.json();
        if (data.error?.includes("is currently loading")) {
          const waitTime = Math.min((data.estimated_time || 20) * 1000, 20000);
          toast({
            title: "Please wait",
            description: "Model is warming up...",
          });
          await delay(waitTime);
          continue;
        }
      }

      if (response.status === 429) {
        toast({
          title: "Rate limit reached",
          description: "Switching to backup model...",
        });
        throw new Error("rate_limit");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to generate image" }));
        throw new Error(errorData.error || "Failed to generate image");
      }

      return response;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "rate_limit") throw error;
        if (i === maxRetries - 1) throw error;
      }
      
      const waitTime = Math.pow(2, i) * 1000;
      await delay(waitTime);
    }
  }
  throw new Error("Failed after maximum retries");
}

export async function generateImage({
  prompt,
  width = 512,
  height = 512,
  negativePrompt = "",
  seed,
}: GenerateImageParams): Promise<string> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("Missing API key");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    // Initialize the InferenceClient with provider="auto"
    const inference = new HfInference(apiKey, { provider: "auto" });

    // Enhanced prompt with art-specific elements
    const enhancedPrompt = `${prompt}, masterpiece, best quality, ultra detailed, photorealistic, 8k uhd, high quality, professional photography, cinematic lighting, dramatic atmosphere, hyperdetailed, octane render, unreal engine 5, ray tracing, subsurface scattering, volumetric lighting, high dynamic range, award winning photo`;
    const enhancedNegativePrompt = `${negativePrompt}, blur, noise, grain, low quality, low resolution, oversaturated, overexposed, bad anatomy, deformed, disfigured, poorly drawn face, distorted face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, floating limbs, disconnected limbs, malformed hands, blurry, out of focus, long neck, long body, mutated hands and fingers, watermark, signature, text, jpeg artifacts, compression artifacts`;

    console.log("Generating image with prompt:", prompt);
    console.log("Using model:", MODELS.PRIMARY);
    
    try {
      console.log("Attempting primary model with InferenceClient...");
      const blob = await inference.textToImage({
        model: MODELS.PRIMARY,
        inputs: enhancedPrompt,
        parameters: {
          negative_prompt: enhancedNegativePrompt,
          width: Math.min(width, 1024),
          height: Math.min(height, 1024),
          num_inference_steps: 150,
          guidance_scale: 15,
          seed: seed || Math.floor(Math.random() * 1000000),
          num_images_per_prompt: 1,
          scheduler: "EulerAncestralDiscreteScheduler",
        }
      });
      
      return URL.createObjectURL(blob);
    } catch (primaryError) {
      console.error("Primary model error:", primaryError);
      
      console.log("Attempting fallback model...");
      const blob = await inference.textToImage({
        model: MODELS.FALLBACK,
        inputs: enhancedPrompt,
        parameters: {
          negative_prompt: enhancedNegativePrompt,
          width: Math.min(width, 1024),
          height: Math.min(height, 1024),
          num_inference_steps: 50,
          guidance_scale: 7.5,
          seed: seed || Math.floor(Math.random() * 1000000)
        }
      });
      
      return URL.createObjectURL(blob);
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
    throw new Error('Failed to generate image');
  } finally {
    clearTimeout(timeoutId);
  }
}

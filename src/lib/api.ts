import { toast } from "@/components/ui/use-toast";

export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
}

const MODELS = {
  PRIMARY: "stabilityai/stable-diffusion-xl-base-1.0",
  FALLBACK: "runwayml/stable-diffusion-v1-5",
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff(fn: () => Promise<Response>, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fn();
      
      if (response.status === 503) {
        const data = await response.json();
        if (data.error?.includes("is currently loading")) {
          const waitTime = Math.min((data.estimated_time || 20) * 1000 + 2000, 30000);
          toast({
            title: "Model Loading",
            description: `Please wait ${Math.ceil(waitTime / 1000)} seconds...`,
          });
          await delay(waitTime);
          continue;
        }
      }

      if (response.status === 429) {
        const data = await response.json();
        const waitTime = 65000; // Wait slightly more than a minute
        toast({
          title: "Rate Limit Reached",
          description: "Please wait a minute before trying again. Using backup model...",
          duration: 5000,
        });
        throw new Error("rate_limit");
      }

      return response;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "rate_limit") throw error;
        if (error.message.includes("Failed to fetch")) {
          toast({
            title: "Connection Error",
            description: "Trying backup model...",
            duration: 3000,
          });
          throw new Error("connection_error");
        }
      }
      
      if (i === maxRetries - 1) throw error;
      const waitTime = Math.pow(2, i) * 3000;
      await delay(waitTime);
    }
  }
  throw new Error("Max retries reached");
}

export async function generateImage({
  prompt,
  width = 512,
  height = 512,
  negativePrompt = "",
  seed,
}: GenerateImageParams): Promise<string> {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing Hugging Face API key");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180000);

  try {
    const makeRequest = (modelId: string) => fetch(
      `https://api-inference.huggingface.co/models/${modelId}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt + ", professional photography, 8k uhd, hyperrealistic, photorealistic, ultra detailed, masterpiece, sharp focus, high quality, cinematic lighting, dramatic lighting, award winning photo",
          parameters: {
            negative_prompt: negativePrompt + ", illustration, painting, drawing, art, sketch, anime, cartoon, graphic, text, blurry, low quality, bad anatomy, watermark, signature, deformed, unrealistic",
            width: Math.min(width, 1024),
            height: Math.min(height, 1024),
            num_inference_steps: 30,
            guidance_scale: 7.5,
            seed: seed || Math.floor(Math.random() * 1000000),
            num_images_per_prompt: 1,
            scheduler: "DPMSolverMultistep",
            use_karras_sigmas: true,
            clip_skip: 2,
            tiling: false,
            use_safetensors: true,
            options: {
              wait_for_model: true,
              use_gpu: true,
              priority: "high"
            }
          }
        }),
        signal: controller.signal
      }
    );

    try {
      toast({
        title: "Starting Image Generation",
        description: "Creating your photorealistic image...",
        duration: 5000,
      });

      const response = await retryWithBackoff(() => makeRequest(MODELS.PRIMARY));
      
      if (!response.ok) {
        throw new Error("Primary model failed");
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Primary model error:", error);
      
      toast({
        title: "Using Backup Model",
        description: "Switching to alternative model...",
        duration: 3000,
      });

      const response = await retryWithBackoff(() => makeRequest(MODELS.FALLBACK));
      
      if (!response.ok) {
        throw new Error("Both models failed to generate image");
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
    throw new Error('Failed to generate image. Please try again.');
  } finally {
    clearTimeout(timeoutId);
  }
}
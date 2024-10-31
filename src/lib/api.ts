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
        const errorData = await response.json();
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
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing API key");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180000); // Increased timeout for higher quality

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
          inputs: prompt + ", masterpiece, best quality, extremely detailed, ultra realistic, photorealistic, 8k uhd, high quality, detailed, professional photography, sharp focus, high resolution, hyperrealistic, cinematic lighting, award-winning photograph",
          parameters: {
            negative_prompt: negativePrompt + ", blur, lowres, bad quality, out of focus, cartoon, anime, illustration, painting, drawing, artificial, fake looking, unrealistic, text, watermark, signature, blurry, deformed, low quality, ugly, duplicate, morbid, mutilated, poorly drawn face, bad anatomy, distorted, disfigured",
            width: Math.min(width, 1024),
            height: Math.min(height, 1024),
            num_inference_steps: 150, // Increased for maximum quality
            guidance_scale: 12.5, // Increased for stronger prompt adherence
            seed: seed || Math.floor(Math.random() * 1000000),
            num_images_per_prompt: 1,
            scheduler: "DPMSolverMultistepScheduler", // Better quality scheduler
            use_karras_sigmas: true,
            clip_skip: 2,
            tiling: false,
            use_safetensors: true,
            options: {
              wait_for_model: true,
              use_gpu: true,
              priority: "maximum_quality"
            }
          }
        }),
        signal: controller.signal
      }
    );

    try {
      const response = await retryWithBackoff(() => makeRequest(MODELS.PRIMARY));
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (primaryError) {
      console.error("Primary model error:", primaryError);
      
      const response = await retryWithBackoff(() => makeRequest(MODELS.FALLBACK));
      const blob = await response.blob();
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
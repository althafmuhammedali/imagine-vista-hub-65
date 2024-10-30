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
  FALLBACK: "stabilityai/stable-diffusion-2-1",
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
        const waitTime = 70000 + (i * 5000);
        toast({
          title: "Rate Limit Reached",
          description: `Please wait ${Math.ceil(waitTime / 1000)} seconds. The AI model needs a brief break.`,
          duration: waitTime,
        });
        await delay(waitTime);
        continue;
      }

      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const waitTime = Math.pow(2, i) * 5000;
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
          inputs: prompt + ", professional photography, 8k uhd, highly detailed, photorealistic, masterpiece, sharp focus, high resolution, realistic lighting, professional color grading",
          parameters: {
            negative_prompt: negativePrompt + ", blurry, low quality, bad anatomy, watermark, signature, deformed, unrealistic, low resolution, oversaturated, bad lighting, amateur, cartoonish",
            width: Math.min(width, 1024),
            height: Math.min(height, 1024),
            num_inference_steps: 50,
            guidance_scale: 9.5,
            seed: seed || Math.floor(Math.random() * 1000000),
            num_images_per_prompt: 1,
            scheduler: "DPMSolverMultistep",
          }
        }),
        signal: controller.signal
      }
    );

    try {
      toast({
        title: "Starting Image Generation",
        description: "Initializing high-quality image generation...",
        duration: 5000,
      });

      const response = await retryWithBackoff(() => makeRequest(MODELS.PRIMARY));
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error(`Failed with primary model:`, error);
      
      await delay(5000);
      
      toast({
        title: "Switching to Backup Model",
        description: "First attempt failed, trying alternative model...",
        duration: 5000,
      });

      const response = await retryWithBackoff(() => makeRequest(MODELS.FALLBACK));
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
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
    throw new Error('An unexpected error occurred.');
  } finally {
    clearTimeout(timeoutId);
  }
}

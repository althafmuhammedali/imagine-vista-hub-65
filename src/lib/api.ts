import { toast } from "@/components/ui/use-toast";

export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
}

const MODELS = {
  PRIMARY: "stabilityai/stable-diffusion-2-base",    // Using a more reliable model
  FALLBACK: "CompVis/stable-diffusion-v1-4",
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff(fn: () => Promise<Response>, maxRetries = 5): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fn();
      
      if (response.status === 503) {
        const data = await response.json();
        if (data.error?.includes("is currently loading")) {
          const waitTime = Math.min((data.estimated_time || 20) * 1000 + 2000, 30000);
          toast({
            title: "Please wait",
            description: `Model is loading, retrying in ${Math.ceil(waitTime/1000)} seconds...`,
          });
          await delay(waitTime);
          continue;
        }
      }
      
      if (response.status === 429) {
        const waitTime = Math.min((i + 1) * 10000, 30000); // Increased wait time
        toast({
          title: "Rate limit reached",
          description: `Waiting ${waitTime/1000} seconds before retrying...`,
        });
        await delay(waitTime);
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const waitTime = Math.pow(2, i) * 2000;
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
          inputs: prompt,
          parameters: {
            negative_prompt: negativePrompt,
            width: Math.min(width, 768),
            height: Math.min(height, 768),
            num_inference_steps: 20,
            guidance_scale: 7.0,
            seed: seed || Math.floor(Math.random() * 1000000),
            num_images_per_prompt: 1
          }
        }),
        signal: controller.signal
      }
    );

    let lastError = null;
    for (const modelId of [MODELS.PRIMARY, MODELS.FALLBACK]) {
      try {
        const response = await retryWithBackoff(() => makeRequest(modelId));
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error(`Failed with model ${modelId}:`, error);
        lastError = error;
      }
    }

    throw lastError || new Error("All models failed to generate the image");
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
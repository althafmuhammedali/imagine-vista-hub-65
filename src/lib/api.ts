import { toast } from "@/components/ui/use-toast";

export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
}

const MODELS = {
  PRIMARY: "stabilityai/stable-diffusion-xl-base-1.0",  // Using SDXL for better quality
  FALLBACK: "stabilityai/stable-diffusion-2-1",  // Better fallback model
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
            description: `Please wait ${Math.ceil(waitTime/1000)} seconds...`,
          });
          await delay(waitTime);
          continue;
        }
      }
      
      if (response.status === 429) {
        // For rate limits, wait at least 65 seconds (slightly more than the 1 minute requirement)
        const waitTime = 65000 + (i * 5000); // Add 5s per retry
        toast({
          title: "Rate Limit Reached",
          description: `Waiting ${Math.ceil(waitTime/1000)} seconds before retrying...`,
        });
        await delay(waitTime);
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const waitTime = Math.pow(2, i) * 5000; // Increased base wait time
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
          inputs: prompt + ", highly detailed, realistic, 8k uhd, high quality, masterpiece",
          parameters: {
            negative_prompt: negativePrompt + ", blurry, low quality, bad anatomy, watermark, signature, deformed",
            width: Math.min(width, 1024),  // Increased max size
            height: Math.min(height, 1024), // Increased max size
            num_inference_steps: 30,        // Increased steps for better quality
            guidance_scale: 8.5,            // Adjusted for more realistic results
            seed: seed || Math.floor(Math.random() * 1000000),
            num_images_per_prompt: 1,
            scheduler: "DPMSolverMultistep",  // Faster scheduler
          }
        }),
        signal: controller.signal
      }
    );

    // Try each model with its own retry cycle
    for (const modelId of [MODELS.PRIMARY, MODELS.FALLBACK]) {
      try {
        toast({
          title: "Generating Image",
          description: "Creating your high-quality masterpiece...",
        });

        const response = await retryWithBackoff(() => makeRequest(modelId));
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error(`Failed with model ${modelId}:`, error);
        if (modelId === MODELS.FALLBACK) {
          throw error;
        }
      }
    }

    throw new Error("All models failed to generate the image");
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
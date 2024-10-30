import { toast } from "@/components/ui/use-toast";

export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
}

const MODELS = {
  PRIMARY: "stabilityai/stable-diffusion-2-1-base",  // Changed to a lighter model
  FALLBACK: "CompVis/stable-diffusion-v1-4",  // Changed to a lighter fallback
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
  const timeoutId = setTimeout(() => controller.abort(), 60000); // Reduced timeout

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
          inputs: prompt + ", professional quality, detailed",  // Simplified prompt
          parameters: {
            negative_prompt: negativePrompt + ", low quality, blurry",  // Simplified negative prompt
            width: Math.min(width, 768),  // Reduced max dimensions
            height: Math.min(height, 768),
            num_inference_steps: 20,  // Reduced steps
            guidance_scale: 7.0,  // Slightly reduced guidance scale
            seed: seed || Math.floor(Math.random() * 1000000),
            num_images_per_prompt: 1,
            scheduler: "EulerAncestralDiscreteScheduler",  // Faster scheduler
            use_karras_sigmas: false,  // Disabled for speed
            clip_skip: 1,
            tiling: false,
            use_safetensors: true,
            options: {
              wait_for_model: false,  // Don't wait for model loading
              use_gpu: true,
              priority: "performance"
            }
          }
        }),
        signal: controller.signal
      }
    );

    try {
      toast({
        title: "Starting Image Generation",
        description: "Creating your image...",
        duration: 3000,
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
        description: "Switching to faster alternative...",
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
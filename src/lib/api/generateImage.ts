import { toast } from "@/components/ui/use-toast";
import { GenerateImageParams } from './types';
import { MODELS, MAX_RETRIES, TIMEOUT_DURATION, INITIAL_RETRY_DELAY } from './config';
import { checkRateLimit } from './rateLimit';
import { delay, sanitizeInput } from './utils';

async function retryWithBackoff(fn: () => Promise<Response>, maxRetries = MAX_RETRIES): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fn();
      
      if (response.status === 503) {
        const data = await response.json();
        if (data.error?.includes("is currently loading")) {
          const waitTime = Math.min((data.estimated_time || 20) * 1000, 30000);
          toast({
            title: "Model is warming up",
            description: `Please wait ${Math.ceil(waitTime/1000)} seconds...`,
          });
          await delay(waitTime);
          continue;
        }
      }

      if (response.status === 429) {
        toast({
          title: "Rate limit reached",
          description: "Please wait before making more requests.",
          variant: "destructive",
        });
        throw new Error("rate_limit");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (lastError.message === "rate_limit") throw lastError;
      if (i === maxRetries - 1) throw lastError;
      
      const waitTime = INITIAL_RETRY_DELAY * Math.pow(2, i);
      await delay(waitTime);
    }
  }
  throw lastError || new Error("Failed after maximum retries");
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

  const userId = localStorage.getItem('userId') || 'anonymous';
  if (!checkRateLimit(userId)) {
    toast({
      title: "Rate limit exceeded",
      description: "Please wait a minute before trying again.",
      variant: "destructive",
    });
    throw new Error("Rate limit exceeded");
  }

  const sanitizedPrompt = sanitizeInput(prompt);
  const sanitizedNegativePrompt = sanitizeInput(negativePrompt);
  const validatedWidth = Math.min(Math.max(width, 256), 1024);
  const validatedHeight = Math.min(Math.max(height, 256), 1024);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

  try {
    const enhancedPrompt = `${sanitizedPrompt}, high quality, detailed, professional`;
    const enhancedNegativePrompt = `${sanitizedNegativePrompt}, blur, noise, low quality, watermark, signature, text`;

    const makeRequest = (modelId: string) => fetch(
      `https://api-inference.huggingface.co/models/${modelId}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "X-Request-ID": crypto.randomUUID(),
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            negative_prompt: enhancedNegativePrompt,
            width: validatedWidth,
            height: validatedHeight,
            num_inference_steps: 25, // Reduced from 30 for faster generation
            guidance_scale: 7.0, // Slightly reduced from 7.5 for speed
            seed: seed || Math.floor(Math.random() * 1000000),
            num_images_per_prompt: 1,
            scheduler: "EulerAncestralDiscreteScheduler", // Faster scheduler
            use_karras_sigmas: true,
            clip_skip: 2,
            tiling: false,
            use_safetensors: true,
            options: {
              wait_for_model: true,
              use_gpu: true
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
      toast({
        title: "Switching to backup model",
        description: "Please wait while we try an alternative model...",
      });
      
      const response = await retryWithBackoff(() => makeRequest(MODELS.FALLBACK));
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        toast({
          title: "Request timeout",
          description: "The request took too long. Please try again with a simpler prompt.",
          variant: "destructive",
        });
        throw new Error('Request timed out - please try again with a simpler prompt');
      }
      throw error;
    }
    throw new Error('Failed to generate image');
  } finally {
    clearTimeout(timeoutId);
  }
}
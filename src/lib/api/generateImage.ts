import { toast } from "@/components/ui/use-toast";
import { checkRateLimit, getRemainingRequests, getResetTime } from './rateLimit';
import { API_ENDPOINTS, API_CONFIG } from './constants';
import { delay, sanitizeInput, validateDimensions } from './utils';
import { enhancePrompt, enhanceNegativePrompt } from './promptEnhancer';
import type { GenerateImageParams } from './types';

async function retryWithBackoff(fn: () => Promise<Response>): Promise<Response> {
  for (let i = 0; i < API_CONFIG.MAX_RETRIES; i++) {
    try {
      const response = await fn();
      
      if (response.status === 503) {
        const data = await response.json();
        if (data.error?.includes("is currently loading")) {
          await delay(Math.min((data.estimated_time || 10) * 1000, 15000));
          continue;
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      return response;
    } catch (error) {
      if (i === API_CONFIG.MAX_RETRIES - 1) throw error;
      await delay(API_CONFIG.INITIAL_RETRY_DELAY * Math.pow(2, i));
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
  if (!apiKey) throw new Error("Missing API key");

  const userId = localStorage.getItem('userId') || 'anonymous';
  if (!checkRateLimit(userId)) {
    const resetTime = Math.ceil((getResetTime(userId)! - Date.now()) / 60000);
    throw new Error(`Rate limit exceeded. Please wait ${resetTime} minute(s).`);
  }

  const remaining = getRemainingRequests(userId);
  toast({
    title: "Generating Image",
    description: `${remaining} generations remaining this minute.`,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_DURATION);

  try {
    const { width: validatedWidth, height: validatedHeight } = validateDimensions(width, height);
    const enhancedPrompt = enhancePrompt(sanitizeInput(prompt));
    const enhancedNegativePrompt = enhanceNegativePrompt(sanitizeInput(negativePrompt));

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
            num_inference_steps: 30,
            guidance_scale: 7.5,
            seed: seed || Math.floor(Math.random() * 1000000),
            num_images_per_prompt: 1,
            ...API_CONFIG.DEFAULT_PARAMS
          }
        }),
        signal: controller.signal
      }
    );

    const response = await retryWithBackoff(() => makeRequest(API_ENDPOINTS.PRIMARY));
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out - please try again');
      }
      throw error;
    }
    throw new Error('Failed to generate image');
  } finally {
    clearTimeout(timeoutId);
  }
}
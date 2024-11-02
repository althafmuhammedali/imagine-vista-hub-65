import { toast } from "@/components/ui/use-toast";
import { API_CONFIG, API_ENDPOINTS } from './config';
import { delay, sanitizeInput, validateDimensions, enhancePrompt, enhanceNegativePrompt } from './utils';
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
  width = 1024,
  height = 1024,
  negativePrompt = "",
}: GenerateImageParams): Promise<string> {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error("Missing API key");

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
            ...API_CONFIG.GENERATION_PARAMS
          }
        }),
        signal: controller.signal
      }
    );

    try {
      const response = await retryWithBackoff(() => makeRequest(API_ENDPOINTS.PRIMARY));
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (primaryError) {
      console.error("Primary model error:", primaryError);
      toast({
        title: "Switching to backup model",
        description: "Please wait while we try an alternative model...",
      });
      
      const response = await retryWithBackoff(() => makeRequest(API_ENDPOINTS.FALLBACK));
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out - please try again with a simpler prompt');
      }
      throw error;
    }
    throw new Error('Failed to generate image');
  } finally {
    clearTimeout(timeoutId);
  }
}
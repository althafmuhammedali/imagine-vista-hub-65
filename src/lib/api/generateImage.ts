
import { RateLimiter } from './rateLimit/RateLimiter';
import { RateLimitError } from './rateLimit/errors';
import { toast } from "@/hooks/use-toast";
import { API_CONFIG } from './config';
import type { GenerateImageParams } from './types';

export async function generateImage({
  prompt,
  width = 1024,
  height = 1024,
  negativePrompt = "",
  model = API_CONFIG.DEFAULT_MODEL,
}: GenerateImageParams): Promise<string> {
  const userId = localStorage.getItem('userId') || 'anonymous';
  
  if (!RateLimiter.checkLimit(userId)) {
    const timeUntilReset = RateLimiter.getTimeUntilReset(userId);
    if (timeUntilReset) {
      throw new RateLimitError(timeUntilReset);
    }
    throw new Error('Rate limit exceeded');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(API_CONFIG.BASE_URL, {
      method: "POST",
      headers: API_CONFIG.HEADERS,
      signal: controller.signal,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          ...API_CONFIG.DEFAULT_PARAMS,
          negative_prompt: negativePrompt,
          width,
          height,
          model: model,
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        const errorData = await response.json();
        const isBusy = errorData.error?.includes("loading") || errorData.estimated_time > 30;
        
        if (isBusy) {
          toast({
            title: "Model Busy",
            description: "Model too busy, retrying with fallback model...",
            variant: "destructive",
          });
          // Use fallback model
          return generateImage({
            prompt,
            width,
            height,
            negativePrompt,
            model: API_CONFIG.FALLBACK_MODEL,
          });
        }
        
        throw new RateLimitError(30000); // 30 seconds default
      }
      throw new Error('Failed to generate image');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

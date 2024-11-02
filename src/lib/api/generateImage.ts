import { API_CONFIG, getAuthHeaders } from './config';
import { ApiError, AuthenticationError } from './errors';
import { enhancePrompt, enhanceNegativePrompt } from './promptEnhancer';
import { checkRateLimit } from './rateLimit';
import { toast } from "@/components/ui/use-toast";
import { delay } from './utils';
import type { GenerateImageParams } from './types';

export async function generateImage({
  prompt,
  width = 1024,
  height = 1024,
  negativePrompt = "",
}: GenerateImageParams): Promise<string> {
  const userId = localStorage.getItem('userId') || 'anonymous';
  
  if (!checkRateLimit(userId)) {
    throw new ApiError('Rate limit exceeded. Please wait a minute before trying again.');
  }

  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const enhancedPrompt = enhancePrompt(prompt);
      const enhancedNegativePrompt = enhanceNegativePrompt(negativePrompt);

      const response = await fetch(API_CONFIG.BASE_URL, {
        method: "POST",
        headers: {
          ...API_CONFIG.HEADERS,
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            ...API_CONFIG.DEFAULT_PARAMS,
            negative_prompt: enhancedNegativePrompt,
            width,
            height,
          },
        }),
      });

      if (response.status === 429 || response.status === 503) {
        const errorData = await response.json().catch(() => ({}));
        const waitTime = errorData.estimated_time || 60;
        
        toast({
          title: "Server is busy",
          description: `The server is currently at capacity. Retrying in ${waitTime} seconds...`,
        });
        
        await delay(waitTime * 1000);
        retryCount++;
        continue;
      }

      if (response.status === 401) {
        throw new AuthenticationError();
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new ApiError(error.error || 'Failed to generate image');
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      if (retryCount === maxRetries - 1) {
        if (error instanceof ApiError) {
          throw error;
        }
        throw new ApiError(error instanceof Error ? error.message : 'Failed to generate image');
      }
      retryCount++;
      await delay(2000); // Wait 2 seconds before retrying
    }
  }

  throw new ApiError('Maximum retry attempts reached');
}
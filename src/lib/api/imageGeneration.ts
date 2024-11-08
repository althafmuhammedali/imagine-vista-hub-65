import { API_CONFIG } from './config';
import { toast } from "@/components/ui/use-toast";
import type { GenerateImageParams } from './types';

export async function generateImage({
  prompt,
  width = 1024,
  height = 1024,
  negativePrompt = "",
}: GenerateImageParams): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(API_CONFIG.BASE_URL, {
      method: "POST",
      headers: {
        ...API_CONFIG.HEADERS,
        'Cache-Control': 'no-cache',
      },
      signal: controller.signal,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          ...API_CONFIG.DEFAULT_PARAMS,
          negative_prompt: negativePrompt,
          width,
          height,
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        const errorData = await response.json();
        const isBusy = errorData.error?.includes("loading") || (errorData.estimated_time && errorData.estimated_time > 30);
        
        if (isBusy) {
          throw new Error("The AI model is currently busy. Please try again in a few moments.");
        }
        
        throw new Error("You've reached the rate limit. Please wait a moment before trying again.");
      }

      if (response.status === 401) {
        throw new Error("Authentication failed. Please check your API key.");
      }

      if (response.status === 413) {
        throw new Error("The prompt is too long. Please try a shorter prompt.");
      }

      throw new Error(`Failed to generate image (Status: ${response.status})`);
    }

    const blob = await response.blob();
    if (blob.size === 0) {
      throw new Error("Generated image is empty. Please try again.");
    }

    return URL.createObjectURL(blob);
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('The request took too long. Please try again with a simpler prompt.');
      }
      throw error;
    }
    
    throw new Error('Failed to generate image. Please try again.');
  }
}
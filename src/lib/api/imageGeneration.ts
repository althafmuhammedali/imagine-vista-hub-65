import { API_CONFIG } from './config';
import { toast } from "@/components/ui/use-toast";
import type { GenerateImageParams } from './types';
import { handleApiError } from './errorHandling';

export async function generateImage({
  prompt,
  width = 1024,
  height = 1024,
  negativePrompt = "",
}: GenerateImageParams): Promise<string> {
  if (!prompt?.trim()) {
    throw new Error('Prompt is required');
  }

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
        inputs: prompt.trim(),
        parameters: {
          ...API_CONFIG.DEFAULT_PARAMS,
          negative_prompt: negativePrompt.trim(),
          width: Math.max(Math.min(width, 1024), 512),
          height: Math.max(Math.min(height, 1024), 512),
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 30000;
        
        toast({
          title: "Model Busy",
          description: `Please wait ${Math.ceil(waitTime / 1000)} seconds before trying again.`,
          variant: "destructive",
        });
        throw new Error(`Rate limited. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
      }
      
      throw new Error(errorData.error || 'Failed to generate image');
    }

    const blob = await response.blob();
    if (!blob || blob.size === 0) {
      throw new Error('Generated image is empty');
    }

    // Validate image mime type
    if (!blob.type.startsWith('image/')) {
      throw new Error('Invalid image format received');
    }

    return URL.createObjectURL(blob);
  } catch (error) {
    clearTimeout(timeoutId);
    throw handleApiError(error);
  }
}
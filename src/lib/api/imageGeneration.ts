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
  // Input validation
  if (!prompt?.trim()) {
    throw new Error('Prompt is required');
  }

  if (width < 512 || height < 512) {
    throw new Error('Minimum dimensions are 512x512');
  }

  if (width > 1024 || height > 1024) {
    throw new Error('Maximum dimensions are 1024x1024');
  }

  // Validate API key
  if (!import.meta.env.VITE_HUGGINGFACE_API_KEY) {
    throw new Error('Hugging Face API key is not configured');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(API_CONFIG.BASE_URL, {
      method: "POST",
      headers: {
        ...API_CONFIG.HEADERS,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
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

      if (response.status === 503) {
        toast({
          title: "Service Unavailable",
          description: "The model is currently loading. Please try again in a few moments.",
          variant: "destructive",
        });
        throw new Error('Model is loading. Please try again in a few moments.');
      }

      if (response.status === 401) {
        throw new Error('Authentication failed - please check your API key');
      }
      
      throw new Error(errorData.error || 'Failed to generate image');
    }

    const blob = await response.blob();
    
    // Validate blob
    if (!blob || blob.size === 0) {
      throw new Error('Generated image is empty');
    }

    // Validate image mime type
    if (!blob.type.startsWith('image/')) {
      throw new Error('Invalid image format received');
    }

    // Validate image size
    if (blob.size < 1024) { // Less than 1KB
      throw new Error('Generated image is too small - likely corrupted');
    }

    return URL.createObjectURL(blob);
  } catch (error) {
    clearTimeout(timeoutId);
    throw handleApiError(error);
  }
}
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
      headers: API_CONFIG.HEADERS,
      signal: controller.signal,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          ...API_CONFIG.DEFAULT_PARAMS,
          negative_prompt: negativePrompt,
          width: Math.max(width, 512),
          height: Math.max(height, 512),
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429) {
        toast({
          title: "Model Busy",
          description: "The model is currently busy. Please try again in a few moments.",
          variant: "destructive",
        });
        throw new Error("Model is currently busy. Please try again in a few moments.");
      }
      
      throw new Error(errorData.error || 'Failed to generate image');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    
    throw error;
  }
}
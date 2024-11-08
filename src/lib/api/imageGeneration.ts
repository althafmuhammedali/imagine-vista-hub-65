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
          width,
          height,
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
            description: "The model is currently busy. Please try again in a few moments.",
            variant: "destructive",
          });
          throw new Error("Model too busy");
        }
        
        toast({
          title: "Rate Limited",
          description: "Please wait before making more requests.",
          variant: "destructive",
        });
        throw new Error("Rate limit exceeded");
      }
      throw new Error('Failed to generate image');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        toast({
          title: "Request Timeout",
          description: "The request took too long. Please try again with a simpler prompt.",
          variant: "destructive",
        });
        throw new Error('Request timed out - please try again with a simpler prompt');
      }
      throw error;
    }
    throw new Error('Failed to generate image');
  }
}
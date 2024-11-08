import { API_CONFIG } from './config';
import { GenerateImageParams } from './types';
import { toast } from "@/components/ui/use-toast";

export async function generateImage({
  prompt,
  width = 1024,
  height = 1024,
  negativePrompt = "",
  model = "stabilityai/stable-diffusion-xl-base-1.0"
}: GenerateImageParams): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
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
      if (response.status === 503) {
        toast({
          title: "Model Loading",
          description: "The AI model is warming up. Please try again in a few moments.",
          variant: "default",
        });
        throw new Error("Model is loading. Please try again in a few moments.");
      }

      if (response.status === 429) {
        toast({
          title: "Rate Limit",
          description: "Too many requests. Please wait a moment before trying again.",
          variant: "destructive",
        });
        throw new Error("Rate limit exceeded. Please try again later.");
      }

      if (response.status === 413) {
        toast({
          title: "Prompt Too Long",
          description: "Please try a shorter prompt.",
          variant: "destructive",
        });
        throw new Error("Prompt is too long. Please try a shorter prompt.");
      }

      throw new Error(`Failed to generate image (Status: ${response.status})`);
    }

    const blob = await response.blob();
    if (blob.size === 0) {
      toast({
        title: "Error",
        description: "Generated image is empty. Please try again.",
        variant: "destructive",
      });
      throw new Error("Generated image is empty. Please try again.");
    }

    return URL.createObjectURL(blob);
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        toast({
          title: "Timeout",
          description: "Request took too long. Please try a simpler prompt.",
          variant: "destructive",
        });
        throw new Error('Request took too long. Please try a simpler prompt.');
      }
      throw error;
    }
    
    throw new Error('Failed to generate image. Please try again.');
  }
}
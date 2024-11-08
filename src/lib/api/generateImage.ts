import { API_CONFIG } from './config';
import { toast } from "@/components/ui/use-toast";
import type { GenerateImageParams } from './types';

export async function generateImage({
  prompt,
  negativePrompt = "",
  userId,
}: GenerateImageParams): Promise<string> {
  if (!prompt?.trim()) {
    throw new Error("Prompt is required");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const enhancedPrompt = `${prompt}, high quality, detailed, 8k uhd, professional photography`;
    const finalNegativePrompt = `${API_CONFIG.DEFAULT_PARAMS.negative_prompt}${negativePrompt ? `, ${negativePrompt}` : ''}`;

    const response = await fetch(API_CONFIG.BASE_URL, {
      method: "POST",
      headers: API_CONFIG.HEADERS,
      signal: controller.signal,
      body: JSON.stringify({
        inputs: enhancedPrompt,
        parameters: {
          ...API_CONFIG.DEFAULT_PARAMS,
          negative_prompt: finalNegativePrompt,
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429) {
        const message = errorData.error?.includes("loading") 
          ? "The AI model is warming up. Please try again in a few moments."
          : "The service is currently busy. Please try again shortly.";
        throw new Error(message);
      }
      
      if (response.status === 401) {
        throw new Error("Authentication failed. Please check your API key.");
      }
      
      if (response.status === 413) {
        throw new Error("The prompt is too long. Please try a shorter prompt.");
      }
      
      throw new Error(errorData.error || `Failed to generate image (Status: ${response.status})`);
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
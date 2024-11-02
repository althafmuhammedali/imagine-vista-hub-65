import { toast } from "@/components/ui/use-toast";
import { API_CONFIG } from './config';
import { handleApiError } from './errorHandling';
import type { GenerateImageParams } from './types';

export async function generateImage({
  prompt,
  width = 1024,
  height = 1024,
  negativePrompt = "",
}: GenerateImageParams): Promise<string> {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing API key");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const enhancedPrompt = `${prompt}, high quality, detailed, professional`;
    const enhancedNegativePrompt = `${negativePrompt}, blur, noise, low quality, watermark, signature, text`;

    const response = await fetch(
      API_CONFIG.BASE_URL,
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
            width,
            height,
            ...API_CONFIG.DEFAULT_PARAMS
          }
        }),
        signal: controller.signal
      }
    );

    if (!response.ok) {
      if (response.status === 503) {
        const data = await response.json();
        if (data.error?.includes("loading")) {
          const waitTime = Math.min((data.estimated_time || 20) * 1000, 30000);
          toast({
            title: "Model is warming up",
            description: `Please wait ${Math.ceil(waitTime/1000)} seconds...`,
          });
          throw new Error("model_busy");
        }
      }

      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate image");
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    throw handleApiError(error);
  } finally {
    clearTimeout(timeoutId);
  }
}
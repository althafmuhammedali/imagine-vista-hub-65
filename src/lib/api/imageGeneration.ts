import { API_CONFIG } from './config';
import { addWatermark } from './watermark';
import { toast } from "@/components/ui/use-toast";
import type { GenerateImageParams } from './types';

export async function generateImage({
  prompt,
  width = 1024,
  height = 1024,
  negativePrompt = "",
}: GenerateImageParams): Promise<string> {
  const userId = localStorage.getItem('userId') || 'anonymous';
  
  const response = await fetch(API_CONFIG.BASE_URL, {
    method: "POST",
    headers: {
      ...API_CONFIG.HEADERS,
      Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
    },
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

  if (!response.ok) {
    if (response.status === 429) {
      const errorData = await response.json();
      const isBusy = errorData.error?.includes("loading") || errorData.estimated_time > 60;
      
      if (isBusy) {
        toast({
          title: "Model Busy",
          description: "Model too busy, unable to get response in less than 60 second(s)",
          variant: "destructive",
        });
        throw new Error("Model too busy, unable to get response in less than 60 second(s)");
      }
      
      toast({
        title: "Rate Limit Exceeded",
        description: "Please wait before making more requests.",
        variant: "destructive",
      });
      throw new Error('Rate limit exceeded');
    }
    throw new Error('Failed to generate image');
  }

  const originalBlob = await response.blob();
  const watermarkedBlob = await addWatermark(originalBlob);
  return URL.createObjectURL(watermarkedBlob);
}
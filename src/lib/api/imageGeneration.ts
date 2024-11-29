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
          negative_prompt: negativePrompt,
          width: Math.max(width, 1024), // Ensure minimum width of 1024
          height: Math.max(height, 1024), // Ensure minimum height of 1024
          num_inference_steps: 20, // Reduced for faster generation
          guidance_scale: 7.5, // Optimized value
          scheduler: "DPMSolverMultistepScheduler", // Faster scheduler
          quality: "maximum", // Set to maximum quality
          image_format: "png", // Use PNG for better quality
          output_format: "png",
          high_noise_frac: 0.8, // Increase noise fraction for better detail
          use_karras_sigmas: true,
          clip_skip: 1,
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429) {
        throw new Error("Model is currently busy. Please try again in a few moments.");
      }
      
      throw new Error(errorData.error || 'Failed to generate image');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
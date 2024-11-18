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
    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: negativePrompt,
          width: Math.max(width, 1024), // Ensure minimum width of 1024
          height: Math.max(height, 1024), // Ensure minimum height of 1024
          num_inference_steps: 150, // Increased from 50 for higher quality
          guidance_scale: 12.5, // Increased from 7.5 for better prompt adherence
          scheduler: "DPMSolverMultistepScheduler",
          upscaler: "RealESRGAN_x4plus", // Add upscaling
          tiling: false,
          quality: "maximum", // Set to maximum quality
          image_format: "png", // Use PNG for better quality
          output_format: "png",
          high_noise_frac: 0.8, // Increase noise fraction for better detail
          use_karras_sigmas: true,
          clip_skip: 1, // Reduced for better detail preservation
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
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out - please try again with a simpler prompt');
      }
      throw error;
    }
    throw new Error('Failed to generate image');
  }
}
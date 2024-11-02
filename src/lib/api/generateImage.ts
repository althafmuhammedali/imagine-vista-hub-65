import { HfInference } from '@huggingface/inference';
import { toast } from "@/components/ui/use-toast";
import { API_CONFIG, API_ENDPOINTS } from './constants';
import { delay, sanitizeInput, validateDimensions, enhancePrompt, enhanceNegativePrompt } from './utils';
import type { GenerateImageParams } from './types';

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

export async function generateImage({
  prompt,
  width = 1024,
  height = 1024,
  negativePrompt = "",
}: GenerateImageParams): Promise<string> {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error("Missing API key - Please check your environment variables");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_DURATION);

  try {
    const { width: validatedWidth, height: validatedHeight } = validateDimensions(width, height);
    const enhancedPrompt = enhancePrompt(sanitizeInput(prompt));
    const enhancedNegativePrompt = enhanceNegativePrompt(sanitizeInput(negativePrompt));

    const response = await hf.textToImage({
      model: "black-forest-labs/FLUX.1-dev",
      inputs: enhancedPrompt,
      parameters: {
        negative_prompt: enhancedNegativePrompt,
        width: validatedWidth,
        height: validatedHeight,
        num_inference_steps: API_CONFIG.GENERATION_PARAMS.num_inference_steps,
        guidance_scale: API_CONFIG.GENERATION_PARAMS.guidance_scale,
      }
    });

    if (!response) {
      throw new Error("Failed to generate image - Empty response");
    }

    // The response is already a Blob, so we can create a URL directly
    return URL.createObjectURL(response);

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out - please try again with a simpler prompt');
      }
      throw error;
    }
    throw new Error('Failed to generate image');
  } finally {
    clearTimeout(timeoutId);
  }
}
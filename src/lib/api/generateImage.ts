import { HfInference } from '@huggingface/inference';
import { toast } from "@/components/ui/use-toast";
import { API_CONFIG, API_ENDPOINTS, ERROR_MESSAGES } from './constants';
import { delay, sanitizeInput, validateDimensions, enhancePrompt, enhanceNegativePrompt } from './utils';
import type { GenerateImageParams } from './types';

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

export async function generateImage({
  prompt,
  width = 1024,
  height = 1024,
  negativePrompt = "",
}: GenerateImageParams): Promise<string> {
  // Validate API key
  if (!import.meta.env.VITE_HUGGINGFACE_API_KEY) {
    throw new Error(ERROR_MESSAGES.MISSING_API_KEY);
  }

  // Input validation
  if (!prompt || prompt.trim().length < 3) {
    throw new Error(ERROR_MESSAGES.SHORT_PROMPT);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_DURATION);

  try {
    // Validate and process inputs
    const { width: validatedWidth, height: validatedHeight } = validateDimensions(width, height);
    const enhancedPrompt = enhancePrompt(sanitizeInput(prompt));
    const enhancedNegativePrompt = enhanceNegativePrompt(sanitizeInput(negativePrompt));

    // Combine prompts for FLUX.1-dev model format
    const combinedPrompt = negativePrompt 
      ? `${enhancedPrompt} ### ${enhancedNegativePrompt}`
      : enhancedPrompt;

    // Make API request with optimized parameters
    const response = await hf.textToImage({
      model: API_ENDPOINTS.PRIMARY,
      inputs: combinedPrompt,
      parameters: {
        width: validatedWidth,
        height: validatedHeight,
        num_inference_steps: API_CONFIG.GENERATION_PARAMS.num_inference_steps,
        guidance_scale: API_CONFIG.GENERATION_PARAMS.guidance_scale,
        negative_prompt: enhancedNegativePrompt,
      }
    });

    if (!response) {
      throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
    }

    // Convert response to blob and create URL
    const blob = new Blob([response], { type: 'image/png' });
    return URL.createObjectURL(blob);

  } catch (error) {
    if (error instanceof Error) {
      // Handle specific error cases
      if (error.name === 'AbortError') {
        throw new Error(ERROR_MESSAGES.TIMEOUT);
      }
      // Re-throw the original error with its message
      throw error;
    }
    // For unknown errors, throw a generic message
    throw new Error(ERROR_MESSAGES.GENERATION_FAILED);
  } finally {
    clearTimeout(timeoutId);
  }
}
import { HfInference } from '@huggingface/inference';
import { API_CONFIG, API_ENDPOINTS, ERROR_MESSAGES } from './constants';
import { delay, sanitizeInput, validateDimensions } from './utils';
import type { GenerateImageParams } from './types';

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

export async function generateImage({
  prompt,
  width = 1024,
  height = 1024,
  negativePrompt,
}: GenerateImageParams): Promise<string> {
  if (!import.meta.env.VITE_HUGGINGFACE_API_KEY) {
    throw new Error(ERROR_MESSAGES.MISSING_API_KEY);
  }

  if (!prompt || prompt.trim().length < 3) {
    throw new Error(ERROR_MESSAGES.SHORT_PROMPT);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_DURATION);

  try {
    const { width: validatedWidth, height: validatedHeight } = validateDimensions(width, height);
    const sanitizedPrompt = sanitizeInput(prompt);
    const sanitizedNegativePrompt = negativePrompt ? sanitizeInput(negativePrompt) : undefined;

    const response = await hf.textToImage({
      model: API_ENDPOINTS.PRIMARY,
      inputs: sanitizedPrompt,
      parameters: {
        width: validatedWidth,
        height: validatedHeight,
        negative_prompt: sanitizedNegativePrompt,
        num_inference_steps: API_CONFIG.GENERATION_PARAMS.num_inference_steps,
        guidance_scale: API_CONFIG.GENERATION_PARAMS.guidance_scale,
      }
    });

    if (!response) {
      throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
    }

    const blob = new Blob([response], { type: 'image/png' });
    return URL.createObjectURL(blob);

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(ERROR_MESSAGES.TIMEOUT);
      }
      throw error;
    }
    throw new Error(ERROR_MESSAGES.GENERATION_FAILED);
  } finally {
    clearTimeout(timeoutId);
  }
}
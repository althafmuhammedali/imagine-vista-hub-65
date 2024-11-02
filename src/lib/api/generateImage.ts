import { API_CONFIG, ERROR_MESSAGES, API_ENDPOINTS } from './constants';
import { delay, sanitizeInput, validateDimensions } from './utils';
import { GenerateImageParams } from './types';

export async function generateImage({
  prompt,
  width = 1024,
  height = 1024,
  negativePrompt,
}: GenerateImageParams): Promise<string> {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
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

    // Choose model based on prompt complexity and image size
    const isComplexPrompt = sanitizedPrompt.length > 100 || sanitizedPrompt.includes("detailed") || sanitizedPrompt.includes("high quality");
    const isLargeImage = validatedWidth * validatedHeight > 786432; // 1024x768
    
    const modelEndpoint = isComplexPrompt || isLargeImage 
      ? API_ENDPOINTS.PRIMARY  // Use FLUX.1-dev for complex prompts or large images
      : API_ENDPOINTS.FALLBACK; // Use FLUX.1-schnell for simpler prompts and smaller images

    let response;
    let retries = 0;

    while (retries < API_CONFIG.MAX_RETRIES) {
      try {
        const res = await fetch(`https://api-inference.huggingface.co/models/${modelEndpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: sanitizedPrompt,
            parameters: {
              ...API_CONFIG.GENERATION_PARAMS,
              width: validatedWidth,
              height: validatedHeight,
              negative_prompt: sanitizedNegativePrompt,
            }
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
          if (res.status === 401) {
            throw new Error('Invalid API key. Please check your Hugging Face API key.');
          }
          throw new Error(errorData.error || ERROR_MESSAGES.GENERATION_FAILED);
        }

        response = await res.blob();
        break;
      } catch (error) {
        retries++;
        if (retries === API_CONFIG.MAX_RETRIES) throw error;
        await delay(API_CONFIG.INITIAL_RETRY_DELAY * Math.pow(2, retries - 1));
      }
    }

    if (!response) {
      throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
    }

    return URL.createObjectURL(response);
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
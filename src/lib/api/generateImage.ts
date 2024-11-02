import { API_CONFIG, getAuthHeaders } from './config';
import { ApiError, AuthenticationError } from './errors';
import type { GenerateImageParams } from './types';

export async function generateImage({
  prompt,
  width = 1024,
  height = 1024,
  negativePrompt = "",
}: GenerateImageParams): Promise<string> {
  try {
    const headers = {
      ...API_CONFIG.HEADERS,
      ...getAuthHeaders(),
    };

    const response = await fetch(API_CONFIG.BASE_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: negativePrompt,
          width,
          height,
          num_inference_steps: 30,
          guidance_scale: 7.5,
          scheduler: "EulerAncestralDiscreteScheduler",
          num_images_per_prompt: 1,
        },
        options: {
          wait_for_model: true,
          use_gpu: true,
        }
      }),
    });

    if (response.status === 401) {
      throw new AuthenticationError();
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(error.error || 'Failed to generate image', response.status);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : 'Failed to generate image');
  }
}
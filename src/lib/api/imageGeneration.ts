import { HfInference } from '@huggingface/inference';

const TIMEOUT = 180000; // 3 minutes

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

export async function generateImage(
  prompt: string,
  negativePrompt?: string,
  numImages: number = 1
): Promise<string[]> {
  if (!import.meta.env.VITE_HUGGINGFACE_API_KEY) {
    throw new Error("Hugging Face API key is not configured");
  }

  try {
    const images: string[] = [];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
    
    for (let i = 0; i < numImages; i++) {
      const response = await hf.textToImage({
        model: "black-forest-labs/FLUX.1-dev",
        inputs: prompt,
        parameters: {
          negative_prompt: negativePrompt || "",
        }
      });

      clearTimeout(timeoutId);

      if (!response) {
        throw new Error("No response from image generation API");
      }

      // Convert blob to base64 URL
      const blob = new Blob([response], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      images.push(url);
    }

    return images;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 3 minutes');
      }
      throw error;
    }
    throw new Error('Failed to generate image');
  }
}
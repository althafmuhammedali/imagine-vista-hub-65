import { HfInference } from '@huggingface/inference';

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

export async function generateImage(
  prompt: string,
  negativePrompt?: string,
  numImages: number = 1
): Promise<string[]> {
  try {
    const images: string[] = [];
    
    for (let i = 0; i < numImages; i++) {
      const response = await hf.textToImage({
        model: "black-forest-labs/FLUX.1-dev",
        inputs: prompt,
        parameters: {
          negative_prompt: negativePrompt || "",
        }
      });

      // Convert blob to base64 URL
      const blob = new Blob([response], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      images.push(url);
    }

    return images;
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
}
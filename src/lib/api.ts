import { InferenceClient } from '@huggingface/inference';

interface GenerationOptions {
  width?: number;
  height?: number;
  negative_prompt?: string;
}

interface ImageResult {
  success: boolean;
  image: string | null;
  error: string | null;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export async function generateImage(
  prompt: string,
  apiKey: string,
  options: GenerationOptions = {}
): Promise<ImageResult> {
  try {
    console.log("Generating image with prompt:", prompt);
    console.log("Options:", options);

    // Use the InferenceClient from HuggingFace Hub
    const inference = new InferenceClient({
      apiToken: apiKey,
    });

    // Set defaults
    const width = options.width || 1024;
    const height = options.height || 1024;
    const negativePrompt = options.negative_prompt || "";

    // Attempt to generate image with retry logic
    let attempt = 0;
    const maxAttempts = 3;
    
    while (attempt < maxAttempts) {
      try {
        attempt++;
        console.log(`Attempt ${attempt} of ${maxAttempts}`);

        const result = await inference.textToImage({
          inputs: prompt,
          model: "black-forest-labs/FLUX.1-dev",
          parameters: {
            negative_prompt: negativePrompt,
            height: height,
            width: width,
            // Remove 'seed' as it's not in the allowed parameters
            // Remove 'provider' as it's not in the allowed options
          }
        });

        console.log("Generation successful!");

        // Handle the result based on its type
        if (result instanceof Blob) {
          const base64 = await blobToBase64(result);
          return {
            success: true,
            image: base64,
            error: null
          };
        } else {
          throw new Error("Unexpected response format from API");
        }
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);

        if (attempt >= maxAttempts) {
          throw error; // Rethrow if we've exhausted our attempts
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }

    throw new Error("Failed after maximum retry attempts");
  } catch (error) {
    console.error("Error generating image:", error);
    return {
      success: false,
      image: null,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}



import { HfInference } from '@huggingface/inference';

interface GenerationOptions {
  width?: number;
  height?: number;
  negative_prompt?: string;
  seed?: number;
}

export interface ImageResult {
  success: boolean;
  image: string | null;
  error: string | null;
}

// Store the API key in localStorage
let customApiKey: string | null = null;

export const setApiKey = (apiKey: string): void => {
  customApiKey = apiKey;
  localStorage.setItem('hf_api_key', apiKey);
};

export const hasCustomApiKey = (): boolean => {
  if (customApiKey) return true;
  
  const storedKey = localStorage.getItem('hf_api_key');
  if (storedKey) {
    customApiKey = storedKey;
    return true;
  }
  
  return false;
};

const getApiKey = (): string => {
  if (customApiKey) return customApiKey;
  
  const storedKey = localStorage.getItem('hf_api_key');
  if (storedKey) {
    customApiKey = storedKey;
    return storedKey;
  }
  
  return import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
};

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
  options: GenerationOptions = {}
): Promise<string> {
  try {
    console.log("Generating image with prompt:", prompt);
    console.log("Options:", options);

    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("No API key provided. Please set your Hugging Face API key.");
    }

    // Use the HfInference from HuggingFace Hub
    const inference = new HfInference(apiKey);

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

        const params: any = {
          negative_prompt: negativePrompt,
          height: height,
          width: width,
        };

        // Only add seed if it's provided
        if (options.seed !== undefined) {
          params.seed = options.seed;
        }

        const result = await inference.textToImage({
          inputs: prompt,
          model: "black-forest-labs/FLUX.1-dev",
          parameters: params,
        });

        console.log("Generation successful!");

        // Handle the result based on its type
        if (result instanceof Blob) {
          const base64 = await blobToBase64(result);
          return base64;
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
    throw error;
  }
}

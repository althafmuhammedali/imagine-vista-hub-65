
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
    console.log("Starting image generation with prompt:", prompt);
    console.log("Options:", options);

    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("No API key provided. Please set your Hugging Face API key in the settings.");
    }

    const hf = new HfInference(apiKey);

    // Set defaults
    const width = options.width || 1024;
    const height = options.height || 1024;
    
    // Attempt to generate image with retry logic
    let attempt = 0;
    const maxAttempts = 3;
    
    while (attempt < maxAttempts) {
      try {
        attempt++;
        console.log(`Generation attempt ${attempt} of ${maxAttempts}`);

        // Build parameters object
        const params: any = {
          negative_prompt: options.negative_prompt || "",
          height: height,
          width: width,
        };

        // Only add seed if it's provided and valid
        if (options.seed !== undefined && !isNaN(options.seed)) {
          params.seed = options.seed;
        }

        console.log("Sending request to Hugging Face API with params:", params);

        const result = await hf.textToImage({
          inputs: prompt,
          model: "black-forest-labs/FLUX.1-dev",
          parameters: params,
        });

        console.log("Generation successful! Converting to base64...");

        // Handle the result based on its type
        if (result instanceof Blob) {
          const base64 = await blobToBase64(result);
          console.log("Image converted to base64 successfully");
          return base64;
        } else {
          throw new Error("Unexpected response format from API");
        }
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);

        if (attempt >= maxAttempts) {
          // If it's the last attempt, throw a more user-friendly error
          if (error instanceof Error) {
            if (error.message.includes('401')) {
              throw new Error("Invalid API key. Please check your Hugging Face API key.");
            } else if (error.message.includes('429')) {
              throw new Error("Rate limit exceeded. Please try again in a few minutes.");
            } else if (error.message.includes('503')) {
              throw new Error("Service temporarily unavailable. Please try again later.");
            }
          }
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        const delay = 1000 * Math.pow(2, attempt - 1);
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error("Failed after maximum retry attempts");
  } catch (error) {
    console.error("Error generating image:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error("Network error. Please check your internet connection and try again.");
      }
    }
    
    throw error;
  }
}

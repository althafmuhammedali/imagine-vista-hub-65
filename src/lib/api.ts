
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
      throw new Error("No API key provided. Please set your Hugging Face API key to generate images.");
    }

    console.log("API key available:", apiKey.substring(0, 10) + "...");

    const hf = new HfInference(apiKey);

    // Set defaults
    const width = options.width || 1024;
    const height = options.height || 1024;
    
    console.log(`Generating image with dimensions: ${width}x${height}`);

    // Build parameters object for FLUX.1-dev model
    const params: any = {
      height: height,
      width: width,
    };

    // Add negative prompt if provided
    if (options.negative_prompt && options.negative_prompt.trim()) {
      params.negative_prompt = options.negative_prompt.trim();
    }

    // Add seed if provided and valid
    if (options.seed !== undefined && !isNaN(options.seed) && options.seed > 0) {
      params.seed = options.seed;
    }

    console.log("API request parameters:", params);

    try {
      const result = await hf.textToImage({
        inputs: prompt,
        model: "black-forest-labs/FLUX.1-dev",
        parameters: params,
      });

      console.log("API response received, type:", typeof result);

      // Handle the result based on its type
      if (result instanceof Blob) {
        console.log("Converting blob to base64...");
        const base64 = await blobToBase64(result);
        console.log("Image conversion successful, base64 length:", base64.length);
        return base64;
      } else if (result instanceof ArrayBuffer) {
        console.log("Converting ArrayBuffer to blob...");
        const blob = new Blob([result], { type: 'image/png' });
        const base64 = await blobToBase64(blob);
        console.log("Image conversion successful, base64 length:", base64.length);
        return base64;
      } else {
        console.error("Unexpected response format:", result);
        throw new Error("Unexpected response format from API");
      }
    } catch (apiError: unknown) {
      console.error("API Error details:", apiError);
      
      // Handle specific API errors with proper type checking
      if (apiError && typeof apiError === 'object' && 'message' in apiError) {
        const errorMessage = (apiError as any).message;
        const status = (apiError as any).status;
        
        if (errorMessage?.includes('401') || status === 401) {
          throw new Error("Invalid API key. Please check your Hugging Face API key and try again.");
        } else if (errorMessage?.includes('429') || status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment and try again.");
        } else if (errorMessage?.includes('503') || status === 503) {
          throw new Error("The AI model is currently loading. Please wait a moment and try again.");
        } else if (errorMessage?.includes('500') || status === 500) {
          throw new Error("Server error occurred. Please try again in a few moments.");
        } else if (errorMessage?.includes('network') || errorMessage?.includes('fetch')) {
          throw new Error("Network error. Please check your internet connection and try again.");
        }
      }
      
      // Re-throw the original error if it's an Error object
      if (apiError instanceof Error) {
        throw apiError;
      }
      
      // Default error message for unknown error types
      throw new Error("Failed to generate image. Please try again.");
    }
  } catch (error: unknown) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while generating the image.");
  }
}

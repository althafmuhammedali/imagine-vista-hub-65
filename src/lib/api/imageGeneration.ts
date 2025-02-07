
import { HfInference } from '@huggingface/inference';

const TIMEOUT = 180000; // 3 minutes
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateImage(
  prompt: string,
  negativePrompt?: string,
  numImages: number = 1
): Promise<string[]> {
  if (!import.meta.env.VITE_HUGGINGFACE_API_KEY) {
    throw new Error("Hugging Face API key is not configured");
  }

  const images: string[] = [];
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    for (let i = 0; i < numImages; i++) {
      let lastError: Error | null = null;
      
      // Implement retry logic
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const response = await hf.textToImage({
            model: "strangerzonehf/Flux-Super-Realism-LoRA",
            inputs: prompt,
            parameters: {
              negative_prompt: negativePrompt || "",
              num_inference_steps: 30,
              guidance_scale: 7.5,
              scheduler: "DPMSolverMultistepScheduler",
              use_karras_sigmas: true,
              clip_skip: 1,
            }
          });

          if (!response) {
            throw new Error("No response from image generation API");
          }

          // Convert blob to base64 URL
          const url = URL.createObjectURL(response);
          images.push(url);
          break; // Success, exit retry loop
          
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          
          if (attempt < MAX_RETRIES) {
            console.log(`Attempt ${attempt + 1} failed, retrying...`);
            await delay(RETRY_DELAY * (attempt + 1)); // Exponential backoff
            continue;
          }
          
          throw lastError;
        }
      }
    }

    clearTimeout(timeoutId);
    return images;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 3 minutes');
      }
      
      // Handle specific API errors
      if (error.message.includes("rate limit")) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (error.message.includes("model_busy")) {
        throw new Error('Model is currently busy. Please try again in a few moments.');
      }
      
      throw error;
    }
    
    throw new Error('Failed to generate image');
  }
}

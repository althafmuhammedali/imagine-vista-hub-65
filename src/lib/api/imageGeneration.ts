
import { HfInference } from '@huggingface/inference';

const TIMEOUT = 180000; // 3 minutes
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateImage(
  prompt: string,
  negativePrompt?: string,
  numImages: number = 1
): Promise<string[]> {
  if (!import.meta.env.VITE_HUGGINGFACE_API_KEY) {
    throw new Error("Hugging Face API key is not configured");
  }

  const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);
  const images: string[] = [];
  
  try {
    for (let i = 0; i < numImages; i++) {
      let lastError: Error | null = null;
      
      // Implement retry logic
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          console.log(`Generating image ${i+1}/${numImages}, attempt ${attempt+1}/${MAX_RETRIES+1}`);
          
          // Create a promise that will reject after TIMEOUT
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), TIMEOUT);
          });
          
          // Create the image generation promise
          const imagePromise = hf.textToImage({
            model: "strangerzonehf/Flux-Super-Realism-LoRA",
            inputs: prompt,
            parameters: {
              negative_prompt: negativePrompt || "",
              num_inference_steps: 30,
              guidance_scale: 7.5,
            }
          });
          
          // Race the timeout against the image generation
          const response = await Promise.race([imagePromise, timeoutPromise]);
          
          if (!response) {
            throw new Error("No response from image generation API");
          }
          
          // Convert blob to base64 data URL for consistent handling
          const url = URL.createObjectURL(response);
          images.push(url);
          console.log(`Successfully generated image ${i+1}`);
          break; // Success, exit retry loop
          
        } catch (error) {
          console.error(`Attempt ${attempt + 1} failed:`, error);
          lastError = error instanceof Error ? error : new Error('Unknown error');
          
          if (attempt < MAX_RETRIES) {
            const retryDelay = RETRY_DELAY * Math.pow(2, attempt); // Exponential backoff
            console.log(`Retrying in ${retryDelay}ms...`);
            await delay(retryDelay);
            continue;
          }
          
          throw lastError;
        }
      }
    }
    
    return images;
    
  } catch (error) {
    console.error('Final generation error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Request timed out') {
        throw new Error('Request timed out after 3 minutes');
      }
      
      // Handle specific API errors
      if (error.message.includes("rate limit")) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (error.message.includes("model_busy") || error.message.includes("loading")) {
        throw new Error('Model is currently busy. Please try again in a few moments.');
      }
      
      throw error;
    }
    
    throw new Error('Failed to generate image');
  }
}

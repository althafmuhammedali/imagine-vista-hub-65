
import { HfInference } from '@huggingface/inference';
import { generateNebiusImage } from './nebius';

const TIMEOUT = 180000; // 3 minutes
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000; // 2 seconds

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Flag to control which API to use
const USE_NEBIUS_API = true;

export async function generateImage(
  prompt: string,
  negativePrompt?: string,
  numImages: number = 1
): Promise<string[]> {
  // Use the Nebius API if flag is enabled
  if (USE_NEBIUS_API) {
    try {
      console.log("Using Nebius API for image generation with FLUX.1-schnell model");
      const images: string[] = [];
      
      for (let i = 0; i < numImages; i++) {
        const imageUrl = await generateNebiusImage(enhancePrompt(prompt), negativePrompt);
        images.push(imageUrl);
      }
      
      return images;
    } catch (error) {
      console.error("Nebius API error, falling back to HuggingFace:", error);
      // Fall back to original method if Nebius fails
    }
  }

  // Original HuggingFace method
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error("Hugging Face API key is not configured");
  }

  console.log("Using Hugging Face API key:", apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length - 4));
  
  const hf = new HfInference(apiKey);
  const images: string[] = [];
  
  // Create a more descriptive prompt if needed
  const enhancedPrompt = enhancePrompt(prompt);
  
  try {
    for (let i = 0; i < numImages; i++) {
      let lastError: Error | null = null;
      
      // Implement retry logic with exponential backoff
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          console.log(`Generating image ${i+1}/${numImages}, attempt ${attempt+1}/${MAX_RETRIES+1}`);
          
          // Create a promise that will reject after TIMEOUT
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), TIMEOUT);
          });
          
          // Create the image generation promise with supported parameters only
          const imagePromise = hf.textToImage({
            model: "stabilityai/stable-diffusion-xl-base-1.0", // More reliable model
            inputs: enhancedPrompt,
            parameters: {
              negative_prompt: negativePrompt || "",
              num_inference_steps: 30,
              guidance_scale: 7.5
            }
          });
          
          // Race the timeout against the image generation
          const response = await Promise.race([imagePromise, timeoutPromise]);
          
          if (!response) {
            throw new Error("No response from image generation API");
          }
          
          // Convert blob to base64 data URL
          const blob = new Blob([response], { type: 'image/png' });
          const url = URL.createObjectURL(blob);
          images.push(url);
          console.log(`Successfully generated image ${i+1}`);
          break; // Success, exit retry loop
          
        } catch (error) {
          console.error(`Attempt ${attempt + 1} failed:`, error);
          lastError = error instanceof Error ? error : new Error('Unknown error');
          
          // Check for specific errors that shouldn't be retried
          if (error instanceof Error) {
            if (error.message.includes("API key") || error.message.includes("401")) {
              throw new Error("Invalid API key or authentication error");
            }
          }
          
          if (attempt < MAX_RETRIES) {
            // Calculate exponential backoff with jitter
            const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, attempt) + Math.random() * 1000;
            console.log(`Retrying in ${Math.round(retryDelay)}ms...`);
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
        throw new Error('Request timed out after 3 minutes. Please try with a simpler prompt.');
      }
      
      // Handle specific API errors
      if (error.message.includes("rate limit") || error.message.includes("429")) {
        throw new Error('Rate limit exceeded. Please try again after a few minutes.');
      }
      
      if (error.message.includes("model_busy") || error.message.includes("loading")) {
        throw new Error('Model is currently busy. Please try again in a few moments.');
      }
      
      throw error;
    }
    
    throw new Error('Failed to generate image');
  }
}

// Helper function to enhance prompts with quality descriptors
function enhancePrompt(prompt: string): string {
  const qualityDescriptors = [
    "high quality",
    "detailed",
    "sharp",
    "4k",
    "high resolution"
  ];
  
  // Only add descriptors if they're not already in the prompt
  const lowerPrompt = prompt.toLowerCase();
  const descriptorsToAdd = qualityDescriptors.filter(desc => !lowerPrompt.includes(desc.toLowerCase()));
  
  if (descriptorsToAdd.length > 0) {
    return `${prompt}, ${descriptorsToAdd.join(", ")}`;
  }
  
  return prompt;
}

export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
}

// Smaller, more efficient models as fallbacks
const MODELS = {
  PRIMARY: "CompVis/stable-diffusion-v1-4",      // Less memory intensive model
  FALLBACK: "runwayml/stable-diffusion-v1-5",    // Alternative model
  SMALL: "stabilityai/stable-diffusion-xl-base-0.9" // Smaller variant
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff(fn: () => Promise<Response>, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fn();
      
      if (response.status === 503 || response.status === 500) {
        const waitTime = Math.min((i + 1) * 5000, 15000); // Progressive delay
        await delay(waitTime);
        continue;
      }
      
      if (response.status === 429) {
        const waitTime = Math.pow(2, i) * 2000;
        await delay(waitTime);
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(Math.pow(2, i) * 1000);
    }
  }
  throw new Error("Max retries reached");
}

export async function generateImage({
  prompt,
  width = 512,  // Reduced default size
  height = 512, // Reduced default size
  negativePrompt = "",
  seed,
}: GenerateImageParams): Promise<string> {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing Hugging Face API key");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180000);

  async function tryGenerateWithModel(modelId: string) {
    const makeRequest = () => fetch(
      `https://api-inference.huggingface.co/models/${modelId}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: negativePrompt,
            width: Math.min(width, 768),  // Reduced maximum size
            height: Math.min(height, 768), // Reduced maximum size
            num_inference_steps: 30,       // Reduced steps
            guidance_scale: 7.5,
            seed: seed || Math.floor(Math.random() * 1000000),
            num_images_per_prompt: 1
          }
        }),
        signal: controller.signal
      }
    );

    const response = await retryWithBackoff(makeRequest);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }

      // Check for specific CUDA memory errors
      if (errorData.body && errorData.body.includes("CUDA out of memory")) {
        throw new Error("GPU_MEMORY_ERROR");
      }

      if (response.status === 401) {
        throw new Error("Invalid API key");
      }
      if (response.status === 429) {
        throw new Error("Rate limit reached");
      }
      
      throw new Error(errorData.error || "Failed to generate image");
    }

    return response;
  }

  try {
    let response;
    const models = [MODELS.PRIMARY, MODELS.FALLBACK, MODELS.SMALL];
    let lastError = null;

    for (const model of models) {
      try {
        response = await tryGenerateWithModel(model);
        break;
      } catch (error) {
        lastError = error;
        if (error instanceof Error && 
            (error.message === "GPU_MEMORY_ERROR" || 
             error.message.includes("SERVER_ERROR"))) {
          continue;
        }
        throw error;
      }
    }

    if (!response) {
      throw lastError || new Error("All models failed to generate the image");
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred.');
  } finally {
    clearTimeout(timeoutId);
  }
}
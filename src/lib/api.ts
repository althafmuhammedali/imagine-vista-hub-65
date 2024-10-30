export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
}

const MODELS = {
  PRIMARY: "CompVis/stable-diffusion-v1-4",
  FALLBACK: "runwayml/stable-diffusion-v1-5",
  LAST_RESORT: "stabilityai/stable-diffusion-2-1"
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff(fn: () => Promise<Response>, maxRetries = 3, isModelLoading = false): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fn();
      
      if (response.status === 503) {
        const responseData = await response.json();
        if (responseData.error?.includes("is currently loading")) {
          const waitTime = Math.min(responseData.estimated_time * 1000 || 10000, 20000);
          await delay(waitTime);
          continue;
        }
      }
      
      if (response.status === 429) {
        const responseData = await response.json();
        if (responseData.error?.includes("Max requests")) {
          throw new Error("You've reached the maximum number of requests. Please wait a minute before trying again.");
        }
        const waitTime = Math.pow(2, i) * 2000;
        await delay(waitTime);
        continue;
      }
      
      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes("maximum number of requests")) {
        throw error;
      }
      if (i === maxRetries - 1) throw error;
      await delay(Math.pow(2, i) * 1000);
    }
  }
  throw new Error(isModelLoading ? "Model is still loading after multiple retries. Please try again later." : "Max retries reached");
}

export async function generateImage({
  prompt,
  width = 512,
  height = 512,
  negativePrompt = "",
  seed,
}: GenerateImageParams): Promise<string> {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error("Please add your Hugging Face API key to the .env file as VITE_HUGGINGFACE_API_KEY");
  }

  if (typeof apiKey !== 'string' || !apiKey.startsWith('hf_')) {
    throw new Error("Invalid Hugging Face API key format. Please ensure your API key starts with 'hf_' and is properly set in the .env file");
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: negativePrompt,
            width: Math.min(width, 1024),
            height: Math.min(height, 1024),
            num_inference_steps: 50, // Increased from 30 for better quality
            guidance_scale: 8.5, // Increased from 7.0 for better quality
            seed: seed || Math.floor(Math.random() * 1000000),
            num_images_per_prompt: 1,
            scheduler: "DPMSolverMultistep", // Added for better quality
            use_karras_sigmas: true, // Added for enhanced detail
            clip_skip: 2, // Added for better artistic results
          }
        }),
        signal: controller.signal,
      }
    );

    const response = await retryWithBackoff(makeRequest, 3, true);

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }

      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your Hugging Face API key in the .env file");
      }
      if (response.status === 429) {
        throw new Error("Rate limit reached. Please wait a minute before trying again.");
      }
      if (response.status === 503) {
        throw new Error("MODEL_LOADING");
      }
      if (response.status === 500) {
        throw new Error("SERVER_ERROR");
      }
      
      throw new Error(errorData.error || "Failed to generate image");
    }

    return response;
  }

  try {
    let response;
    const models = [MODELS.PRIMARY, MODELS.FALLBACK, MODELS.LAST_RESORT];
    let lastError = null;

    for (const model of models) {
      try {
        response = await tryGenerateWithModel(model);
        break;
      } catch (error) {
        lastError = error;
        if (error instanceof Error && 
            !error.message.includes("SERVER_ERROR") && 
            !error.message.includes("MODEL_LOADING")) {
          throw error;
        }
        // Continue to next model if it's a server error
        continue;
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
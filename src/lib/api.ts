export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
}

// Using smaller, more efficient models
const MODELS = {
  PRIMARY: "runwayml/stable-diffusion-v1-5",    // More stable model
  FALLBACK: "CompVis/stable-diffusion-v1-4",    // Alternative model
  SMALL: "stabilityai/stable-diffusion-2-base"  // Smaller variant
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff(fn: () => Promise<Response>, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fn();
      
      if (response.status === 503) {
        const data = await response.json();
        if (data.error?.includes("is currently loading")) {
          // Wait for the estimated loading time plus a small buffer
          const waitTime = Math.min((data.estimated_time || 20) * 1000 + 5000, 60000);
          console.log(`Model is loading, waiting ${waitTime/1000} seconds before retry...`);
          await delay(waitTime);
          continue;
        }
      }
      
      if (response.status === 500) {
        console.log(`Server error, attempt ${i + 1}/${maxRetries}. Retrying...`);
        const waitTime = Math.min((i + 1) * 8000, 24000);
        await delay(waitTime);
        continue;
      }
      
      if (response.status === 429) {
        console.log(`Rate limit reached, attempt ${i + 1}/${maxRetries}. Retrying...`);
        const waitTime = Math.pow(2, i) * 3000;
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
  width = 512,
  height = 512,
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
            width: Math.min(width, 768),
            height: Math.min(height, 768),
            num_inference_steps: 25,
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
        console.log(`Attempting to generate image with model: ${model}`);
        response = await tryGenerateWithModel(model);
        console.log(`Successfully generated image with model: ${model}`);
        break;
      } catch (error) {
        console.log(`Failed with model ${model}, trying next model...`);
        lastError = error;
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
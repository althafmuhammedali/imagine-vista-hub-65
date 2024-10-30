export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
}

const MODELS = {
  PRIMARY: "stabilityai/stable-diffusion-xl-base-1.0",
  FALLBACK: "runwayml/stable-diffusion-v1-5",
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
            num_inference_steps: 50,
            guidance_scale: 7.5,
            seed: seed || Math.floor(Math.random() * 1000000),
          }
        }),
        signal: controller.signal,
      }
    );

    const response = await retryWithBackoff(makeRequest, 5, true);

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
        const estimatedTime = Math.ceil((errorData.estimated_time || 0) / 60);
        throw new Error(`Model is currently loading. Estimated wait time: ${estimatedTime} minutes. Please try again later.`);
      }
      if (response.status === 500) {
        if (errorData.warnings?.some((w: string) => w.includes("CUDA out of memory"))) {
          throw new Error("MEMORY_ERROR");
        }
        throw new Error("Server error occurred. Please try again.");
      }
      
      throw new Error(errorData.error || "Failed to generate image");
    }

    return response;
  }

  try {
    let response;
    try {
      response = await tryGenerateWithModel(MODELS.PRIMARY);
    } catch (error) {
      if (error instanceof Error && error.message === "MEMORY_ERROR") {
        response = await tryGenerateWithModel(MODELS.FALLBACK);
      } else {
        throw error;
      }
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
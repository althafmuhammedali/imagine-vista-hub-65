export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
}

const MODELS = {
  PRIMARY: "CompVis/stable-diffusion-v1-4",  // Lighter model
  FALLBACK: "stabilityai/stable-diffusion-xl-base-0.9",
};

export async function generateImage({
  prompt,
  width = 512,
  height = 512,
  negativePrompt = "",
  seed,
}: GenerateImageParams): Promise<string> {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY?.trim();
  
  if (!apiKey) {
    throw new Error("Hugging Face API key is not configured. Please add your API key to the .env file.");
  }

  if (!apiKey.startsWith('hf_')) {
    throw new Error("Invalid API key format. Hugging Face API keys should start with 'hf_'");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180000);

  async function tryGenerateWithModel(modelId: string) {
    const response = await fetch(
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
            width: Math.min(width, 768), // Limit size to prevent CUDA memory issues
            height: Math.min(height, 768),
            num_inference_steps: 25, // Reduced steps
            seed: seed || Math.floor(Math.random() * 1000000),
          }
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }

      // Handle specific error cases
      if (response.status === 429) {
        throw new Error("Rate limit reached. Please wait a minute before trying again.");
      }
      if (response.status === 503) {
        throw new Error("Model is currently loading. Please try again in a moment.");
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
        // If primary model fails due to memory, try fallback
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
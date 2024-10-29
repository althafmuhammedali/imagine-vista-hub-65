export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
}

export async function generateImage({
  prompt,
  width = 512,
  height = 512,
  negativePrompt = "",
  seed,
}: GenerateImageParams): Promise<string> {
  if (!prompt.trim()) {
    throw new Error("Prompt cannot be empty");
  }

  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY?.trim();
  
  if (!apiKey) {
    throw new Error("Hugging Face API key is not configured. Please add your API key to the .env file.");
  }

  if (!apiKey.startsWith('hf_')) {
    throw new Error("Invalid API key format. Hugging Face API keys should start with 'hf_'");
  }

  // Validate dimensions
  if (width < 128 || width > 1024 || height < 128 || height > 1024) {
    throw new Error("Image dimensions must be between 128 and 1024 pixels");
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: negativePrompt,
            width: Math.min(Math.max(width, 128), 1024),
            height: Math.min(Math.max(height, 128), 1024),
            num_inference_steps: 30,
            seed: seed || Math.floor(Math.random() * 1000000),
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Failed to generate image";
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.includes("token seems invalid")) {
          errorMessage = "Your API key appears to be invalid. Please check your Hugging Face API token in the .env file and ensure you have accepted the model's terms of use at huggingface.co";
        } else {
          errorMessage = errorData.error || errorMessage;
        }
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while generating the image.");
  }
}
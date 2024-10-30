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
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY?.trim();
  
  if (!apiKey) {
    throw new Error("Hugging Face API key is not configured. Please add your API key to the .env file.");
  }

  if (!apiKey.startsWith('hf_')) {
    throw new Error("Invalid API key format. Hugging Face API keys should start with 'hf_'");
  }

  const response = await fetch(
    "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
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
          width,
          height,
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
      
      // Handle model loading state
      if (response.status === 503 && errorData.error?.includes("is currently loading")) {
        const estimatedTime = Math.ceil(errorData.estimated_time || 60);
        throw new Error(`Model is currently loading. Please try again in ${estimatedTime} seconds.`);
      }
      
      // Handle invalid token
      if (errorData.error?.includes("token seems invalid")) {
        throw new Error("Your API key appears to be invalid. Please check your Hugging Face API token and ensure you have accepted the model's terms of use at huggingface.co");
      }
      
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
      throw new Error(errorText || errorMessage);
    }
    
    throw new Error(errorMessage);
  }

  const blob = await response.blob();
  const imageUrl = URL.createObjectURL(blob);
  
  // Clean up the object URL when it's no longer needed
  setTimeout(() => {
    URL.revokeObjectURL(imageUrl);
  }, 60000); // Clean up after 1 minute
  
  return imageUrl;
}
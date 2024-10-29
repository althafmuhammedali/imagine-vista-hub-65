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
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error("Please add your Hugging Face API key to the .env file");
  }

  const response = await fetch(
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "image/png"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: negativePrompt,
          width,
          height,
          guidance_scale: 7.5,
          num_inference_steps: 50,
          seed: seed || Math.floor(Math.random() * 1000000),
        }
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorData = JSON.parse(errorText);
      if (errorData.error?.includes("token")) {
        throw new Error("Invalid API key. Please check your Hugging Face API token.");
      }
      throw new Error(errorData.error || "Failed to generate image");
    } catch (e) {
      if (e instanceof Error) throw e;
      throw new Error("Failed to connect to the image generation service. Please try again later.");
    }
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
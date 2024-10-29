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
    throw new Error("Hugging Face API key not found in environment variables");
  }

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
          width,
          height,
          seed: seed || Math.floor(Math.random() * 1000000),
        }
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorData = JSON.parse(errorText);
      if (errorData.error?.includes("token seems invalid")) {
        throw new Error("Invalid API key. Please check your Hugging Face API key.");
      }
      throw new Error(errorData.error || "Failed to generate image");
    } catch (e) {
      if (e instanceof Error) throw e;
      throw new Error(errorText || "Failed to generate image");
    }
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
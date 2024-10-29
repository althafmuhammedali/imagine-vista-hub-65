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
    throw new Error("Hugging Face API key not found");
  }

  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
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
          seed: seed || Math.floor(Math.random() * 1000000),
        }
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to generate image");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
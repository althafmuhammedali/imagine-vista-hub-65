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
  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
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
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.error || "Failed to generate image");
    } catch (e) {
      throw new Error("Failed to connect to the image generation service. Please try again later.");
    }
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
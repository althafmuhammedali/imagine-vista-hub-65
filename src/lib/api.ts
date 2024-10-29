import { toast } from "@/components/ui/use-toast";

export interface GenerateImageParams {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
}

export async function generateImage({
  prompt,
  model = "FLUX.1",
  width = 512,
  height = 512,
  negativePrompt = "",
  seed,
}: GenerateImageParams): Promise<string> {
  const apiKey = import.meta.env.VITE_DEZGO_API_KEY;
  
  if (!apiKey) {
    throw new Error("API key not found");
  }

  const response = await fetch("https://api.dezgo.com/text2image", {
    method: "POST",
    headers: {
      "X-Dezgo-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      model: "FLUX.1",
      width,
      height,
      negative_prompt: negativePrompt,
      seed,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to generate image");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

import { generateImage } from "@/lib/api/imageGeneration";
import type { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, negativePrompt, numImages = 1 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const images = await generateImage(prompt, negativePrompt, numImages);
    return res.status(200).json({ images });
  } catch (error) {
    console.error("Image generation error:", error);
    return res.status(500).json({ error: "Failed to generate image" });
  }
}

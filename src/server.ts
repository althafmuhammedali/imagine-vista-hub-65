import express from "express";
import cors from "cors";
import { generateImage } from "./lib/api/imageGeneration";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
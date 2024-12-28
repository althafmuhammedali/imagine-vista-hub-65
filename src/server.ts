import express, { Request, Response } from "express";
import cors from "cors";
import { generateImage } from "./lib/api/imageGeneration";

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Route handler
const generateHandler = async (req: Request, res: Response) => {
  try {
    const { prompt, negativePrompt, numImages = 1 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const images = await generateImage(prompt, negativePrompt, numImages);
    return res.json({ images });
  } catch (error) {
    console.error("Image generation error:", error);
    return res.status(500).json({ error: "Failed to generate image" });
  }
};

// Routes
app.use("/generate", (req: Request, res: Response) => {
  if (req.method === 'POST') {
    return generateHandler(req, res);
  }
  return res.status(405).json({ error: "Method not allowed" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
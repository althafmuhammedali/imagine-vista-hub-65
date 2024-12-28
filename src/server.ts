import express, { Request, Response, Router } from "express";
import cors from "cors";
import { generateImage } from "./lib/api/imageGeneration";

const app = express();
const router = Router();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
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

// Mount routes
router.post("/generate", generateHandler);
app.use("/", router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
import express from "express";
import cors from "cors";
import { generateImage } from "./lib/api/imageGeneration";

const app = express();
const port = 3001;

// Middleware
app.use(cors({
  origin: '*', // Be more restrictive in production
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Define route handler
const generateHandler = async (req: express.Request, res: express.Response) => {
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

// Register routes - Fix: Use app.post() instead of direct handler assignment
app.post("/api/generate", generateHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
import express from "express";
import cors from "cors";
import { generateImage } from "./lib/api/imageGeneration";

const app = express();
const port = 3001;

// Middleware
app.use(cors({
  origin: '*', // Be more restrictive in production
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Health check endpoint
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// Define route handler
app.post("/api/generate", async (req, res) => {
  const { prompt, negativePrompt, numImages = 1 } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  if (numImages < 1 || numImages > 4) {
    res.status(400).json({ error: "Number of images must be between 1 and 4" });
    return;
  }

  try {
    const images = await generateImage(prompt, negativePrompt, numImages);
    res.json({ images });
  } catch (error) {
    console.error("Image generation error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        res.status(401).json({ error: "API configuration error" });
        return;
      }
      if (error.message.includes("timeout")) {
        res.status(504).json({ error: "Request timed out" });
        return;
      }
    }
    
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to generate image" 
    });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
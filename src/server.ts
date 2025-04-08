
import express from "express";
import cors from "cors";
import { generateImage } from "./lib/api/imageGeneration";

const app = express();
const port = 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [/\.lovableproject\.com$/] 
    : '*',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get("/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Define route handler
app.post("/api/generate", async (req, res) => {
  console.log("Received generation request");
  const { prompt, negativePrompt, numImages = 1 } = req.body;

  if (!prompt) {
    console.log("Error: Missing prompt");
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  if (numImages < 1 || numImages > 4) {
    console.log("Error: Invalid number of images");
    res.status(400).json({ error: "Number of images must be between 1 and 4" });
    return;
  }

  try {
    console.log(`Starting image generation with prompt: "${prompt.substring(0, 30)}..."`);
    console.log(`Negative prompt: "${negativePrompt ? negativePrompt.substring(0, 30) + '...' : 'none'}"`);
    console.log(`Number of images: ${numImages}`);
    
    const images = await generateImage(prompt, negativePrompt, numImages);
    console.log(`Generated ${images.length} images successfully`);
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
      if (error.message.includes("rate limit")) {
        res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
        return;
      }
    }
    
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to generate image" 
    });
  }
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? "Internal server error" 
      : err.message 
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});

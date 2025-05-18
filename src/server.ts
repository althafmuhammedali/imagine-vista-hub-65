import express from "express";
import cors from "cors";
import { generateImage } from "./lib/api/imageGeneration";

const app = express();
const port = process.env.PORT || 3001;

// Improved CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [/\.lovableproject\.com$/, /\.vercel\.app$/] 
    : '*',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Increased limit for larger payloads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health check endpoint
app.get("/health", (_, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Improved image generation endpoint
app.post("/api/generate", async (req, res) => {
  console.log("Received generation request");
  const { prompt, negativePrompt, numImages = 1 } = req.body;

  if (!prompt) {
    console.log("Error: Missing prompt");
    return res.status(400).json({ error: "Prompt is required" });
  }

  if (numImages < 1 || numImages > 4) {
    console.log("Error: Invalid number of images");
    return res.status(400).json({ error: "Number of images must be between 1 and 4" });
  }

  try {
    console.log(`Starting image generation with prompt: "${prompt.substring(0, 50)}..."`);
    console.log(`Negative prompt: "${negativePrompt ? negativePrompt.substring(0, 50) + '...' : 'none'}"`);
    console.log(`Number of images: ${numImages}`);
    
    const startTime = Date.now();
    const images = await generateImage(prompt, negativePrompt, numImages);
    const duration = Date.now() - startTime;
    
    console.log(`Generated ${images.length} images successfully in ${duration}ms`);
    return res.json({ images });
  } catch (error) {
    console.error("Image generation error:", error);
    
    // Specific error handling for different scenarios
    if (error instanceof Error) {
      if (error.message.includes("API key") || error.message.includes("401") || error.message.includes("authentication")) {
        return res.status(401).json({ error: "API configuration error - Check your Hugging Face API key" });
      }
      
      if (error.message.includes("timeout")) {
        return res.status(504).json({ error: "Request timed out - Try a simpler prompt or try again later" });
      }
      
      if (error.message.includes("rate limit") || error.message.includes("429")) {
        return res.status(429).json({ error: "Rate limit exceeded. Please try again after a few minutes." });
      }

      if (error.message.includes("model_busy") || error.message.includes("loading")) {
        return res.status(503).json({ error: "Model is currently busy. Please try again in a few moments." });
      }
    }
    
    // Generic error fallback
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to generate image" 
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? "Internal server error" 
      : err.message 
  });
});

// Start server with better error handling
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  // Keep server running but log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled promise rejection:', reason);
  // Keep server running but log the error
});

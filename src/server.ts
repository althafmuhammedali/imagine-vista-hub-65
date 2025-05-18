
import express from 'express';
import cors from 'cors';
import { generateImage } from './lib/api/generateImage';
import { API_CONFIG } from './lib/api/config';

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Image generation endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, negativePrompt = "", numImages = 1 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    
    const images = [];
    
    for (let i = 0; i < numImages; i++) {
      const imageUrl = await generateImage({ 
        prompt, 
        negativePrompt,
        width: 512, 
        height: 512 
      });
      images.push(imageUrl);
    }
    
    return res.status(200).json({ images });
  } catch (error) {
    console.error("Image generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: errorMessage });
  }
});

// Remove the old route that was causing the error
// app.use(generateImage);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API configuration loaded for model: ${API_CONFIG.DEFAULT_MODEL}`);
});

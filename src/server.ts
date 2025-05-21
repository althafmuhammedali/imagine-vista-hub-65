
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import * as path from 'path';

const app = express();
const port = process.env.PORT || 3001;

// Configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(limiter);

// Define API routes
app.post('/api/generate', async (req, res) => {
  // Implementation for image generation endpoint
  res.json({ message: 'Image generation endpoint' });
});

// Serve static files from the 'dist' directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // All other requests return the React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

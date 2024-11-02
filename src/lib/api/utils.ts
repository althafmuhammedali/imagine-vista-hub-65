export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s,.!?-]/g, '')
    .trim();
};

export const validateDimensions = (width: number, height: number): { width: number; height: number } => {
  return {
    width: Math.min(Math.max(width, 256), 1024),
    height: Math.min(Math.max(height, 256), 1024)
  };
};

export const enhancePrompt = (prompt: string): string => {
  const qualityBoosters = [
    "masterpiece",
    "best quality",
    "highly detailed",
    "sharp focus",
    "professional",
    "8k uhd",
    "high resolution"
  ];
  return `${prompt}, ${qualityBoosters.join(', ')}`;
};

export const enhanceNegativePrompt = (prompt: string): string => {
  const baseNegative = "blur, noise, jpeg artifacts, compression artifacts, watermark, text, low quality, pixelated, grainy, distorted, low resolution";
  return prompt ? `${prompt}, ${baseNegative}` : baseNegative;
};
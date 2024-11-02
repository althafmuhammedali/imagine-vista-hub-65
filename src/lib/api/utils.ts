export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[^\w\s,.!?-]/g, '') // Remove special characters except basic punctuation
    .trim()
    .slice(0, 500); // Limit prompt length
};

export const validateDimensions = (width: number, height: number): { width: number; height: number } => {
  const MIN_DIMENSION = 256;
  const MAX_DIMENSION = 1024;
  const STEP_SIZE = 8;
  
  const validateDimension = (dim: number, defaultDim: number = 1024): number => {
    if (!dim || isNaN(dim)) return defaultDim;
    // Round to nearest multiple of STEP_SIZE
    const roundedDim = Math.round(dim / STEP_SIZE) * STEP_SIZE;
    return Math.min(Math.max(roundedDim, MIN_DIMENSION), MAX_DIMENSION);
  };

  return {
    width: validateDimension(width),
    height: validateDimension(height)
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

  const enhancedPrompt = prompt.toLowerCase().trim();
  const boosters = qualityBoosters.filter(booster => !enhancedPrompt.includes(booster.toLowerCase()));
  
  return boosters.length > 0 ? `${prompt}, ${boosters.join(', ')}` : prompt;
};

export const enhanceNegativePrompt = (prompt: string): string => {
  const baseNegative = [
    "blur",
    "noise",
    "jpeg artifacts",
    "compression artifacts",
    "watermark",
    "text",
    "low quality",
    "pixelated",
    "grainy",
    "distorted",
    "low resolution"
  ].join(', ');

  return prompt ? `${prompt}, ${baseNegative}` : baseNegative;
};
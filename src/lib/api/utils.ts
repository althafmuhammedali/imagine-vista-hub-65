export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s,.!?-]/g, '')
    .trim();
};

export const validateDimensions = (width: number, height: number): { width: number; height: number } => {
  const MIN_DIMENSION = 256;
  const MAX_DIMENSION = 1024;
  
  const validateDimension = (dim: number, defaultDim: number = 1024): number => {
    if (!dim || isNaN(dim)) return defaultDim;
    return Math.min(Math.max(dim, MIN_DIMENSION), MAX_DIMENSION);
  };

  return {
    width: validateDimension(width),
    height: validateDimension(height)
  };
};

export const enhancePrompt = (prompt: string): string => {
  if (!prompt) return '';
  
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

export const isValidApiKey = (key: string | undefined): boolean => {
  return typeof key === 'string' && key.length > 0;
};

export const validatePrompt = (prompt: string): { isValid: boolean; error?: string } => {
  const trimmedPrompt = prompt.trim();
  
  if (!trimmedPrompt) {
    return { isValid: false, error: 'Please enter a prompt' };
  }
  
  if (trimmedPrompt.length < 3) {
    return { isValid: false, error: 'Prompt must be at least 3 characters long' };
  }
  
  return { isValid: true };
};
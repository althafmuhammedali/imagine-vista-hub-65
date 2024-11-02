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
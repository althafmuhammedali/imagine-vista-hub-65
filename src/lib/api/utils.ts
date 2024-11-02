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
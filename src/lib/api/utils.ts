export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s,.!?-]/g, '')
    .trim();
};
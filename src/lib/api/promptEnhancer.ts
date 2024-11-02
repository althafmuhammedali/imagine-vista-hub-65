import { enhancePrompt, enhanceNegativePrompt } from './utils';

export const getEnhancedPrompt = (prompt: string): string => {
  return enhancePrompt(prompt);
};

export const getEnhancedNegativePrompt = (prompt: string): string => {
  return enhanceNegativePrompt(prompt);
};
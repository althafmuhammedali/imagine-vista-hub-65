import { PROMPT_ENHANCERS } from './constants';

export const enhancePrompt = (prompt: string) => {
  const enhancers = [
    "masterpiece",
    "best quality",
    "highly detailed",
    "professional",
    "sharp focus"
  ];
  
  return `${prompt}, ${enhancers.join(', ')}`;
};

export const enhanceNegativePrompt = (prompt: string) => {
  const baseNegative = "blur, noise, jpeg artifacts, compression artifacts, watermark, text, low quality, pixelated, grainy, distorted";
  return prompt ? `${prompt}, ${baseNegative}` : baseNegative;
};
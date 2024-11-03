import { PROMPT_ENHANCERS } from './constants';

export const enhancePrompt = (prompt: string) => {
  const enhancers = [
    "masterpiece",
    "best quality",
    "highly detailed",
    "ultra realistic",
    "photorealistic",
    "8k uhd",
    "high resolution",
    "professional photography",
    "sharp focus",
    "dramatic lighting",
    "high contrast",
    "vivid colors"
  ].join(', ');
  
  return `${prompt}, ${enhancers}`;
};

export const enhanceNegativePrompt = (prompt: string) => {
  const baseNegative = "blur, noise, jpeg artifacts, compression artifacts, watermark, text, low quality, pixelated, grainy, distorted, deformed, mutated, ugly, duplicate, morbid, poorly drawn, bad anatomy, extra limbs, lowres, worst quality, low quality, normal quality, artifacts, signature, watermark, username, blurry, badly drawn, bad proportions";
  return prompt ? `${prompt}, ${baseNegative}` : baseNegative;
};
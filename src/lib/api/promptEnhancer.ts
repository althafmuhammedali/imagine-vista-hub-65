import { PROMPT_ENHANCERS } from './constants';

export const enhancePrompt = (prompt: string) => {
  const enhancers = [
    PROMPT_ENHANCERS.QUALITY,
    PROMPT_ENHANCERS.LIGHTING,
    PROMPT_ENHANCERS.CAMERA,
    PROMPT_ENHANCERS.STYLE
  ];
  
  return `${prompt}, ${enhancers.join(', ')}`;
};

export const enhanceNegativePrompt = (prompt: string) => {
  const baseNegative = "blur, noise, jpeg artifacts, compression artifacts, watermark, text, low quality, pixelated, grainy, distorted, deformed, mutated, ugly, duplicate, morbid, poorly drawn face, bad anatomy, extra limbs";
  return prompt ? `${prompt}, ${baseNegative}` : baseNegative;
};
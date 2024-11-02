import { PROMPT_ENHANCERS } from './constants';

export const enhancePrompt = (prompt: string, options = { 
  quality: true,
  lighting: true,
  camera: true,
  style: true
}) => {
  const enhancers = [];
  
  if (options.quality) enhancers.push(PROMPT_ENHANCERS.QUALITY);
  if (options.lighting) enhancers.push(PROMPT_ENHANCERS.LIGHTING);
  if (options.camera) enhancers.push(PROMPT_ENHANCERS.CAMERA);
  if (options.style) enhancers.push(PROMPT_ENHANCERS.STYLE);
  
  return `${prompt}, ${enhancers.join(', ')}`;
};

export const enhanceNegativePrompt = (prompt: string) => {
  const baseNegative = "blur, noise, jpeg artifacts, compression artifacts, watermark, text, low quality, pixelated, grainy, distorted";
  return prompt ? `${prompt}, ${baseNegative}` : baseNegative;
};
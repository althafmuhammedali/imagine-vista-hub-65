import { PROMPT_ENHANCERS } from './constants';

const styleEnhancements = {
  realistic: "ultra realistic, photographic, 8k uhd, professional photography, natural lighting",
  artistic: "artistic, oil painting, masterpiece, vivid colors, detailed brushstrokes",
  anime: "anime style, manga art, cel shaded, vibrant, detailed anime illustration",
  fantasy: "fantasy art, magical, ethereal, mystical atmosphere, dramatic lighting",
  abstract: "abstract art, contemporary, modern art, experimental, creative composition"
};

export const enhancePrompt = (prompt: string, style: string = 'realistic') => {
  const styleEnhancement = styleEnhancements[style as keyof typeof styleEnhancements] || '';
  const baseEnhancers = [
    PROMPT_ENHANCERS.QUALITY,
    styleEnhancement,
    PROMPT_ENHANCERS.LIGHTING,
    PROMPT_ENHANCERS.CAMERA
  ].join(', ');
  
  return `${prompt}, ${baseEnhancers}`;
};

export const enhanceNegativePrompt = (prompt: string) => {
  const baseNegative = "blur, noise, jpeg artifacts, compression artifacts, watermark, text, low quality, pixelated, grainy, distorted, deformed, mutated, ugly, duplicate, morbid, poorly drawn, bad anatomy, extra limbs, lowres, worst quality, low quality, normal quality, artifacts, signature, watermark, username, blurry";
  return prompt ? `${prompt}, ${baseNegative}` : baseNegative;
};
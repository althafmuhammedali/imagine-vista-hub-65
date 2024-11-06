import { PROMPT_ENHANCERS } from './constants';

export const enhancePrompt = (prompt: string) => {
  const enhancers = [
    "masterpiece",
    "best quality",
    "ultra realistic",
    "photorealistic",
    "8k uhd",
    "raw photo",
    "professional photography",
    "high resolution",
    "detailed",
    "sharp focus",
    "high detail",
    "intricate details",
    "high quality",
    "professional lighting",
    "dramatic lighting",
    "studio lighting",
    "natural lighting",
    "volumetric lighting",
    "ray tracing",
    "global illumination",
    "subsurface scattering",
    "high contrast",
    "vivid colors",
    "detailed textures",
    "hyperrealistic",
    "octane render",
    "unreal engine 5",
    "cinematic",
    "award winning"
  ].join(', ');
  
  return `${prompt}, ${enhancers}`;
};

export const enhanceNegativePrompt = (prompt: string) => {
  const baseNegative = "blur, noise, jpeg artifacts, compression artifacts, watermark, text, low quality, pixelated, grainy, distorted, deformed, mutated, ugly, duplicate, morbid, poorly drawn, bad anatomy, extra limbs, lowres, worst quality, low quality, normal quality, artifacts, signature, watermark, username, blurry, badly drawn, bad proportions, draft, sketch, out of focus, glitch, corrupted, amateur, beginner, low resolution, bad quality, text, watermark, signature, blurry, artificial, fake, unrealistic, distorted, noisy, grainy, oversaturated, undersaturated, overexposed, underexposed, poor composition, bad framing, cropped, stretched, warped, pixelated, jpeg artifacts, compression artifacts, low detail, missing details, incomplete, unfinished, rough, messy, dirty, dusty, scratched, damaged, broken, error, mistake, failed, rejected, amateur, unprofessional";
  return prompt ? `${prompt}, ${baseNegative}` : baseNegative;
};
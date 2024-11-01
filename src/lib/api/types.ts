export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
}

export interface RateLimitInfo {
  count: number;
  resetTime: number;
}
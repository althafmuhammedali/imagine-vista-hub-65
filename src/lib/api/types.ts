
export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  model?: string;
}

export interface GenerateResponse {
  images: string[];
  error?: string;
}

export interface RateLimitConfig {
  maxRequests: number;
  timeWindow: number;
  resetTime: number;
}

export interface ApiConfig {
  BASE_URL: string;
  HEADERS: Record<string, string>;
  TIMEOUT: number;
  DEFAULT_PARAMS: Record<string, any>;
  DEFAULT_MODEL: string;
  FALLBACK_MODEL: string;
}

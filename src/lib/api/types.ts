export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
}

export interface ApiResponse {
  success: boolean;
  data?: Blob;
  error?: string;
}
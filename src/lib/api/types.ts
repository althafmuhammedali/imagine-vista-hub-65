export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  negativePrompt?: string;
  userId?: string;
}
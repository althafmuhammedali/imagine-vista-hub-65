export async function generateImage(
  prompt: string,
  negativePrompt?: string,
  numImages: number = 1
): Promise<string[]> {
  // For now, return placeholder images
  const placeholderImages = Array(numImages).fill(
    "https://placehold.co/600x400/000000/FFFFFF/png?text=Generated+Image"
  );
  
  return placeholderImages;
}
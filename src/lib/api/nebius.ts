
/**
 * Query the Nebius/HuggingFace image generation API
 * @param data Request parameters for image generation
 * @returns Blob containing the generated image
 */
export async function query(data: {
  response_format: string;
  prompt: string;
  model: string;
  negative_prompt?: string;
  n?: number;
  size?: string;
}): Promise<Blob> {
  const response = await fetch(
    "https://router.huggingface.co/nebius/v1/images/generations",
    {
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} ${errorData.error || response.statusText}`);
  }
  
  const result = await response.blob();
  return result;
}

/**
 * Generate an image using the Nebius API and return a URL
 * @param userPrompt User's prompt for image generation
 * @param negativePrompt Optional negative prompt
 * @returns URL string to the generated image
 */
export async function generateNebiusImage(
  userPrompt: string,
  negativePrompt?: string
): Promise<string> {
  try {
    const imageBlob = await query({
      response_format: "b64_json",
      prompt: userPrompt,
      model: "black-forest-labs/FLUX.1-schnell", // Updated to use FLUX.1-schnell
      negative_prompt: negativePrompt,
    });

    // Convert the blob to an object URL
    return URL.createObjectURL(imageBlob);
  } catch (error) {
    console.error("Nebius API error:", error);
    throw error;
  }
}

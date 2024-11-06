import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { generateImage } from "@/lib/api";
import { ImageSettings } from "./image-generator/ImageSettings";
import { ImagePreview } from "./image-generator/ImagePreview";
import { useQueryClient } from "@tanstack/react-query";
import { VoiceInput } from "./VoiceInput";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [numImages, setNumImages] = useState(1); // Fixed to 1 image
  const queryClient = useQueryClient();

  const handleGenerate = useCallback(async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    if (trimmedPrompt.length < 3) {
      toast({
        title: "Error",
        description: "Prompt must be at least 3 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      // Clear previous URLs
      generatedImages.forEach(url => URL.revokeObjectURL(url));

      const params = {
        prompt: trimmedPrompt,
        width: 1024,
        height: 1024,
        negativePrompt: negativePrompt.trim(),
      };

      // Generate exactly 1 image
      const imagePromises = Array(1).fill(null).map(() => generateImage(params));
      const imageUrls = await Promise.all(imagePromises);
      setGeneratedImages(imageUrls);

      toast({
        title: "Success",
        description: "1 image generated successfully!",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate images";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [prompt, negativePrompt, generatedImages, queryClient]);

  const handleVoiceInput = useCallback((transcript: string) => {
    setPrompt(transcript);
  }, []);

  return (
    <div className="container max-w-6xl py-4 space-y-4 px-4 sm:px-6 md:px-8">
      <div className="grid gap-4 md:gap-8 lg:grid-cols-[1fr,auto]">
        <ImageSettings
          prompt={prompt}
          setPrompt={setPrompt}
          negativePrompt={negativePrompt}
          setNegativePrompt={setNegativePrompt}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          numImages={numImages}
          setNumImages={() => {}} // Disable changing number of images
          VoiceInput={<VoiceInput onTranscript={handleVoiceInput} />}
        />
        <div className="grid grid-cols-1 gap-4 auto-rows-fr">
          {Array(1).fill(null).map((_, index) => (
            <ImagePreview
              key={index}
              generatedImage={generatedImages[index] || null}
              isLoading={isLoading}
              error={error}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { generateImage, GenerateImageParams } from "@/lib/api";
import { ImageSettings } from "./image-generator/ImageSettings";
import { ImagePreview } from "./image-generator/ImagePreview";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { API_CONFIG } from "@/lib/api/constants";

const resolutions = [
  { value: "1:1", width: 1024, height: 1024, label: "Square" },
  { value: "16:9", width: 1024, height: 576, label: "Landscape" },
  { value: "9:16", width: 576, height: 1024, label: "Portrait" },
];

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("1:1");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
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
      if (generatedImage) {
        URL.revokeObjectURL(generatedImage);
      }

      const selectedResolution = resolutions.find((r) => r.value === resolution);
      if (!selectedResolution) {
        throw new Error("Invalid resolution selected");
      }

      const params: GenerateImageParams = {
        prompt: trimmedPrompt,
        width: selectedResolution.width,
        height: selectedResolution.height,
        negativePrompt: negativePrompt.trim(),
      };

      const imageUrl = await generateImage(params);
      setGeneratedImage(imageUrl);

      queryClient.prefetchQuery({
        queryKey: ['image', { ...params, prompt: trimmedPrompt + " detailed" }],
        queryFn: () => generateImage({ ...params, prompt: trimmedPrompt + " detailed" }),
      }).catch(console.error);

      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [prompt, resolution, negativePrompt, generatedImage, queryClient]);

  return (
    <div className="container max-w-6xl py-2 sm:py-4 md:py-6 space-y-4 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="grid gap-4 md:gap-6 lg:gap-8 lg:grid-cols-[1fr,1fr]">
        <div className="order-2 lg:order-1 transition-all duration-300 hover:scale-[1.01]">
          <ImageSettings
            prompt={prompt}
            setPrompt={setPrompt}
            negativePrompt={negativePrompt}
            setNegativePrompt={setNegativePrompt}
            resolution={resolution}
            setResolution={setResolution}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            resolutions={resolutions}
          />
        </div>
        <div className="order-1 lg:order-2 transition-all duration-300 hover:scale-[1.01]">
          <ImagePreview
            generatedImage={generatedImage}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
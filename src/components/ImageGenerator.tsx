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

      const params = {
        prompt: trimmedPrompt,
        width: 1024,
        height: 1024,
        negativePrompt: negativePrompt.trim(),
      };

      const imageUrl = await generateImage(params);
      setGeneratedImage(imageUrl);
      
      queryClient.prefetchQuery({
        queryKey: ['image', { ...params, prompt: trimmedPrompt + " detailed" }],
        queryFn: () => generateImage({ ...params, prompt: trimmedPrompt + " detailed" }),
      });

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
  }, [prompt, negativePrompt, generatedImage, queryClient]);

  const handleVoiceInput = useCallback((transcript: string) => {
    setPrompt(transcript);
  }, []);

  return (
    <div className="container max-w-6xl py-4 space-y-4 px-4 sm:px-6 md:px-8">
      <div className="grid gap-4 md:gap-8 lg:grid-cols-[1fr,1fr]">
        <ImageSettings
          prompt={prompt}
          setPrompt={setPrompt}
          negativePrompt={negativePrompt}
          setNegativePrompt={setNegativePrompt}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          VoiceInput={<VoiceInput onTranscript={handleVoiceInput} />}
        />
        <ImagePreview
          generatedImage={generatedImage}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
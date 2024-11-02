import { useState, useCallback, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { generateImage, GenerateImageParams } from "@/lib/api";
import { ImageSettings } from "./image-generator/ImageSettings";
import { ImagePreview } from "./image-generator/ImagePreview";
import { useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

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
  const [processingTime, setProcessingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout>();
  const startTime = useRef<number>(0);
  const queryClient = useQueryClient();

  const updateProgress = useCallback(() => {
    setProcessingTime((Date.now() - startTime.current) / 1000);
    setProgress((prev) => Math.min(prev + 2, 95)); // Increment progress but cap at 95%
  }, []);

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
    setProgress(0);
    setProcessingTime(0);
    startTime.current = Date.now();

    // Start progress updates
    progressInterval.current = setInterval(updateProgress, 100);

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
        negativePrompt: negativePrompt.trim() || undefined
      };

      const imageUrl = await generateImage(params);
      setGeneratedImage(imageUrl);
      setProgress(100);

      // Prefetch next possible generation
      queryClient.prefetchQuery({
        queryKey: ['image', params],
        queryFn: () => generateImage(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
      });

      toast({
        title: "Success",
        description: `Image generated in ${(Date.now() - startTime.current) / 1000}s!`,
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
      clearInterval(progressInterval.current);
      setIsLoading(false);
    }
  }, [prompt, resolution, negativePrompt, generatedImage, queryClient, updateProgress]);

  return (
    <div className="container max-w-6xl py-2 sm:py-4 md:py-6 space-y-4 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="grid gap-4 md:gap-6 lg:gap-8 lg:grid-cols-[1fr,1fr]">
        <div className="order-2 lg:order-1">
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
          {isLoading && (
            <div className="mt-4 space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-500 text-center">
                Processing... {processingTime.toFixed(1)}s
              </p>
            </div>
          )}
        </div>
        <div className="order-1 lg:order-2">
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
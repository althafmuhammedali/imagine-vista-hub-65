import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { generateImage } from "@/lib/api";
import { GeneratorForm } from "./image-generator/GeneratorForm";
import { ImagePreview } from "./image-generator/ImagePreview";

const resolutions = [
  { value: "1:1", width: 1024, height: 1024, label: "Square" },
  { value: "16:9", width: 1024, height: 576, label: "Landscape" },
  { value: "9:16", width: 576, height: 1024, label: "Portrait" },
] as const;

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState<typeof resolutions[number]["value"]>("1:1");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [seed, setSeed] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cleanup generated image URL on unmount
  useEffect(() => {
    return () => {
      if (generatedImage) {
        URL.revokeObjectURL(generatedImage);
      }
    };
  }, [generatedImage]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate an image",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const selectedResolution = resolutions.find((r) => r.value === resolution);

    if (!selectedResolution) {
      toast({
        title: "Error",
        description: "Invalid resolution selected",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Cleanup previous image URL if it exists
      if (generatedImage) {
        URL.revokeObjectURL(generatedImage);
      }

      const imageUrl = await generateImage({
        prompt: prompt.trim(),
        width: selectedResolution.width,
        height: selectedResolution.height,
        negativePrompt: negativePrompt.trim(),
        seed: seed ? parseInt(seed) : undefined,
      });
      
      setGeneratedImage(imageUrl);
      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate image",
        variant: "destructive",
      });
      setGeneratedImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl py-4 md:py-8 space-y-6 md:space-y-8 px-4 md:px-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
          ComicForge AI
        </h1>
        <p className="text-gray-500 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
          Transform your ideas into stunning comic-style images with our advanced AI model
        </p>
      </div>

      <div className="grid gap-6 md:gap-8 md:grid-cols-[1fr,1fr]">
        <GeneratorForm
          prompt={prompt}
          setPrompt={setPrompt}
          resolution={resolution}
          setResolution={setResolution}
          negativePrompt={negativePrompt}
          setNegativePrompt={setNegativePrompt}
          seed={seed}
          setSeed={setSeed}
          isLoading={isLoading}
          onGenerate={handleGenerate}
        />
        <ImagePreview
          isLoading={isLoading}
          generatedImage={generatedImage}
        />
      </div>
    </div>
  );
}
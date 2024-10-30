import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { generateImage, GenerateImageParams } from "@/lib/api";
import { ImageSettings } from "./image-generator/ImageSettings";
import { ImagePreview } from "./image-generator/ImagePreview";

const resolutions = [
  { value: "1:1", width: 1024, height: 1024, label: "Square" },
  { value: "16:9", width: 1024, height: 576, label: "Landscape" },
  { value: "9:16", width: 576, height: 1024, label: "Portrait" },
];

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("1:1");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [seed, setSeed] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (generatedImage) {
        URL.revokeObjectURL(generatedImage);
      }
    };
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const selectedResolution = resolutions.find((r) => r.value === resolution)!;

    try {
      if (generatedImage) {
        URL.revokeObjectURL(generatedImage);
      }

      const params: GenerateImageParams = {
        prompt: prompt.trim(),
        width: selectedResolution.width,
        height: selectedResolution.height,
        negativePrompt: negativePrompt.trim(),
        seed: seed ? parseInt(seed) : undefined,
      };

      const imageUrl = await generateImage(params);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div className="grid gap-8 md:grid-cols-[1fr,1fr]">
        <ImageSettings
          prompt={prompt}
          setPrompt={setPrompt}
          negativePrompt={negativePrompt}
          setNegativePrompt={setNegativePrompt}
          resolution={resolution}
          setResolution={setResolution}
          seed={seed}
          setSeed={setSeed}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          resolutions={resolutions}
        />
        <ImagePreview
          generatedImage={generatedImage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";
import { generateImage } from "@/lib/api/generateImage";
import { GenerationForm } from "./image-generator/GenerationForm";
import { ImagePreview } from "./image-generator/ImagePreview";
import { ImageGenerationMode } from "@/lib/api/types";

interface ImageGeneratorProps {
  mode?: ImageGenerationMode;
}

export function ImageGenerator({ mode = 'create' }: ImageGeneratorProps) {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleGenerate = async (prompt: string, negativePrompt: string) => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImages([]); // Clear previous images
    
    try {
      const image = await generateImage({
        prompt,
        negativePrompt,
        userId: user?.id,
        model: mode === 'enhance' ? 'stabilityai/stable-diffusion-xl-refiner-1.0' : 'stabilityai/stable-diffusion-xl-base-1.0'
      });
      setGeneratedImages([image]);
      toast({
        title: "Success",
        description: mode === 'enhance' ? "Image enhanced successfully!" : "Image generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate images",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <GenerationForm
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        mode={mode}
      />
      {generatedImages.length > 0 && (
        <ImagePreview
          generatedImage={generatedImages[0]}
          isLoading={isGenerating}
          prompt=""
        />
      )}
    </div>
  );
}
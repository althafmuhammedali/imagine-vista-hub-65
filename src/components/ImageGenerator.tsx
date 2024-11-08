import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";
import { generateImage } from "@/lib/api/generateImage";
import { GenerationForm } from "./image-generator/GenerationForm";
import { ImagePreview } from "./image-generator/ImagePreview";
import { Card } from "./ui/card";

export function ImageGenerator() {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useUser();

  const handleGenerate = async (userPrompt: string, negativePrompt: string) => {
    if (!userPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]); // Clear previous images
    
    try {
      const image = await generateImage({
        prompt: userPrompt,
        negativePrompt,
        userId: user?.id,
        model: 'stabilityai/stable-diffusion-xl-base-1.0'
      });
      
      setGeneratedImages([image]);
      setPrompt(userPrompt); // Save the original prompt for reference
      
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
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="p-6 bg-background/60 backdrop-blur-sm border-blue-900/20">
        <div className="space-y-6">
          <GenerationForm
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>
      </Card>
      
      {generatedImages.length > 0 && (
        <ImagePreview
          generatedImage={generatedImages[0]}
          isLoading={isGenerating}
          error={error}
          prompt={prompt}
        />
      )}
    </div>
  );
}
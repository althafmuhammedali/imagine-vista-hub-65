import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";
import { generateImage } from "@/lib/api/generateImage";
import { GenerationForm } from "./image-generator/GenerationForm";
import { ImagePreview } from "./image-generator/ImagePreview";
import { StyleControls } from "./image-generator/StyleControls";
import { PromptSuggestions } from "./image-generator/PromptSuggestions";
import { ImageGenerationMode } from "@/lib/api/types";
import { enhancePrompt } from "@/lib/api/promptEnhancer";
import { Card } from "./ui/card";

interface ImageGeneratorProps {
  mode?: ImageGenerationMode;
}

export function ImageGenerator({ mode = 'create' }: ImageGeneratorProps) {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [prompt, setPrompt] = useState("");
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
    setGeneratedImages([]); // Clear previous images
    
    try {
      // Enhance the prompt with selected style and quality parameters
      const enhancedPrompt = enhancePrompt(userPrompt, selectedStyle);
      
      const image = await generateImage({
        prompt: enhancedPrompt,
        negativePrompt,
        userId: user?.id,
        model: mode === 'enhance' ? 'stabilityai/stable-diffusion-xl-refiner-1.0' : 'stabilityai/stable-diffusion-xl-base-1.0'
      });
      
      setGeneratedImages([image]);
      setPrompt(userPrompt); // Save the original prompt for reference
      
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
      <Card className="p-6 bg-background/60 backdrop-blur-sm border-primary/20">
        <div className="space-y-6">
          <StyleControls
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
          />
          <GenerationForm
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            mode={mode}
          />
          <PromptSuggestions
            inputText={prompt}
            onSuggestionClick={(suggestion) => setPrompt(suggestion)}
            selectedStyle={selectedStyle}
          />
        </div>
      </Card>
      
      {generatedImages.length > 0 && (
        <ImagePreview
          generatedImage={generatedImages[0]}
          isLoading={isGenerating}
          prompt={prompt}
        />
      )}
    </div>
  );
}
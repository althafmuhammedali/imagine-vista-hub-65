import { useState, useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { generateImage } from "@/lib/api/imageGeneration";
import { ImageSettings } from "./image-generator/ImageSettings";
import { ImagePreview } from "./image-generator/ImagePreview";
import { VoiceInput } from "./VoiceInput";
import { enhancePrompt, enhanceNegativePrompt } from "@/lib/api/promptEnhancer";
import { translateToEnglish } from "@/lib/api/translation";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  // Cleanup URLs when component unmounts or when new images are generated
  useEffect(() => {
    return () => {
      generatedImages.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          console.error('Failed to revoke URL:', e);
        }
      });
    };
  }, [generatedImages]);

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
      // Cleanup previous URLs before generating new ones
      generatedImages.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          console.error('Failed to revoke URL:', e);
        }
      });
      setGeneratedImages([]);

      // Translation handling
      let translatedPrompt = trimmedPrompt;
      let translatedNegativePrompt = negativePrompt;

      if (selectedLanguage !== "en") {
        console.log('Translating prompt from', selectedLanguage, 'to English');
        translatedPrompt = await translateToEnglish(trimmedPrompt, selectedLanguage);
        if (negativePrompt) {
          translatedNegativePrompt = await translateToEnglish(negativePrompt, selectedLanguage);
        }
      }

      console.log('Enhanced prompt:', enhancePrompt(translatedPrompt));
      console.log('Enhanced negative prompt:', enhanceNegativePrompt(translatedNegativePrompt.trim()));

      const imageUrl = await generateImage({
        prompt: enhancePrompt(translatedPrompt),
        width: window.innerWidth >= 1024 ? 1024 : 512,
        height: window.innerWidth >= 1024 ? 1024 : 512,
        negativePrompt: enhanceNegativePrompt(translatedNegativePrompt.trim()),
      });

      if (!imageUrl) {
        throw new Error('Failed to generate image: No URL returned');
      }

      console.log('Generated image URL:', imageUrl);
      setGeneratedImages([imageUrl]);
      setError(undefined);

      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
      console.error('Image generation error:', error);
      setError(errorMessage);
      setGeneratedImages([]);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [prompt, negativePrompt, generatedImages, selectedLanguage]);

  const handleVoiceInput = useCallback((transcript: string) => {
    if (transcript?.trim()) {
      setPrompt(transcript);
    }
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto py-2 sm:py-4 md:py-6 lg:py-8 px-2 sm:px-4 lg:px-6 backdrop-blur-xl bg-gradient-to-b from-background/10 via-background/50 to-background/10 border border-border/50 rounded-lg shadow-2xl">
      <div className="grid gap-4 md:gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="order-2 lg:order-1">
          <ImageSettings
            prompt={prompt}
            setPrompt={setPrompt}
            negativePrompt={negativePrompt}
            setNegativePrompt={setNegativePrompt}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            numImages={1}
            setNumImages={() => {}}
            VoiceInput={<VoiceInput onTranscript={handleVoiceInput} selectedLanguage={selectedLanguage} />}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </div>
        <div className="order-1 lg:order-2">
          <ImagePreview
            generatedImage={generatedImages[0] || null}
            isLoading={isLoading}
            error={error}
            prompt={prompt}
          />
        </div>
      </div>
    </div>
  );
}
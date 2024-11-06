import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { generateImage } from "@/lib/api/imageGeneration";
import { ImageSettings } from "./image-generator/ImageSettings";
import { ImagePreview } from "./image-generator/ImagePreview";
import { VoiceInput } from "./VoiceInput";
import { enhancePrompt, enhanceNegativePrompt } from "@/lib/api/promptEnhancer";

const translateToEnglish = async (text: string, sourceLang: string): Promise<string> => {
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-${sourceLang}-en`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const result = await response.json();
    return result[0].translation_text;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate prompt');
  }
};

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

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

      // Translate prompt if not in English
      let translatedPrompt = trimmedPrompt;
      if (selectedLanguage !== "en") {
        try {
          translatedPrompt = await translateToEnglish(trimmedPrompt, selectedLanguage);
        } catch (error) {
          toast({
            title: "Translation Error",
            description: "Failed to translate prompt. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      const params = {
        prompt: enhancePrompt(translatedPrompt),
        width: 1024,
        height: 1024,
        negativePrompt: enhanceNegativePrompt(negativePrompt.trim()),
      };

      const imageUrl = await generateImage(params);
      setGeneratedImages([imageUrl]);

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
  }, [prompt, negativePrompt, generatedImages, selectedLanguage]);

  const handleVoiceInput = useCallback((transcript: string) => {
    setPrompt(transcript);
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8 backdrop-blur-xl bg-gradient-to-b from-background/10 via-background/50 to-background/10 border border-border/50 rounded-lg shadow-2xl">
      <div className="grid gap-6 md:gap-8 lg:grid-cols-[1.2fr,0.8fr]">
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
        <ImagePreview
          generatedImage={generatedImages[0] || null}
          isLoading={isLoading}
          error={error}
          prompt={prompt}
        />
      </div>
    </div>
  );
}
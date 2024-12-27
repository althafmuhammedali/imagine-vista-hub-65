import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ImageSettings } from "./image-generator/ImageSettings";
import { ImageDisplay } from "./image-generator/ImageDisplay";
import { PromptSuggestions } from "./image-generator/PromptSuggestions";
import { VoiceInput } from "./VoiceInput";
import { translateToEnglish } from "@/lib/api/translation";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [numImages, setNumImages] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const translatedPrompt = await translateToEnglish(prompt, selectedLanguage);
      const translatedNegativePrompt = negativePrompt 
        ? await translateToEnglish(negativePrompt, selectedLanguage)
        : '';

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: translatedPrompt,
          negativePrompt: translatedNegativePrompt,
          numImages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setGeneratedImages(data.images);
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = (text: string) => {
    setPrompt(text);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <ImageSettings
            prompt={prompt}
            setPrompt={setPrompt}
            negativePrompt={negativePrompt}
            setNegativePrompt={setNegativePrompt}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            numImages={numImages}
            setNumImages={setNumImages}
            VoiceInput={<VoiceInput onVoiceInput={handleVoiceInput} selectedLanguage={selectedLanguage} />}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
          <PromptSuggestions
            inputText={prompt}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
        <ImageDisplay images={generatedImages} isLoading={isLoading} />
      </div>
    </div>
  );
}
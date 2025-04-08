
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ImageSettings } from "./image-generator/ImageSettings";
import { ImageDisplay } from "@/components/ImageDisplay";
import { PromptSuggestions } from "./image-generator/PromptSuggestions";
import { VoiceInput } from "./VoiceInput";
import { translateToEnglish } from "@/lib/api/translation";

interface GenerateResponse {
  images: string[];
  error?: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [numImages, setNumImages] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { toast } = useToast();

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const checkNetworkConnectivity = async () => {
    try {
      console.log("Checking network connectivity...");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/health`, { 
        cache: 'no-cache',
        headers: { 'Cache-Control': 'no-cache' }
      });
      console.log("Network check response:", response.ok);
      return response.ok;
    } catch (error) {
      console.error("Network connectivity check failed:", error);
      return false;
    }
  };

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    // Check network connectivity first
    const isConnected = await checkNetworkConnectivity();
    if (!isConnected) {
      toast({
        title: "Network Error",
        description: "Please check your internet connection and try again",
        variant: "destructive",
      });
      return;
    }

    let retries = 0;
    setIsLoading(true);
    setGeneratedImages([]);
    
    while (retries < MAX_RETRIES) {
      try {
        console.log("Translating prompt if needed...");
        const translatedPrompt = await translateToEnglish(prompt, selectedLanguage);
        const translatedNegativePrompt = negativePrompt 
          ? await translateToEnglish(negativePrompt, selectedLanguage)
          : '';

        console.log("Translated prompt:", translatedPrompt);
        console.log("Translated negative prompt:", translatedNegativePrompt);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

        console.log("Sending generate request...");
        console.log("API URL:", import.meta.env.VITE_API_URL);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          },
          signal: controller.signal,
          body: JSON.stringify({
            prompt: translatedPrompt,
            negativePrompt: translatedNegativePrompt,
            numImages,
          }),
        });

        clearTimeout(timeoutId);
        console.log("Generate response status:", response.status);

        if (!response.ok) {
          const data = await response.json();
          console.error("API Error:", data);
          throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        const data: GenerateResponse = await response.json();
        console.log("Generated images:", data.images?.length || 0);
        
        if (!data.images || data.images.length === 0) {
          throw new Error("No images were generated");
        }
        
        setGeneratedImages(data.images);
        toast({
          title: "Success",
          description: "Image generated successfully!",
        });
        break;
        
      } catch (error) {
        console.error('Generation error:', error);
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            toast({
              title: "Timeout",
              description: "Request timed out. Please try again.",
              variant: "destructive",
            });
            break;
          }

          if (retries === MAX_RETRIES - 1) {
            let errorMessage = "Failed to generate image. Please try again.";
            
            if (error.message.includes("Failed to fetch") || 
                error.message.includes("NetworkError") || 
                error.message.includes("network")) {
              errorMessage = "Network error. Please check your internet connection and try again.";
            } else if (error.message.includes("timeout")) {
              errorMessage = "Request timed out. Please try again with a simpler prompt.";
            } else if (error.message.includes("API key") || error.message.includes("401")) {
              errorMessage = "API configuration error. Please check your API key.";
            } else if (error.message.includes("busy") || error.message.includes("loading")) {
              errorMessage = "The AI model is currently busy. Please try again in a few moments.";
            } else if (error.message.includes("rate limit") || error.message.includes("429")) {
              errorMessage = "Rate limit exceeded. Please try again later.";
            }
            
            toast({
              title: "Error",
              description: errorMessage,
              variant: "destructive",
            });
          } else {
            // Wait before retrying with exponential backoff
            const delay = RETRY_DELAY * Math.pow(2, retries);
            console.log(`Retrying in ${delay}ms...`);
            await sleep(delay);
          }
        }
        
        retries++;
      }
    }
    
    setIsLoading(false);
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
            VoiceInput={<VoiceInput onTranscript={handleVoiceInput} selectedLanguage={selectedLanguage} />}
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

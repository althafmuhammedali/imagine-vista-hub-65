import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ImagePlus } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { generateImage } from "@/lib/api/generateImage";

interface ImageGeneratorProps {
  mode?: 'create' | 'enhance';
}

export function ImageGenerator({ mode = 'create' }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const images = await generateImage({
        prompt,
        negativePrompt,
        userId: user?.id,
      });
      setGeneratedImages(images);
      toast({
        title: "Success",
        description: "Images generated successfully!",
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
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="prompt" className="block text-sm font-medium text-foreground">
            Prompt
          </label>
          <Textarea
            id="prompt"
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="negativePrompt" className="block text-sm font-medium text-foreground">
            Negative Prompt (Optional)
          </label>
          <Input
            id="negativePrompt"
            placeholder="What to avoid in the generated image..."
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full sm:w-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ImagePlus className="mr-2 h-4 w-4" />
              Generate
            </>
          )}
        </Button>
      </div>

      {generatedImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {generatedImages.map((image, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={image}
                alt={`Generated image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
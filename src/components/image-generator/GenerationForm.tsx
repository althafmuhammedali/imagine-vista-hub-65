import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, ImagePlus } from "lucide-react";
import { ImageGenerationMode } from "@/lib/api/types";

interface GenerationFormProps {
  onGenerate: (prompt: string, negativePrompt: string) => Promise<void>;
  isGenerating: boolean;
  mode: ImageGenerationMode;
}

export function GenerationForm({ onGenerate, isGenerating, mode }: GenerationFormProps) {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerate(prompt, negativePrompt);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="prompt" className="block text-sm font-medium text-foreground">
          {mode === 'enhance' ? 'Enhancement Prompt' : 'Creation Prompt'}
        </label>
        <Textarea
          id="prompt"
          placeholder={mode === 'enhance' 
            ? "Describe how you want to enhance the image..."
            : "Enter your prompt here..."}
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
        type="submit"
        disabled={isGenerating || !prompt.trim()}
        className="w-full sm:w-auto"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === 'enhance' ? 'Enhancing...' : 'Generating...'}
          </>
        ) : (
          <>
            <ImagePlus className="mr-2 h-4 w-4" />
            {mode === 'enhance' ? 'Enhance' : 'Generate'}
          </>
        )}
      </Button>
    </form>
  );
}
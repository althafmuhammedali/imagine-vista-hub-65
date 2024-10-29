import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { generateImage, GenerateImageParams } from "@/lib/api";
import { Loader2 } from "lucide-react";

const resolutions = [
  { value: "1:1", width: 512, height: 512 },
  { value: "16:9", width: 512, height: 288 },
  { value: "9:16", width: 288, height: 512 },
];

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("1:1");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [seed, setSeed] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          FLUX.1 Image Generator
        </h1>
        <p className="text-gray-500 md:text-lg">
          Transform your ideas into stunning images with FLUX.1 AI model
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-24"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="negative-prompt">Negative Prompt (Optional)</Label>
            <Input
              id="negative-prompt"
              placeholder="What to exclude..."
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seed">Seed (Optional)</Label>
            <Input
              id="seed"
              type="number"
              placeholder="Enter seed value..."
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
            />
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Image"
          )}
        </Button>
      </Card>

      {(generatedImage || isLoading) && (
        <Card className="p-6">
          <div className="aspect-square relative rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="w-full h-full bg-gray-100 animate-pulse" />
            ) : (
              <img
                src={generatedImage!}
                alt="Generated"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
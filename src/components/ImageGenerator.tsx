import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { generateImage, GenerateImageParams } from "@/lib/api";
import { Loader2, Wand2, Image as ImageIcon } from "lucide-react";

const resolutions = [
  { value: "1:1", width: 1024, height: 1024, label: "Square" },
  { value: "16:9", width: 1024, height: 576, label: "Landscape" },
  { value: "9:16", width: 576, height: 1024, label: "Portrait" },
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
    <div className="container max-w-6xl py-8 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
          ComicForge AI
        </h1>
        <p className="text-gray-500 md:text-lg max-w-2xl mx-auto">
          Transform your ideas into stunning comic-style images with our advanced AI model
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr,1fr]">
        <Card className="p-6 space-y-6">
          <CardHeader className="p-0">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Wand2 className="w-6 h-6" />
              Image Settings
            </CardTitle>
            <CardDescription>
              Configure your image generation parameters
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Describe what you want to see..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-24 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="negative-prompt">Negative Prompt (Optional)</Label>
              <Input
                id="negative-prompt"
                placeholder="What to exclude from the image..."
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution</Label>
                <select
                  id="resolution"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  {resolutions.map((res) => (
                    <option key={res.value} value={res.value}>
                      {res.label} ({res.width}x{res.height})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seed">Seed (Optional)</Label>
                <Input
                  id="seed"
                  type="number"
                  placeholder="Random seed..."
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                />
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Generate Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          {(generatedImage || isLoading) && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Creating your masterpiece...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full p-4">
                  <img
                    src={generatedImage!}
                    alt="Generated"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
          {!generatedImage && !isLoading && (
            <div className="flex items-center justify-center h-full min-h-[400px] text-muted-foreground">
              <div className="text-center space-y-4">
                <ImageIcon className="w-12 h-12 mx-auto opacity-50" />
                <p>Your generated image will appear here</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

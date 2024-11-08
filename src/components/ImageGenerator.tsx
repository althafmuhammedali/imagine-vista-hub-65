import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ImagePlus, Download, Upload } from "lucide-react";
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
    // Clear previous images before generating new ones
    setGeneratedImages([]);
    
    try {
      const image = await generateImage({
        prompt,
        negativePrompt,
        userId: user?.id,
      });
      setGeneratedImages([image]);
      toast({
        title: "Success",
        description: "Image generated successfully!",
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

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comicforgeai_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Image downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async (imageUrl: string) => {
    try {
      toast({
        title: "Uploading",
        description: "Please wait while we upload your image...",
      });

      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('image', blob, `comicforgeai_${Date.now()}.png`);
      formData.append('key', '73ffc7abc53c74281c83c278d6a9a82b');

      const uploadResponse = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await uploadResponse.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Image uploaded successfully!",
        });
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
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
            <div key={index} className="relative aspect-square group">
              <img
                src={image}
                alt={`Generated image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-row gap-3 bg-black/80 backdrop-blur-md p-2 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={() => handleUpload(image)}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-full transition-all duration-300 flex items-center gap-2 px-4 py-2"
                  size="sm"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload</span>
                </Button>
                <Button
                  onClick={() => handleDownload(image)}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-full transition-all duration-300 flex items-center gap-2 px-4 py-2"
                  size="sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

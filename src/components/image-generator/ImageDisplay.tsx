import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ImageDisplayProps {
  images: string[];
  isLoading: boolean;
}

export function ImageDisplay({ images, isLoading }: ImageDisplayProps) {
  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center bg-black/20 border-gray-800/50">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </Card>
    );
  }

  if (images.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center bg-black/20 border-gray-800/50">
        <p className="text-gray-400">Generated images will appear here</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4 bg-black/20 border-gray-800/50">
      <div className="grid grid-cols-1 gap-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Generated image ${index + 1}`}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        ))}
      </div>
    </Card>
  );
}
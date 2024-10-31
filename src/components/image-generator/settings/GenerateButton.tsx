import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenerateButtonProps {
  onGenerate: () => void;
  isLoading: boolean;
}

export function GenerateButton({ onGenerate, isLoading }: GenerateButtonProps) {
  return (
    <Button
      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg group relative overflow-hidden"
      size="lg"
      onClick={onGenerate}
      disabled={isLoading}
    >
      <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Creating Magic...
        </>
      ) : (
        <>
          <Wand2 className="w-4 h-4 mr-2" />
          Generate Artwork
        </>
      )}
    </Button>
  );
}
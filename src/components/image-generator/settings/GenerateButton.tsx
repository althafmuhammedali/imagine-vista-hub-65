
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenerateButtonProps {
  onGenerate: () => void;
  isLoading: boolean;
}

export function GenerateButton({ onGenerate, isLoading }: GenerateButtonProps) {
  return (
    <Button
      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg transform transition-transform hover:scale-[1.02] will-change-transform"
      size="lg"
      onClick={onGenerate}
      disabled={isLoading}
      aria-label={isLoading ? "Generating image" : "Generate artwork with FLUX.1"}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Creating with FLUX.1...
        </>
      ) : (
        <>
          <Wand2 className="w-4 h-4 mr-2" />
          Generate with FLUX.1
        </>
      )}
    </Button>
  );
}

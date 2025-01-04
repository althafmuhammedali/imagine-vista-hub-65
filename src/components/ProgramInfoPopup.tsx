import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProgramInfoPopup() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-amber-500/10"
        >
          <Info className="h-5 w-5 text-amber-400" />
          <span className="sr-only">Program Information</span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-black/90 border-gray-800">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-amber-400">About ComicForge AI</h4>
          <p className="text-sm text-gray-400">
            ComicForge AI is an advanced image generation platform that helps you create
            stunning artwork using state-of-the-art AI technology.
          </p>
          <div className="pt-2 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Hover over this icon anytime to learn more about our features
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
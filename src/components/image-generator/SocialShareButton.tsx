import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

interface SocialShareButtonProps {
  imageUrl: string;
}

export function SocialShareButton({ imageUrl }: SocialShareButtonProps) {
  const shareUrl = window.location.href;
  const shareText = "Check out this amazing AI-generated artwork I created with ComicForge AI! 🎨✨ #AIArt #ComicForgeAI #DigitalArt";

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share it with your friends",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-6 left-6 rounded-full border-gray-800 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
        >
          <Share2 className="h-4 w-4 text-gray-400 hover:text-amber-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/90 border-gray-800">
        <DropdownMenuItem
          className="text-gray-400 hover:text-amber-400 cursor-pointer"
          onClick={() => window.open(shareLinks.twitter, '_blank')}
        >
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-gray-400 hover:text-amber-400 cursor-pointer"
          onClick={() => window.open(shareLinks.facebook, '_blank')}
        >
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-gray-400 hover:text-amber-400 cursor-pointer"
          onClick={() => window.open(shareLinks.linkedin, '_blank')}
        >
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-gray-400 hover:text-amber-400 cursor-pointer"
          onClick={() => window.open(shareLinks.whatsapp, '_blank')}
        >
          Share on WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-gray-400 hover:text-amber-400 cursor-pointer"
          onClick={copyToClipboard}
        >
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
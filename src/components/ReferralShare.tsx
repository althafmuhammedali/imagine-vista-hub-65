import { Share2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "./ui/use-toast";

export function ReferralShare() {
  const shareUrl = "https://comicforgeai.vercel.app";
  const shareText = "Create amazing AI art with ComicForge AI! 🎨✨";

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

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank');
    toast({
      title: "Sharing",
      description: `Opening ${platform} to share ComicForge AI`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-gray-800 bg-black/20 hover:bg-amber-500/20 hover:border-amber-500"
        >
          <Share2 className="h-4 w-4 text-gray-400 hover:text-amber-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/90 border-gray-800">
        <DropdownMenuItem
          className="text-gray-400 hover:text-amber-400 cursor-pointer"
          onClick={() => handleShare('twitter')}
        >
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-gray-400 hover:text-amber-400 cursor-pointer"
          onClick={() => handleShare('facebook')}
        >
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-gray-400 hover:text-amber-400 cursor-pointer"
          onClick={() => handleShare('linkedin')}
        >
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-gray-400 hover:text-amber-400 cursor-pointer"
          onClick={() => handleShare('whatsapp')}
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
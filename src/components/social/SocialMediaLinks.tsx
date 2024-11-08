import { Facebook, Instagram, Linkedin, Phone, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const socialLinks = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=100084139741037",
    label: "Facebook",
  },
  {
    icon: X,
    href: "https://x.com/MuhammadAd93421",
    label: "X (Twitter)",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/ai.adnanvv/",
    label: "Instagram",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/muhammedadnanvv/",
    label: "LinkedIn",
  },
  {
    icon: Phone,
    href: "https://wa.me/919656778508",
    label: "WhatsApp",
  },
  {
    icon: MessageSquare,
    href: "https://discord.com/invite/vCPH2pFH",
    label: "Discord",
  },
];

export function SocialMediaLinks() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
      {socialLinks.map((link) => (
        <Tooltip key={link.label}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-amber-800 bg-black/20 hover:bg-amber-900/40 hover:border-amber-500 transform hover:scale-110 transition-all duration-300 hover:text-amber-400"
              asChild
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                <link.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{link.label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
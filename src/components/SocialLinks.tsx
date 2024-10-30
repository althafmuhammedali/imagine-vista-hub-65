import { Heart, Instagram, Linkedin, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export function SocialLinks() {
  const { toast } = useToast();

  const socialLinks = [
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
  ];

  const handleDonateClick = () => {
    toast({
      title: "Support Our Service",
      description: "We need your support to maintain our servers and models. Please donate to UPI ID: adnanmuhammad4393@okicici",
      duration: 10000,
    });
  };

  return (
    <footer className="w-full py-6 mt-8 border-t">
      <div className="container flex flex-col items-center gap-6">
        <p className="text-sm text-muted-foreground">
          Built and maintained by Muhammed Adnan
        </p>
        <div className="flex justify-center items-center gap-4">
          <TooltipProvider>
            {socialLinks.map((link) => (
              <Tooltip key={link.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    asChild
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                    >
                      <link.icon className="h-4 w-4" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{link.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={handleDonateClick}
                >
                  <Heart className="h-4 w-4 text-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Donate</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </footer>
  );
}
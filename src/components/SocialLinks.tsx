import { Heart, Instagram, Linkedin, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
    const options = {
      key: "rzp_live_5JYQnqKRnKhB5y",
      amount: 40 * 100, // Amount in paise (₹40)
      currency: "INR",
      name: "ComicForge AI",
      description: "Support our AI service",
      handler: function(response: any) {
        toast({
          title: "Thank you!",
          description: `Payment successful! Payment ID: ${response.razorpay_payment_id}`,
          duration: 5000,
        });
      },
      prefill: {
        name: "",
        email: "",
      },
      theme: {
        color: "#F59E0B",
      },
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response: any) {
      toast({
        title: "Payment Failed",
        description: "Something went wrong with your payment. Please try again.",
        variant: "destructive",
      });
    });

    rzp.open();
  };

  return (
    <footer className="w-full py-8 mt-12 border-t border-gray-800">
      <div className="container flex flex-col items-center gap-6">
        <p className="text-sm text-gray-400">
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
                    className="rounded-full border-gray-800 bg-black/20 hover:bg-amber-500/20 hover:border-amber-500"
                    asChild
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                    >
                      <link.icon className="h-4 w-4 text-gray-400 hover:text-amber-400" />
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
                  className="rounded-full border-gray-800 bg-black/20 hover:bg-amber-500/20 hover:border-amber-500"
                  onClick={handleDonateClick}
                >
                  <Heart className="h-4 w-4 text-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Donate ₹40</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </footer>
  );
}
import { Instagram, Linkedin, Phone, Facebook, X, MessageSquare, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { ReferralShare } from "./ReferralShare";
import { PaymentDialog } from "./payments/PaymentDialog";
import { useToast } from "@/components/ui/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export function SocialLinks() {
  const { toast } = useToast();
  
  const handleDonateClick = () => {
    if (!window.Razorpay) {
      toast({
        title: "Error",
        description: "Razorpay SDK not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    const options = {
      key: "rzp_live_5JYQnqKRnKhB5y",
      amount: 100 * 100,
      currency: "INR",
      name: "ComicForge AI",
      description: "Support our AI service",
      handler: function(response: RazorpayResponse) {
        if (response.razorpay_payment_id) {
          toast({
            title: "Thank you for your support!",
            description: `Payment successful! ID: ${response.razorpay_payment_id}`,
          });
        }
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#F59E0B",
      },
      modal: {
        ondismiss: function() {
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment. Feel free to try again!",
          });
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        toast({
          title: "Payment Failed",
          description: response.error.description || "Something went wrong with your payment. Please try again.",
          variant: "destructive",
        });
      });

      rzp.open();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      console.error("Razorpay error:", error);
    }
  };

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

  return (
    <footer className="w-full py-8 mt-12 border-t border-gray-800">
      <div className="container flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-amber-400">
          <Globe className="h-5 w-5" />
          <p className="text-sm">Kerala's First AI Image Generation Platform</p>
        </div>

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
            
            <PaymentDialog handleRazorpayClick={handleDonateClick} />

            <Tooltip>
              <TooltipTrigger asChild>
                <ReferralShare />
              </TooltipTrigger>
              <TooltipContent>
                <p>Share ComicForge AI</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <a 
          href="https://www.producthunt.com/posts/comicforgeai?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-comicforgeai"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-90 transition-opacity mt-4"
        >
          <img 
            src="https://s3.producthunt.com/static/badges/daily1.svg"
            alt="ComicForge AI - Daily #1 Product on Product Hunt"
            className="h-10 w-auto"
          />
        </a>
      </div>
    </footer>
  );
}
import { Heart, Instagram, Linkedin, Phone, Facebook, X, MessageSquare, IndianRupee } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { ReferralShare } from "./ReferralShare";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const UPI_ID = "adnanvv786@ybl";

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
      amount: 100 * 100, // Amount in paise (₹100)
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

  const handleUPIClick = async () => {
    try {
      // Create UPI payment URL
      const upiUrl = `upi://pay?pa=${UPI_ID}&pn=ComicForge%20AI&tn=Donation`;
      
      // Check if on mobile
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.href = upiUrl;
      } else {
        // Copy UPI ID on desktop
        await navigator.clipboard.writeText(UPI_ID);
        toast({
          title: "UPI ID Copied!",
          description: "Open your UPI app and paste the ID to donate.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process UPI payment. Please try again.",
        variant: "destructive",
      });
    }
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
            
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-gray-800 bg-black/20 hover:bg-amber-500/20 hover:border-amber-500"
                >
                  <Heart className="h-4 w-4 text-red-500" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Choose Payment Method</DialogTitle>
                  <DialogDescription>
                    Support ComicForge AI by making a donation
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleDonateClick}
                    className="flex items-center gap-2"
                  >
                    <IndianRupee className="h-4 w-4" />
                    Razorpay (₹100)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleUPIClick}
                    className="flex items-center gap-2"
                  >
                    <IndianRupee className="h-4 w-4" />
                    UPI Direct
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

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
      </div>
    </footer>
  );
}
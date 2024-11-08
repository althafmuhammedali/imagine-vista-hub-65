import { Instagram, Linkedin, Phone, Facebook, X, MessageSquare, Globe, Heart, IndianRupee } from "lucide-react";
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
      amount: 599 * 100, // Changed from 100 to 599
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
      color: "hover:text-amber-400",
    },
    {
      icon: X,
      href: "https://x.com/MuhammadAd93421",
      label: "X (Twitter)",
      color: "hover:text-amber-400",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/ai.adnanvv/",
      label: "Instagram",
      color: "hover:text-amber-400",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/muhammedadnanvv/",
      label: "LinkedIn",
      color: "hover:text-amber-400",
    },
    {
      icon: Phone,
      href: "https://wa.me/919656778508",
      label: "WhatsApp",
      color: "hover:text-amber-400",
    },
    {
      icon: MessageSquare,
      href: "https://discord.com/invite/vCPH2pFH",
      label: "Discord",
      color: "hover:text-amber-400",
    },
  ];

  return (
    <footer className="w-full py-6 sm:py-8 mt-8 sm:mt-12 border-t border-amber-900/20 bg-black/90 backdrop-blur-sm z-10">
      <div className="container flex flex-col items-center gap-4 sm:gap-6 px-4 sm:px-6">
        <div className="flex items-center gap-2 text-amber-400">
          <Globe className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
          <p className="text-sm sm:text-base font-medium">Kerala's First AI Image Generation Platform</p>
        </div>

        <p className="text-xs sm:text-sm text-amber-300">
          Built and maintained by Muhammed Adnan
        </p>

        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
          <TooltipProvider>
            {socialLinks.map((link) => (
              <Tooltip key={link.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full border-amber-800 bg-black/20 hover:bg-amber-900/40 hover:border-amber-500 transform hover:scale-110 transition-all duration-300 ${link.color}`}
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
        
        {/* Feedback Section */}
        <div className="w-full max-w-md mt-6 p-4 bg-black/40 rounded-lg border border-amber-900/20">
          <h3 className="text-amber-400 font-semibold mb-4">Share Your Feedback</h3>
          <textarea 
            className="w-full p-2 rounded bg-black/20 border border-amber-900/20 text-white placeholder-amber-700/50 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="We'd love to hear your thoughts..."
            rows={3}
          />
          <Button 
            className="mt-2 bg-amber-500 hover:bg-amber-600 text-black font-medium"
            onClick={() => toast({
              title: "Thank you!",
              description: "Your feedback has been submitted successfully.",
            })}
          >
            Submit Feedback
          </Button>
        </div>

        <a 
          href="https://www.producthunt.com/posts/comicforgeai?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-comicforgeai"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-90 transition-opacity mt-2 sm:mt-4"
        >
          <img 
            src="https://s3.producthunt.com/static/badges/daily1.svg"
            alt="ComicForge AI - Daily #1 Product on Product Hunt"
            className="h-8 sm:h-10 w-auto"
          />
        </a>
      </div>
    </footer>
  );
}
import { useEffect } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function DonationNotification() {
  const { toast: uiToast } = useToast();

  const handleDonateClick = () => {
    if (!window.Razorpay) {
      uiToast({
        title: "Error",
        description: "Razorpay SDK not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    const options = {
      key: "rzp_live_5JYQnqKRnKhB5y",
      amount: 399 * 100,
      currency: "INR",
      name: "Support Us",
      description: "Support our AI service",
      handler: function(response: any) {
        if (response.razorpay_payment_id) {
          uiToast({
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
          uiToast({
            title: "Payment Cancelled",
            description: "You cancelled the payment. Feel free to try again!",
          });
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        uiToast({
          title: "Payment Failed",
          description: response.error.description || "Something went wrong with your payment. Please try again.",
          variant: "destructive",
        });
      });

      rzp.open();
    } catch (error) {
      uiToast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      console.error("Razorpay error:", error);
    }
  };

  useEffect(() => {
    const showDonationToast = () => {
      toast("Support ComicForge AI", {
        description: "Please consider donating to help us improve our AI models!",
        action: {
          label: "Donate",
          onClick: handleDonateClick,
        },
        icon: <Heart className="h-4 w-4 text-red-500" />,
        duration: 10000,
      });
    };

    // Show initially after 30 seconds
    const initialTimeout = setTimeout(showDonationToast, 30000);

    // Show every 30 minutes
    const interval = setInterval(showDonationToast, 30 * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return null;
}
import { useEffect } from "react";
import { toast } from "sonner";
import { Heart, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DonationNotification() {
  const { toast: uiToast } = useToast();

  const handleDonateClick = () => {
    if (typeof window.Razorpay === 'undefined') {
      console.error('Razorpay SDK not loaded');
      uiToast({
        title: "Error",
        description: "Payment system is not ready. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    const options = {
      key: "rzp_live_5JYQnqKRnKhB5y",
      amount: 399 * 100,
      currency: "INR",
      name: "Support ComicForge AI",
      description: "Support our AI service",
      handler: function(response: any) {
        if (response.razorpay_payment_id) {
          console.log('Payment successful:', response.razorpay_payment_id);
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
          console.log('Payment modal closed');
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
        console.error('Payment failed:', response.error);
        uiToast({
          title: "Payment Failed",
          description: response.error.description || "Something went wrong with your payment. Please try again.",
          variant: "destructive",
        });
      });

      // Show payment warning toast
      uiToast({
        title: "Important Payment Information",
        description: "Make sure you pay the amount quickly; otherwise, the payment will fail, and you'll have to wait 7 days to get the amount credited back to your account.",
        variant: "destructive", // Changed from "warning" to "destructive" since it's not a supported variant
      });

      rzp.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      uiToast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const showDonationToast = () => {
      toast("Support ComicForge AI", {
        description: "Please consider supporting our AI models!",
        action: {
          label: "Support",
          onClick: handleDonateClick,
        },
        icon: <Heart className="h-4 w-4 text-red-500" />,
        duration: 10000,
      });
    };

    // Show initially after 30 seconds
    const initialTimeout = setTimeout(showDonationToast, 30000);

    // Show every 5 minutes
    const interval = setInterval(showDonationToast, 5 * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return null;
}
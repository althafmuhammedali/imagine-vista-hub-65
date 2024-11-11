import { useEffect } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";

export function DonationNotification() {
  useEffect(() => {
    const showDonationToast = () => {
      toast("Support ComicForge AI", {
        description: "Please consider donating to help us improve our AI models!",
        action: {
          label: "Donate",
          onClick: () => document.querySelector<HTMLButtonElement>('[aria-label="Donate"]')?.click(),
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

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UPIDonationDialog } from "./payments/UPIDonationDialog";

export function DonationNotification() {
  const { toast: uiToast } = useToast();
  const [showUpiDialog, setShowUpiDialog] = useState(false);

  const handleDonateClick = () => {
    setShowUpiDialog(true);
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

  return (
    <>
      <UPIDonationDialog open={showUpiDialog} onOpenChange={setShowUpiDialog} />
    </>
  );
}

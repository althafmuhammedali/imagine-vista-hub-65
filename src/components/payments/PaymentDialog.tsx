import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, IndianRupee } from "lucide-react";
import { UPIDialog } from "./UPIDialog";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface PaymentDialogProps {
  handleRazorpayClick: () => void;
}

export function PaymentDialog({ handleRazorpayClick }: PaymentDialogProps) {
  const [showUPIDialog, setShowUPIDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      await handleRazorpayClick();
    } catch (error) {
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Payment failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-blue-800 bg-black/20 hover:bg-blue-500/20 hover:border-blue-500 transition-all duration-300"
        >
          <Heart className="h-4 w-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-sm border-blue-900/20">
        <DialogHeader>
          <DialogTitle className="text-blue-400">Support ComicForge AI</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method to support our platform
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-4 pt-4">
          <Button
            variant="outline"
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex items-center gap-2 hover:bg-blue-500/10 transition-colors"
          >
            <IndianRupee className="h-4 w-4" />
            {isProcessing ? "Processing..." : "Razorpay (₹100)"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowUPIDialog(true)}
            className="flex items-center gap-2 hover:bg-blue-500/10 transition-colors"
          >
            <IndianRupee className="h-4 w-4" />
            UPI Direct
          </Button>
        </div>
      </DialogContent>
      <UPIDialog open={showUPIDialog} onOpenChange={setShowUPIDialog} />
    </Dialog>
  );
}
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { QrCodeIcon, Copy } from "lucide-react";

interface UPIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UPIDialog({ open, onOpenChange }: UPIDialogProps) {
  const { toast } = useToast();
  const UPI_ID = "adnanmuhammad4393@okicici";

  const handleUPIClick = async () => {
    try {
      const upiUrl = `upi://pay?pa=${UPI_ID}&pn=ComicForge%20AI&tn=Donation`;
      
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.href = upiUrl;
      } else {
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

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      toast({
        title: "UPI ID Copied!",
        description: "You can now paste it in your UPI app.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy UPI ID. Please try manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>UPI Payment Details</DialogTitle>
          <DialogDescription>
            Support ComicForge AI with any amount you wish to donate
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">UPI ID:</p>
            <div className="flex items-center justify-between gap-2 bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
              <p className="text-lg font-mono font-semibold select-all">{UPI_ID}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyClick}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <p>• You can donate any amount you wish</p>
            <p>• Your support helps maintain and improve ComicForge AI</p>
            <p>• All donations are greatly appreciated</p>
          </div>
          <Button 
            onClick={handleUPIClick} 
            className="w-full flex items-center justify-center gap-2"
          >
            <QrCodeIcon className="h-4 w-4" />
            {/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) 
              ? "Open UPI App" 
              : "Copy UPI ID"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
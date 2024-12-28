import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { QrCodeIcon, Copy } from "lucide-react";

interface UPIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UPI_ID = "adnanmuhammad4393@okicici";

export function UPIDialog({ open, onOpenChange }: UPIDialogProps) {
  const { toast } = useToast();

  const handleQRClick = async () => {
    try {
      const response = await fetch("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + UPI_ID);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'upi-qr.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "QR Code Downloaded",
          description: "You can now scan it with your UPI app.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
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
      <DialogContent className="sm:max-w-md bg-black border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">UPI Payment</DialogTitle>
          <DialogDescription className="text-gray-400">
            Make a direct UPI payment to support us
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-gray-900 rounded-lg">
            <p className="text-gray-400 mb-2">UPI ID:</p>
            <div className="flex items-center justify-between gap-2 bg-black p-2 rounded border border-gray-800">
              <p className="text-lg font-mono font-semibold text-white select-all">{UPI_ID}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyClick}
                className="hover:bg-gray-800 text-white"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-400 space-y-2">
            <p>• You can donate any amount you wish</p>
            <p>• Your support helps us maintain and improve our services</p>
          </div>
          <Button
            variant="outline"
            onClick={handleQRClick}
            className="w-full border-gray-800 text-white hover:bg-gray-800 hover:text-white"
          >
            <QrCodeIcon className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

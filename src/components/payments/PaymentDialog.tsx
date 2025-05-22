import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, IndianRupee } from "lucide-react";
import { UPIDialog } from "./UPIDialog";
import { useState } from "react";
interface PaymentDialogProps {
  handleRazorpayClick: () => void;
}
export function PaymentDialog({
  handleRazorpayClick
}: PaymentDialogProps) {
  const [showUPIDialog, setShowUPIDialog] = useState(false);
  return <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full border-gray-800 bg-black/20 hover:bg-amber-500/20 hover:border-amber-500">
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
          
          <Button variant="outline" onClick={() => setShowUPIDialog(true)} className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            UPI Direct
          </Button>
        </div>
      </DialogContent>
      <UPIDialog open={showUPIDialog} onOpenChange={setShowUPIDialog} />
    </Dialog>;
}

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Copy, AlertTriangle, Download, IndianRupee, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UPIDonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UPI_ID = "adnanmuhammad4393@okicici";
const MIN_AMOUNT = 14;
const MAX_AMOUNT = 2214;
const DEFAULT_AMOUNT = 399;

export function UPIDonationDialog({ open, onOpenChange }: UPIDonationDialogProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const handleQRGenerate = async () => {
    try {
      setIsGeneratingQR(true);
      const encodedUpiString = encodeURIComponent(`upi://pay?pa=${UPI_ID}&am=${amount}&cu=INR`);
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUpiString}`);
      
      if (!response.ok) {
        throw new Error("Failed to generate QR code");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setQrUrl(url);
      
      toast({
        title: "QR Code Generated",
        description: "Scan with your UPI app to make the payment.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
      console.error("QR generation error:", error);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleQRDownload = () => {
    if (!qrUrl) return;
    
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `upi-payment-${amount}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code Downloaded",
      description: "You can scan it with your UPI app.",
    });
  };

  const handleCopyUPI = async () => {
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

  const formatAmountDisplay = (value: number) => {
    return `₹${value}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-amber-500" /> Support ComicForge AI
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose how much you'd like to donate to support our service
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upi" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="upi">UPI Payment</TabsTrigger>
            <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
          </TabsList>

          <TabsContent value="upi" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="amount" className="text-white">Donation Amount</Label>
                  <span className="text-lg font-semibold text-amber-500">{formatAmountDisplay(amount)}</span>
                </div>
                
                <Slider
                  id="amount"
                  value={[amount]}
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                  step={1}
                  onValueChange={(values) => setAmount(values[0])}
                  className="my-4"
                />
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Min: ₹{MIN_AMOUNT}</span>
                  <span>Max: ₹{MAX_AMOUNT}</span>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="custom-amount" className="text-white">Custom Amount</Label>
                  <div className="flex items-center mt-1">
                    <Input
                      id="custom-amount"
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= MIN_AMOUNT && value <= MAX_AMOUNT) {
                          setAmount(value);
                        }
                      }}
                      min={MIN_AMOUNT}
                      max={MAX_AMOUNT}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-900 rounded-lg">
                <p className="text-gray-400 mb-2">UPI ID:</p>
                <div className="flex items-center justify-between gap-2 bg-black p-2 rounded border border-gray-800">
                  <p className="font-mono font-semibold text-white select-all">{UPI_ID}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyUPI}
                    className="hover:bg-gray-800 text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {qrUrl && (
                <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg">
                  <img 
                    src={qrUrl} 
                    alt="UPI QR Code" 
                    className="w-48 h-48 mb-2 bg-white p-2 rounded"
                  />
                  <Button
                    variant="outline"
                    onClick={handleQRDownload}
                    className="mt-2 border-gray-700 text-white hover:bg-gray-800"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download QR
                  </Button>
                </div>
              )}

              <div className="flex items-start gap-2 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="text-amber-500 font-medium">Important Payment Information</p>
                  <p className="text-gray-400">Please ensure you make the payment through your UPI app. Once payment is complete, we'll process your support.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={handleQRGenerate}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                  disabled={isGeneratingQR}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  {isGeneratingQR ? "Generating..." : "Generate QR Code"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bank" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-white text-lg mb-4">Bank Transfer Details</h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Beneficiary Name</p>
                    <p className="text-white font-medium">Muhammed Adnan vv</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Account Number</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-mono select-all">19020100094298</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-gray-800"
                        onClick={() => {
                          navigator.clipboard.writeText("19020100094298");
                          toast({
                            title: "Copied!",
                            description: "Account number copied to clipboard",
                          });
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">IFSC Code</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-mono select-all">FDRL0001902</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-gray-800"
                        onClick={() => {
                          navigator.clipboard.writeText("FDRL0001902");
                          toast({
                            title: "Copied!",
                            description: "IFSC code copied to clipboard",
                          });
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="text-amber-500 font-medium">Bank Transfer Notes</p>
                  <p className="text-gray-400">Please include your name or email in the transfer reference. Once the transfer is complete, please contact us for confirmation.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

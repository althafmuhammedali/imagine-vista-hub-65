import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const PopupAd = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem('hasSeenPopup');
      if (!hasSeenPopup) {
        setIsOpen(true);
        localStorage.setItem('hasSeenPopup', 'true');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Special Offer! 🎉</DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Get Started Today!</h3>
            <p className="text-muted-foreground">
              Create amazing AI-generated art with ComicForge AI. 
              Limited time offer: Get 50% off your first purchase!
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                variant="default"
                onClick={() => {
                  // Add your conversion tracking here
                  window.location.href = '/sign-up';
                }}
              >
                Get Started
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, GraduationCap, Building2, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const PopupAd = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAd, setCurrentAd] = useState(0);
  const { toast } = useToast();

  const ads = [
    {
      title: "Grow Your Business with Vyapar! 📊",
      icon: <Building2 className="w-12 h-12 text-primary" />,
      description: "India's #1 GST Billing, Inventory & Accounting Software for Small Businesses",
      cta: "Try Vyapar Free",
      link: "https://vyapar.in"
    },
    {
      title: "Learn from Industry Experts! 🎓",
      icon: <GraduationCap className="w-12 h-12 text-primary" />,
      description: "Great Learning: Transform your career with our Professional Certification Programs",
      cta: "Explore Courses",
      link: "https://www.greatlearning.in"
    },
    {
      title: "Join Digital Growth Community! 🚀",
      icon: <Users className="w-12 h-12 text-primary" />,
      description: "Connect with digital marketers, entrepreneurs, and growth hackers",
      cta: "Join Community",
      link: "https://example.com/community"
    }
  ];

  useEffect(() => {
    // Show popup after 15 seconds
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem('hasSeenPopup');
      if (!hasSeenPopup) {
        setIsOpen(true);
        localStorage.setItem('hasSeenPopup', 'true');
      }
    }, 15000);

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !localStorage.getItem('hasSeenPopup')) {
        setIsOpen(true);
        localStorage.setItem('hasSeenPopup', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleAdClick = (link: string) => {
    window.open(link, '_blank');
    setIsOpen(false);
    toast({
      title: "Thank you for your interest!",
      description: "You'll be redirected to the partner website.",
    });
  };

  const handleNext = () => {
    setCurrentAd((prev) => (prev + 1) % ads.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-4">
            {ads[currentAd].icon}
            {ads[currentAd].title}
          </DialogTitle>
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
            <p className="text-muted-foreground text-center">
              {ads[currentAd].description}
            </p>
            <div className="flex flex-col gap-2">
              <Button 
                variant="default"
                className="w-full"
                onClick={() => handleAdClick(ads[currentAd].link)}
              >
                {ads[currentAd].cta}
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleNext}
              >
                See Other Offers
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
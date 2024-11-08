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
      icon: <Building2 className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />,
      description: "India's #1 GST Billing, Inventory & Accounting Software for Small Businesses",
      cta: "Try Vyapar Free",
      link: "https://vyapar.in"
    },
    {
      title: "Learn from Industry Experts! 🎓",
      icon: <GraduationCap className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />,
      description: "Great Learning: Transform your career with our Professional Certification Programs",
      cta: "Explore Courses",
      link: "https://www.greatlearning.in"
    },
    {
      title: "Join Digital Growth Community! 🚀",
      icon: <Users className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />,
      description: "Connect with digital marketers, entrepreneurs, and growth hackers",
      cta: "Join Community",
      link: "https://example.com/community"
    }
  ];

  useEffect(() => {
    // Show popup after 15 seconds if not seen before
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem('hasSeenPopup');
      if (!hasSeenPopup) {
        setIsOpen(true);
        localStorage.setItem('hasSeenPopup', 'true');
      }
    }, 15000);

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (
        e.clientY <= 0 && 
        !localStorage.getItem('hasSeenPopup') && 
        !isOpen
      ) {
        setIsOpen(true);
        localStorage.setItem('hasSeenPopup', 'true');
      }
    };

    // Only add exit intent on desktop
    if (window.innerWidth > 768) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isOpen]);

  const handleAdClick = (link: string) => {
    window.open(link, '_blank');
    setIsOpen(false);
    toast({
      title: "Thank you for your interest!",
      description: "You'll be redirected to the partner website.",
      duration: 3000,
    });
  };

  const handleNext = () => {
    setCurrentAd((prev) => (prev + 1) % ads.length);
    toast({
      title: "New Offer",
      description: "Check out this special offer!",
      duration: 2000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[95vw] sm:w-full p-4 sm:p-6 bg-background/95 backdrop-blur-sm border border-primary/20 shadow-xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center justify-center gap-4 flex-wrap">
            {ads[currentAd].icon}
            <span className="text-center">{ads[currentAd].title}</span>
          </DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-2 top-2 sm:right-4 sm:top-4 h-8 w-8 p-0 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="p-2 sm:p-4">
          <div className="space-y-4">
            <p className="text-sm sm:text-base text-muted-foreground text-center">
              {ads[currentAd].description}
            </p>
            <div className="flex flex-col gap-2">
              <Button 
                variant="default"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
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
import { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from "@/components/ui/use-toast";

const AD_REFRESH_INTERVAL = 5 * 60 * 1000;
const AD_POPUP_INTERVAL = 3 * 60 * 1000;

interface ImgBBResponse {
  data: {
    url: string;
    title: string;
    display_url: string;
  };
  success: boolean;
}

const IMGBB_API_KEY = '73ffc7abc53c74281c83c278d6a9a82b';

// Sample images for demonstration and fallback
const SAMPLE_IMAGES = [
  {
    display_url: 'https://i.ibb.co/wJD5gqx/sample-ad-1.jpg',
    title: 'Sample Advertisement 1'
  },
  {
    display_url: 'https://i.ibb.co/X2vB3rf/sample-ad-2.jpg',
    title: 'Sample Advertisement 2'
  }
];

const uploadImage = async (imageFile: File): Promise<ImgBBResponse> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('key', IMGBB_API_KEY);

  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  return response.json();
};

const fetchAds = async (): Promise<{ data: Array<{ display_url: string; title: string }> }> => {
  try {
    // For now, we'll use sample images since we can't fetch account images directly
    // In a real implementation, you might want to store uploaded image URLs in your backend
    return { data: SAMPLE_IMAGES };
  } catch (error) {
    console.error('Error fetching ads:', error);
    toast({
      title: "Error",
      description: "Failed to fetch advertisements. Using sample images instead.",
      variant: "destructive",
    });
    return { data: SAMPLE_IMAGES };
  }
};

export function DynamicAdDisplay() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const { data: ads, isLoading, error } = useQuery({
    queryKey: ['ads'],
    queryFn: fetchAds,
    refetchInterval: AD_REFRESH_INTERVAL,
    staleTime: AD_REFRESH_INTERVAL,
  });

  useEffect(() => {
    const rotateAd = setInterval(() => {
      if (ads?.data?.length) {
        setCurrentAdIndex((prev) => (prev + 1) % ads.data.length);
      }
    }, AD_REFRESH_INTERVAL);

    return () => clearInterval(rotateAd);
  }, [ads?.data?.length]);

  useEffect(() => {
    const showAdPopup = setInterval(() => {
      setShowPopup(true);
    }, AD_POPUP_INTERVAL);

    return () => clearInterval(showAdPopup);
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return null;
  if (!ads?.data?.length) return null;

  const currentAd = ads.data[currentAdIndex];

  return (
    <>
      <div className="w-full py-2 sm:py-4 bg-black/10 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="cursor-pointer transition-all hover:scale-105">
                <img
                  src={currentAd.display_url}
                  alt="Advertisement"
                  className="w-full max-w-md h-16 sm:h-24 object-cover rounded-lg shadow-lg mx-auto"
                  loading="lazy"
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 sm:w-80 bg-black/90 border-gray-800">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-amber-400">{currentAd.title}</h4>
                <img
                  src={currentAd.display_url}
                  alt="Advertisement"
                  className="w-full h-auto rounded-lg"
                  loading="lazy"
                />
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>

      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-amber-400">{currentAd.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <img
              src={currentAd.display_url}
              alt="Advertisement"
              className="w-full h-auto rounded-lg shadow-xl"
              loading="lazy"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
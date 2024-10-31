import { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from './LoadingSpinner';

const AD_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

interface ImgBBResponse {
  data: {
    url: string;
    title: string;
  }[];
}

const fetchAds = async (): Promise<ImgBBResponse> => {
  const response = await fetch(`https://api.imgbb.com/1/upload?key=73ffc7abc53c74281c83c278d6a9a82b&name=auto`);
  if (!response.ok) throw new Error('Failed to fetch ads');
  return response.json();
};

export function DynamicAdDisplay() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const { data: ads, isLoading, error } = useQuery({
    queryKey: ['ads'],
    queryFn: fetchAds,
    refetchInterval: AD_REFRESH_INTERVAL,
    staleTime: AD_REFRESH_INTERVAL,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (ads?.data?.length) {
        setCurrentAdIndex((prev) => (prev + 1) % ads.data.length);
      }
    }, AD_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [ads?.data?.length]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return null;
  if (!ads?.data?.length) return null;

  return (
    <div className="w-full py-4 bg-black/10 backdrop-blur-sm">
      <div className="container max-w-6xl mx-auto">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="cursor-pointer transition-all hover:scale-105">
              <img
                src={ads.data[currentAdIndex].url}
                alt="Advertisement"
                className="w-full max-w-md h-24 object-cover mx-auto rounded-lg shadow-lg"
              />
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{ads.data[currentAdIndex].title}</h4>
              <img
                src={ads.data[currentAdIndex].url}
                alt="Advertisement"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}
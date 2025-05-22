
import { useEffect } from 'react';

interface EmbedConfig {
  hash: string;
  width: number;
  height: number;
  t: string;
  userId: number;
  network: string;
  type: string;
  gdpr: string;
  gdpr_consent: string;
  responsive: boolean;
}

declare global {
  interface Window {
    embedConfig?: EmbedConfig;
  }
}

export function CreatopyAd() {
  useEffect(() => {
    // Define the embed configuration
    window.embedConfig = {
      hash: "oe2o6ky",
      width: 1080,
      height: 1080,
      t: `${Date.now()}`, // Cache buster
      userId: 1873642,
      network: "STANDARD",
      type: "html5",
      gdpr: "${GDPR}",
      gdpr_consent: "${GDPR_CONSENT_1311}",
      responsive: true
    };

    // Load the Creatopy script
    const script = document.createElement('script');
    script.src = 'https://live-tag.creatopy.net/embed/embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup function to remove the script when component unmounts
    return () => {
      document.body.removeChild(script);
      delete window.embedConfig;
    };
  }, []);

  return (
    <div 
      className="w-full max-w-[1080px] mx-auto my-8 aspect-square"
      id="creatopy-ad-container"
    />
  );
}

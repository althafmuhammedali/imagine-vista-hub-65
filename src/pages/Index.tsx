import React from 'react';
import { PWAInstallPrompt } from '../components/PWAInstallPrompt';
import { ImageGenerator } from '@/components/ImageGenerator';
import { Card } from '@/components/ui/card';
import { PlatformBudget } from '@/components/PlatformBudget';
import { SocialLinks } from '@/components/SocialLinks';
import { PopupAd } from '@/components/PopupAd';
import { HeroSection } from '@/components/hero/HeroSection';

const IndexPage: React.FC = () => {
  return (
    <div className="min-h-screen fluid-container">
      <PopupAd />
      
      <HeroSection />

      <main className="space-y-12 mt-8">
        <Card className="glass-panel p-4 sm:p-6">
          <ImageGenerator />
        </Card>

        <PlatformBudget />
      </main>

      <SocialLinks />
      <PWAInstallPrompt />
    </div>
  );
};

export default IndexPage;
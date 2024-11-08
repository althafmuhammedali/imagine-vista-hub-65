import React from 'react';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { ParticlesBackground } from './ParticlesBackground';

export const HeroSection = () => {
  const scrollToGenerator = () => {
    const generatorElement = document.querySelector('#art-generator');
    generatorElement?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <ParticlesBackground />
      
      <div className="relative z-10 text-center space-y-8 px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 leading-tight">
          Unleash the Power of Imagination with AI-Driven Art
        </h1>
        
        <Button 
          onClick={scrollToGenerator}
          size="lg"
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg px-8 py-6 rounded-full transform transition-all hover:scale-105 hover:shadow-xl"
        >
          <Wand2 className="w-5 h-5 mr-2" />
          Start Creating
        </Button>
      </div>
    </section>
  );
};
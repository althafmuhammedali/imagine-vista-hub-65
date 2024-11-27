import { ReactNode } from 'react';

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  imagesPerDay: number;
  icon: ReactNode;
  color: string;
}
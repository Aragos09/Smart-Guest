import type { Language } from "./translations";

export type UserProfile = {
  name: string;
  email: string;
  language: Language;
  tripType: 'business' | 'leisure';
  ecoSensitivity: 'low' | 'medium' | 'high';
};

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  ecoLabel: 'certified-organic' | 'energy-star' | 'water-wise';
  isDurable: boolean;
  image: string;
  imageHint: string;
};

export type Experience = {
  id: string;
  name: string;
  description: string;
  image: string;
  imageHint: string;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type MenuItem = {
  name: string;
  type: string;
  price: number;
  eco_label: string;
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
};

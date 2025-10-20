import type { Language } from "./translations";
import type { CartItem as CartContextCartItem } from "@/context/cart-context";

export type CartItem = CartContextCartItem;

export type UserProfile = {
  name: string;
  email: string;
  language: Language;
  tripType: 'business' | 'leisure';
  ecoSensitivity: 'low' | 'medium' | 'high';
  bedType?: string;
  floorPreference?: string;
  viewPreference?: string;
  pillowType?: string;
  roomFragrance?: string;
  housekeepingSchedule?: string;
  dietaryRestrictions?: string;
  allergies?: string[];
  favoriteDishes?: string[];
  quickLinks?: string[];
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

export type SignatureMenuItem = {
  name: string;
  description?: string;
  allergens?: string[];
  wine_pairing?: string;
  type?: string;
  region?: string;
  price?: number;
};

export type SignatureMenuSection = {
  category: string;
  items: SignatureMenuItem[];
};

export type SignatureMenuData = {
  id: string;
  name:string;
  type: string;
  description: string;
  sustainability: {
    local_products: string;
    fish_label: string;
    menu_rotation: string;
    packaging: string;
  };
  sections: SignatureMenuSection[];
  tags: string[];
};

export type RoomServiceItem = {
  name_fr: string;
  description_fr?: string;
  price_eur: number;
  size?: string;
};

export type RoomServiceMenuCategory = {
  name_fr: string;
  items: RoomServiceItem[];
}

export type RoomServiceMenu = {
  categories: {
    [key: string]: RoomServiceMenuCategory;
  };
  eco_options?: {
    [key: string]: string;
  };
  service_info?: {
    [key: string]: string;
  };
};

export type RoomServiceCategory = {
  id: string;
  name: string;
  items: RoomServiceItem[];
};

export type WellnessService = {
  name: string;
  description: string;
  price_eur: number;
  type?: "bonus";
};

export type WellnessServiceCategory = {
  name: string;
  icon: React.ElementType;
  items: WellnessService[];
};

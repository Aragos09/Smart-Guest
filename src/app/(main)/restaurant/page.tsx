
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import menuData from "@/lib/restaurant-menu.json";
import signatureMenuJson from "@/lib/signature-menu.json";
import type { MenuCategory, MenuItem, SignatureMenuData, SignatureMenuItem } from "@/lib/types";
import { useLanguage } from "@/context/language-context";
import { useUserProfile } from "@/context/user-profile-context";
import { Utensils, Leaf, Fish, RotateCw, Box, Star } from "lucide-react";
import { memo } from "react";

const { categories }: { categories: MenuCategory[] } = menuData;
const { menu: signatureMenu }: { menu: SignatureMenuData } = signatureMenuJson;

function MenuItemCard({ item }: { item: MenuItem }) {
  const { t } = useLanguage();
  const { profile, setProfile } = useUserProfile();

  const isFavorite = profile.favoriteDishes?.includes(item.name);

  const toggleFavorite = () => {
    const favorites = profile.favoriteDishes || [];
    let newFavorites;
    if (isFavorite) {
      newFavorites = favorites.filter((dish) => dish !== item.name);
    } else {
      newFavorites = [...favorites, item.name];
    }
    setProfile({ ...profile, favoriteDishes: newFavorites });
  };

  return (
    <div className="flex justify-between gap-4 py-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{t(item.name as any)}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{t(item.type as any)}</span>
          <span className="text-xs">•</span>
          <Badge variant="outline">{t(item.eco_label as any)}</Badge>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-lg font-bold text-primary">
          {item.price > 0 ? `${item.price}€` : t('free_menu_item')}
        </div>
        <Button variant="ghost" size="icon" onClick={toggleFavorite} aria-label={t(isFavorite ? "remove_from_favorites_tooltip" : "add_to_favorites_tooltip")}>
            <Star className={`h-5 w-5 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
        </Button>
      </div>
    </div>
  );
}

function SignatureMenuItemCard({ item }: { item: SignatureMenuItem }) {
  const { t } = useLanguage();
  const { profile, setProfile } = useUserProfile();

  const isFavorite = profile.favoriteDishes?.includes(item.name);

  const toggleFavorite = () => {
    const favorites = profile.favoriteDishes || [];
    let newFavorites;
    if (isFavorite) {
      newFavorites = favorites.filter((dish) => dish !== item.name);
    } else {
      newFavorites = [...favorites, item.name];
    }
    setProfile({ ...profile, favoriteDishes: newFavorites });
  };

  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="flex justify-between gap-4">
        <h3 className="font-semibold">{t(item.name as any)}</h3>
        <div className="flex items-center gap-4">
          {item.price && (
            <div className="text-lg font-bold text-primary">{item.price.toFixed(2)}€</div>
          )}
          <Button variant="ghost" size="icon" onClick={toggleFavorite} aria-label={t(isFavorite ? "remove_from_favorites_tooltip" : "add_to_favorites_tooltip")}>
            <Star className={`h-5 w-5 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
          </Button>
        </div>
      </div>
      {item.description && (
        <p className="text-sm text-muted-foreground">{t(item.description as any)}</p>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {item.allergens && item.allergens.length > 0 && (
          <p>
            <span className="font-medium text-foreground">{t('allergens_label')}:</span>{" "}
            {item.allergens.map(allergen => t(allergen as any)).join(", ")}
          </p>
        )}
        {item.wine_pairing && (
          <p>
            <span className="font-medium text-foreground">{t('wine_pairing_label')}:</span>{" "}
            {t(item.wine_pairing as any)}
          </p>
        )}
      </div>
    </div>
  );
}

function SustainableMenu() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <Card key={category.name}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              {t(category.name as any)}
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {category.items.map((item) => (
              <MenuItemCard key={item.name} item={item} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SignatureMenu() {
  const { t } = useLanguage();
  const sustainabilityItems = [
    { icon: Leaf, text: "local_products_sustainability_desc", label: "local_products_sustainability" },
    { icon: Fish, text: "msc_sustainability_desc", label: "sustainable_fishing_sustainability" },
    { icon: RotateCw, text: "seasonal_rotation_sustainability_desc", label: "menu_rotation_sustainability" },
    { icon: Box, text: "zero_plastic_sustainability_desc", label: "packaging_sustainability" },
  ]
  return (
    <div className="space-y-8">
       <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{t(signatureMenu.name as any)}</CardTitle>
            <CardDescription>{t(signatureMenu.description as any)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {sustainabilityItems.map(item => (
                   <div key={item.label} className="flex items-start space-x-3">
                      <item.icon className="h-5 w-5 mt-0.5 text-primary"/>
                      <div>
                         <p className="text-sm font-semibold">{t(item.label as any)}</p>
                         <p className="text-sm text-muted-foreground">{t(item.text as any)}</p>
                      </div>
                   </div>
                ))}
             </div>
          </CardContent>
       </Card>

      {signatureMenu.sections.map((section) => (
        <Card key={section.category}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              {t(section.category as any)}
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {section.items.map((item) => (
              <SignatureMenuItemCard key={item.name} item={item} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const RestaurantPage = memo(function RestaurantPage() {
  const { t } = useLanguage();
  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-8 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t('restaurant_title')}
        </h1>
        <p className="text-muted-foreground">
          {t('restaurant_subtitle')}
        </p>
      </div>

      <Tabs defaultValue="sustainable">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sustainable">{t('vegetarian_menu_tab')}</TabsTrigger>
          <TabsTrigger value="signature">{t('signature_menu_tab')}</TabsTrigger>
        </TabsList>
        <TabsContent value="sustainable">
          <SustainableMenu />
        </TabsContent>
        <TabsContent value="signature">
          <SignatureMenu />
        </TabsContent>
      </Tabs>
    </div>
  );
});

export default RestaurantPage;

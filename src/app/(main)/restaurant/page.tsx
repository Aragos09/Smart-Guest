
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import menuData from "@/lib/restaurant-menu.json";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { useLanguage } from "@/context/language-context";

const { categories }: { categories: MenuCategory[] } = menuData;

function MenuItemCard({ item }: { item: MenuItem }) {
  const { t } = useLanguage();
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
      <div className="text-lg font-bold text-primary">
        {item.price > 0 ? `${item.price}€` : t('Offert')}
      </div>
    </div>
  );
}

export default function RestaurantPage() {
  const { t } = useLanguage();
  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-8 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t('Our Menu')}
        </h1>
        <p className="text-muted-foreground">
          {t('Discover our selection of delicious and sustainable dishes.')}
        </p>
      </div>

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
    </div>
  );
}

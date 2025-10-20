
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Service } from "@/lib/types";
import { Leaf, Zap, Droplets } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const initialServices: Service[] = [
  {
    id: "e-bike",
    name: "Electric Bike Rental",
    description: "Explore the city with zero emissions. Our e-bikes are perfect for a day of adventure.",
    price: 25,
    ecoLabel: "energy-star",
    isDurable: true,
    image: PlaceHolderImages.find((p) => p.id === "electric-bike-rental")?.imageUrl || "",
    imageHint: PlaceHolderImages.find((p) => p.id === "electric-bike-rental")?.imageHint || "",
  },
  {
    id: "farm-to-table",
    name: "Farm-to-Table Dinner",
    description: "Enjoy a delicious 3-course meal made from locally sourced, organic ingredients.",
    price: 75,
    ecoLabel: "certified-organic",
    isDurable: false,
    image: PlaceHolderImages.find((p) => p.id === "farm-to-table-restaurant")?.imageUrl || "",
    imageHint: PlaceHolderImages.find((p) => p.id === "farm-to-table-restaurant")?.imageHint || "",
  },
  {
    id: "eco-laundry",
    name: "Eco-Friendly Laundry",
    description: "Water-efficient and biodegradable detergents to keep your clothes fresh and the planet happy.",
    price: 30,
    ecoLabel: "water-wise",
    isDurable: true,
    image: PlaceHolderImages.find((p) => p.id === "eco-laundry-service")?.imageUrl || "",
    imageHint: PlaceHolderImages.find((p) => p.id === "eco-laundry-service")?.imageHint || "",
  },
  {
    id: "sus-housekeeping",
    name: "Sustainable Housekeeping",
    description: "Daily room cleaning using only non-toxic, eco-friendly products. Linen reuse is encouraged.",
    price: 0,
    ecoLabel: "certified-organic",
    isDurable: true,
    image: PlaceHolderImages.find((p) => p.id === "sustainable-housekeeping")?.imageUrl || "",
    imageHint: PlaceHolderImages.find((p) => p.id === "sustainable-housekeeping")?.imageHint || "",
  },
];

const ecoLabelInfo = {
  "certified-organic": { icon: Leaf, text: "Organic", variant: "default" },
  "energy-star": { icon: Zap, text: "Energy-Wise", variant: "secondary" },
  "water-wise": { icon: Droplets, text: "Water-Saver", variant: "outline" },
};

function ServiceCard({ service }: { service: Service }) {
  const { t } = useLanguage();
  const labelInfo = ecoLabelInfo[service.ecoLabel];
  const LabelIcon = labelInfo.icon;

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={service.image}
          alt={t(service.name as any)}
          fill
          className="object-cover"
          data-ai-hint={service.imageHint}
        />
      </div>
      <CardHeader>
        <CardTitle>{t(service.name as any)}</CardTitle>
        <CardDescription>{t(service.description as any)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Badge variant={labelInfo.variant as any}>
          <LabelIcon className="mr-2 h-4 w-4" />
          {t(labelInfo.text as any)}
        </Badge>
        {service.isDurable && (
          <Badge variant="outline" className="ml-2">
            {t('Durable')}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p className="text-xl font-bold">
          {service.price > 0 ? `${service.price}€` : t('Free')}
          {service.price > 0 && <span className="text-sm font-normal text-muted-foreground">/{t('unit')}</span>}
        </p>
        <Button>{t('Reserve')}</Button>
      </CardFooter>
    </Card>
  );
}

export default function ServicesPage() {
  const { t } = useLanguage();
  const [showDurableOnly, setShowDurableOnly] = useState(false);
  const filteredServices = showDurableOnly
    ? initialServices.filter((s) => s.isDurable)
    : initialServices;

  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            {t('Sustainable Services')}
          </h1>
          <p className="text-muted-foreground">
            {t('Book eco-friendly services to enhance your stay.')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="durable-only"
            checked={showDurableOnly}
            onCheckedChange={setShowDurableOnly}
          />
          <Label htmlFor="durable-only">{t('Durable only')}</Label>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}

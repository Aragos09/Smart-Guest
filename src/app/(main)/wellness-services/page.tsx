
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sparkles,
  Wind,
  Bike,
  Leaf,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import wellnessData from "@/lib/wellness-services.json";
import type { WellnessService, WellnessServiceCategory } from "@/lib/types";
import { memo } from "react";

const { wellness_services: wellnessServices, eco_commitments: ecoCommitments } = wellnessData;

const ServiceCard = memo(function ServiceCard({ item }: { item: WellnessService }) {
  const { t } = useLanguage();
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{t(item.name_fr as any)}</CardTitle>
        <CardDescription>{t(item.description_fr as any)}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto flex items-center justify-between">
        <p className="text-xl font-bold">
          {item.price_eur > 0 ? `${item.price_eur.toFixed(2)}€` : t('free_price')}
        </p>
        <Button>{t('book_now_button')}</Button>
      </CardFooter>
    </Card>
  );
});

const WellnessServicesPage = memo(function WellnessServicesPage() {
  const { t } = useLanguage();

  const categories: WellnessServiceCategory[] = [
    { name: t("spa_category"), icon: Wind, items: wellnessServices.spa },
    { name: t("fitness_category"), icon: Bike, items: wellnessServices.fitness },
    { name:t("eco_services_category"), icon: Leaf, items: wellnessServices.eco_services },
  ];

  const commitments = Object.values(ecoCommitments);

  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            {t('wellness_services_title')}
          </h1>
          <p className="text-muted-foreground">
            {t('wellness_services_subtitle')}
          </p>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["spa", "fitness", "eco-services"]} className="w-full space-y-4">
        {categories.map((category) => (
          <AccordionItem value={category.name.toLowerCase().replace(/ & /g, '-')} key={category.name}>
            <AccordionTrigger className="text-2xl font-headline font-bold rounded-lg bg-card p-4 border data-[state=open]:border-b-0 data-[state=open]:rounded-b-none">
              <div className="flex items-center gap-3">
                <category.icon className="h-6 w-6 text-primary" />
                {category.name}
              </div>
            </AccordionTrigger>
            <AccordionContent className="border border-t-0 rounded-b-lg bg-card p-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item) => (
                  <ServiceCard key={item.name_fr} item={item} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>{t('eco_commitments_title')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {commitments.map((commitment, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{t(commitment as any)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
});

export default WellnessServicesPage;


"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BotMessageSquare,
  HeartHandshake,
  Leaf,
  LucideIcon,
  Utensils,
  ShoppingBasket,
  Home,
  Sparkles,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { EcoScoreChart } from "./eco-score-chart";
import { useLanguage } from "@/context/language-context";
import { useUserProfile } from "@/context/user-profile-context";
import { useEffect, useState, memo } from "react";
import { generateDynamicWelcomeMessage } from "@/ai/flows/dynamic-welcome-message";
import { WeatherCard } from "./weather-card";

type QuickLink = {
  id: string;
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const allQuickLinks: QuickLink[] = [
  {
    id: "smart-room",
    href: "/smart-room",
    icon: Home,
    title: "smart_room_title",
    description: "smart_room_subtitle",
  },
  {
    id: "eco-manager",
    href: "/eco-manager",
    icon: Leaf,
    title: "eco_manager_title",
    description: "eco_manager_subtitle",
  },
  {
    id: "wellness-services",
    href: "/wellness-services",
    icon: Sparkles,
    title: "wellness_services_title",
    description: "wellness_services_subtitle",
  },
  {
    id: "experiences",
    href: "/experiences",
    icon: HeartHandshake,
    title: "experiences_title",
    description: "experiences_subtitle",
  },
  {
    id: "restaurant",
    href: "/restaurant",
    icon: Utensils,
    title: "restaurant_title",
    description: "restaurant_subtitle",
  },
  {
    id: "room-service",
    href: "/room-service",
    icon: ShoppingBasket,
    title: "room_service_title",
    description: "room_service_subtitle",
  },
  {
    id: "invoice",
    href: "/invoice",
    icon: Receipt,
    title: "invoice_title",
    description: "invoice_subtitle",
  },
  {
    id: "concierge",
    href: "/concierge",
    icon: BotMessageSquare,
    title: "concierge_title",
    description: "concierge_subtitle",
  },
];

const DashboardPage = memo(function DashboardPage() {
  const { t } = useLanguage();
  const { profile } = useUserProfile();
  const [welcomeMessage, setWelcomeMessage] = useState("Loading your personalized welcome...");

  useEffect(() => {
    async function getWelcomeMessage() {
      try {
        const result = await generateDynamicWelcomeMessage({
          userName: profile.name,
          travelHistory: "Last stay was in an eco-suite.",
          userPreferences: `Trip type: ${profile.tripType}, Digital check-in preferred, Quiet room requested.`,
          ecoSensitivity: profile.ecoSensitivity,
          newOptions: "Expanded plant-based meal options, new rooftop garden, electric scooter rentals available.",
          language: profile.language,
        });
        setWelcomeMessage(result.welcomeMessage);
      } catch (error) {
        console.error("Error generating welcome message:", error);
        // Fallback message
        setWelcomeMessage(t('welcome_back_generic'));
      }
    }

    if (profile.name) {
      getWelcomeMessage();
    }
  }, [profile.name, profile.tripType, profile.ecoSensitivity, profile.language, t]);


  const quickLinks = allQuickLinks
    .filter(link => profile.quickLinks?.includes(link.id));

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            {t('welcome_back_user')}, {profile.name}!
          </CardTitle>
          <CardDescription>
            {welcomeMessage}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('ecoscore_title')}</CardTitle>
            <CardDescription>
              {t('ecoscore_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <EcoScoreChart />
          </CardContent>
        </Card>
        <WeatherCard />
        {quickLinks.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('quick_links_title')}</CardTitle>
              <CardDescription>
                {t('quick_links_description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {quickLinks.map((link) => (
                <Link href={link.href} key={link.href} passHref>
                  <div className="group flex h-full flex-col rounded-lg border p-4 transition-colors hover:bg-accent/10">
                    <div className="flex items-center justify-between">
                      <link.icon className="h-8 w-8 text-primary" />
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                    <div className="mt-4">
                      <p className="font-semibold">{t(link.title as any)}</p>
                      <p className="text-sm text-muted-foreground">
                        {t(link.description as any)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
});

export default DashboardPage;

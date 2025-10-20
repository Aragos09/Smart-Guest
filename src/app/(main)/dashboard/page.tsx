
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
  Building2,
  HeartHandshake,
  Leaf,
  LucideIcon,
  Utensils,
  Wind
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
    id: "eco-manager",
    href: "/eco-manager",
    icon: Leaf,
    title: "eco_manager",
    description: "track_your_impact",
  },
  {
    id: "services",
    href: "/services",
    icon: Building2,
    title: "sustainable_services",
    description: "book_eco_friendly_services",
  },
  {
    id: "experiences",
    href: "/experiences",
    icon: HeartHandshake,
    title: "local_experiences",
    description: "discover_green_activities",
  },
  {
    id: "concierge",
    href: "/concierge",
    icon: BotMessageSquare,
    title: "ai_concierge",
    description: "ask_me_anything",
  },
  {
    id: "restaurant",
    href: "/restaurant",
    icon: Utensils,
    title: "restaurant",
    description: "discover_our_delicious_menus",
  },
  {
    id: "wellness",
    href: "/wellness",
    icon: Wind,
    title: "wellness",
    description: "relax_and_rejuvenate",
  }
];


function DashboardPage() {
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
  }, [profile, t]);


  const quickLinks = allQuickLinks
    .filter(link => profile.quickLinks?.includes(link.id))
    .map(link => ({
      ...link,
      title: t(link.title as any),
      description: t(link.description as any)
    }));

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            {t('welcome_back')}, {profile.name}!
          </CardTitle>
          <CardDescription>
            {welcomeMessage}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('your_ecoscore')}</CardTitle>
            <CardDescription>
              {t('your_ecoscore_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <EcoScoreChart />
          </CardContent>
        </Card>
        <WeatherCard />
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('quick_links')}</CardTitle>
            <CardDescription>
              {t('quick_links_desc')}
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
                    <p className="font-semibold">{link.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default memo(DashboardPage);

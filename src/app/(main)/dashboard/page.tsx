
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
import { generateDynamicWelcomeMessage } from "@/ai/flows/dynamic-welcome-message";
import { EcoScoreChart } from "./eco-score-chart";
import { useLanguage } from "@/context/language-context";
import { useEffect, useState } from "react";
import { useUserProfile } from "@/context/user-profile-context";

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
    title: "Eco Manager",
    description: "Track your impact.",
  },
  {
    id: "services",
    href: "/services",
    icon: Building2,
    title: "Sustainable Services",
    description: "Book eco-friendly services.",
  },
  {
    id: "experiences",
    href: "/experiences",
    icon: HeartHandshake,
    title: "Local Experiences",
    description: "Discover green activities.",
  },
  {
    id: "concierge",
    href: "/concierge",
    icon: BotMessageSquare,
    title: "AI Concierge",
    description: "Ask me anything.",
  },
  {
    id: "restaurant",
    href: "/restaurant",
    icon: Utensils,
    title: "Restaurant",
    description: "Discover our delicious menus.",
  },
  {
    id: "wellness",
    href: "/wellness",
    icon: Wind,
    title: "Wellness",
    description: "Relax and rejuvenate.",
  }
];


export default function DashboardPage() {
  const { t } = useLanguage();
  const { profile } = useUserProfile();
  const [welcomeMessage, setWelcomeMessage] = useState("");

  const quickLinks = allQuickLinks
    .filter(link => profile.quickLinks?.includes(link.id))
    .map(link => ({
      ...link,
      title: t(link.title as any),
      description: t(link.description as any)
    }));

  useEffect(() => {
    async function getWelcomeMessage() {
        const welcomeMessageData = await generateDynamicWelcomeMessage({
            userName: profile.name,
            travelHistory: "Frequent business traveler, last stayed in our eco-suite.",
            userPreferences: `Prefers quiet rooms, plant-based meals, and digital check-ins. Trip type: ${profile.tripType}`,
            ecoSensitivity: profile.ecoSensitivity,
            newOptions: "We've introduced a new rooftop garden and electric scooter rentals.",
        });
        setWelcomeMessage(welcomeMessageData.welcomeMessage);
    }
    if (profile.name) {
      getWelcomeMessage();
    }
  }, [profile]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            {t('Welcome back')}, {profile.name}!
          </CardTitle>
          <CardDescription>
            {welcomeMessage}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('Your EcoScore')}</CardTitle>
            <CardDescription>
              {t('A summary of your environmental impact during your stay.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <EcoScoreChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('Quick Links')}</CardTitle>
            <CardDescription>
              {t('Navigate to key features of your Smart Guest experience.')}
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

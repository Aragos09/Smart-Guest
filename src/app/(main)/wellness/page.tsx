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
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Youtube,
  Wind,
  Bed,
  GlassWater,
  Smile,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

const activities = [
  {
    icon: Sparkles,
    title: "Relaxing Massage",
    description: "Book a 60-minute session to unwind and de-stress.",
  },
  {
    icon: Wind,
    title: "Guided Meditation",
    description: "Join our morning session to find your inner peace.",
  },
  {
    icon: Youtube,
    title: "Yoga Class",
    description: "A vinyasa flow class suitable for all levels.",
  },
];

const playlists = [
  {
    title: "Peaceful Morning",
    description: "Start your day with calm and focus.",
  },
  {
    title: "Ambient Focus",
    description: "Enhance your concentration and productivity.",
  },
  {
    title: "Deep Sleep",
    description: "Drift off to sleep with soothing soundscapes.",
  },
];

const wellnessTrackers = [
  { icon: Bed, title: "Sleep", value: 75, unit: "8h goal" },
  { icon: GlassWater, title: "Hydration", value: 60, unit: "2L goal" },
  { icon: Smile, title: "Mindfulness", value: 90, unit: "10m goal" },
];

export default function WellnessPage() {
  const { t } = useLanguage();
  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            {t('Wellness & Mindfulness')}
          </h1>
          <p className="text-muted-foreground">
            {t('Your personal space for relaxation and well-being.')}
          </p>
        </div>
      </div>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('Personalized Activities')}</CardTitle>
            <CardDescription>
              {t('Based on your profile, here are some recommended activities.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            {activities.map((activity, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="flex-row items-center gap-4">
                  <activity.icon className="h-10 w-10 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Button className="w-full">{t('Book Now')}</Button>
                </CardFooter>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('Daily Wellness Tracking')}</CardTitle>
            <CardDescription>
              {t('Monitor your daily goals for a healthier you.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            {wellnessTrackers.map((tracker, index) => (
              <div key={index} className="flex flex-col gap-2">
                 <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <tracker.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">{tracker.title}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{tracker.unit}</span>
                 </div>
                <Progress value={tracker.value} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('Relaxing Playlists')}</CardTitle>
            <CardDescription>
              {t('Curated sounds to help you relax and focus.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {playlists.map((playlist, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-semibold">{playlist.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {playlist.description}
                  </p>
                </div>
                <Button variant="outline">{t('Play')}</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

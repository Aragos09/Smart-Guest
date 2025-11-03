
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
import { memo } from "react";

const activities = [
  {
    icon: Sparkles,
    title: "relaxing_massage_title",
    description: "relaxing_massage_desc",
  },
  {
    icon: Wind,
    title: "guided_meditation_title",
    description: "guided_meditation_desc",
  },
  {
    icon: Youtube,
    title: "yoga_class_title",
    description: "yoga_class_desc",
  },
];

const playlists = [
  {
    title: "peaceful_morning_playlist",
    description: "peaceful_morning_playlist_desc",
  },
  {
    title: "ambient_focus_playlist",
    description: "ambient_focus_playlist_desc",
  },
  {
    title: "deep_sleep_playlist",
    description: "deep_sleep_playlist_desc",
  },
];

const wellnessTrackers = [
  { icon: Bed, title: "sleep_tracker", value: 75, unit: "sleep_tracker_goal" },
  { icon: GlassWater, title: "hydration_tracker", value: 60, unit: "hydration_tracker_goal" },
  { icon: Smile, title: "mindfulness_tracker", value: 90, unit: "mindfulness_tracker_goal" },
];

const WellnessPage = memo(function WellnessPage() {
  const { t } = useLanguage();
  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            {t('wellness_title')}
          </h1>
          <p className="text-muted-foreground">
            {t('wellness_subtitle')}
          </p>
        </div>
      </div>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('personalized_activities_title')}</CardTitle>
            <CardDescription>
              {t('personalized_activities_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="flex-row items-start gap-4">
                  <activity.icon className="h-10 w-10 text-primary flex-shrink-0" />
                  <div>
                    <CardTitle className="text-lg">{t(activity.title as any)}</CardTitle>
                    <CardDescription>{t(activity.description as any)}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Button className="w-full">{t('book_now_button')}</Button>
                </CardFooter>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('wellness_tracking_title')}</CardTitle>
            <CardDescription>
              {t('wellness_tracking_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            {wellnessTrackers.map((tracker, index) => (
              <div key={index} className="flex flex-col gap-2">
                 <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <tracker.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">{t(tracker.title as any)}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{t(tracker.unit as any)}</span>
                 </div>
                <Progress value={tracker.value} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('relaxing_playlists_title')}</CardTitle>
            <CardDescription>
              {t('relaxing_playlists_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {playlists.map((playlist, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4 gap-4"
              >
                <div>
                  <p className="font-semibold">{t(playlist.title as any)}</p>
                  <p className="text-sm text-muted-foreground">
                    {t(playlist.description as any)}
                  </p>
                </div>
                <Button variant="outline" className="w-full sm:w-auto">{t('play_button')}</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default WellnessPage;

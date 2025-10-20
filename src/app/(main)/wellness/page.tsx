
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
    titleKey: "relaxing_massage",
    descriptionKey: "relaxing_massage_desc",
  },
  {
    icon: Wind,
    titleKey: "guided_meditation",
    descriptionKey: "guided_meditation_desc",
  },
  {
    icon: Youtube,
    titleKey: "yoga_class",
    descriptionKey: "yoga_class_desc",
  },
];

const playlists = [
  {
    titleKey: "peaceful_morning",
    descriptionKey: "peaceful_morning_desc",
  },
  {
    titleKey: "ambient_focus",
    descriptionKey: "ambient_focus_desc",
  },
  {
    titleKey: "deep_sleep",
    descriptionKey: "deep_sleep_desc",
  },
];

const wellnessTrackers = [
  { icon: Bed, titleKey: "sleep_tracker", value: 75, unitKey: "8h_goal" },
  { icon: GlassWater, titleKey: "hydration_tracker", value: 60, unitKey: "2l_goal" },
  { icon: Smile, titleKey: "mindfulness_tracker", value: 90, unitKey: "10m_goal" },
];

function WellnessPage() {
  const { t } = useLanguage();
  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            {t('wellness_mindfulness_title')}
          </h1>
          <p className="text-muted-foreground">
            {t('wellness_mindfulness_subtitle')}
          </p>
        </div>
      </div>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('personalized_activities_title')}</CardTitle>
            <CardDescription>
              {t('personalized_activities_subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            {activities.map((activity, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="flex-row items-center gap-4">
                  <activity.icon className="h-10 w-10 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{t(activity.titleKey as any)}</CardTitle>
                    <CardDescription>{t(activity.descriptionKey as any)}</CardDescription>
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
            <CardTitle>{t('daily_wellness_tracking_title')}</CardTitle>
            <CardDescription>
              {t('daily_wellness_tracking_subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            {wellnessTrackers.map((tracker, index) => (
              <div key={index} className="flex flex-col gap-2">
                 <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <tracker.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">{t(tracker.titleKey as any)}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{t(tracker.unitKey as any)}</span>
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
              {t('relaxing_playlists_subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {playlists.map((playlist, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-semibold">{t(playlist.titleKey as any)}</p>
                  <p className="text-sm text-muted-foreground">
                    {t(playlist.descriptionKey as any)}
                  </p>
                </div>
                <Button variant="outline">{t('play_button')}</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default memo(WellnessPage);

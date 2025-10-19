
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CloudSun, Sun, Cloud, CloudRain, Snowflake } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { summarizeWeather } from "@/ai/flows/summarize-weather";
import { Skeleton } from "@/components/ui/skeleton";

export function WeatherCard() {
  const { t, language } = useLanguage();
  const [weatherSummary, setWeatherSummary] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("CloudSun");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getWeather() {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { summary, icon } = await summarizeWeather({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              language,
            });
            setWeatherSummary(summary);
            setWeatherIcon(icon);
          } catch (error) {
            console.error("Error getting weather summary:", error);
            setWeatherSummary(t("Could not fetch weather data."));
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setWeatherSummary(t("Geolocation is not available."));
          setIsLoading(false);
        }
      );
    }
    getWeather();
  }, [language, t]);

  const renderIcon = () => {
    switch (weatherIcon.toLowerCase()) {
      case "sun":
        return <Sun className="h-16 w-16 text-yellow-500" />;
      case "cloud":
        return <Cloud className="h-16 w-16 text-gray-400" />;
      case "rain":
        return <CloudRain className="h-16 w-16 text-blue-400" />;
      case "snow":
        return <Snowflake className="h-16 w-16 text-sky-300" />;
      default:
        return <CloudSun className="h-16 w-16 text-orange-400" />;
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>{t("Local Weather")}</CardTitle>
        <CardDescription>{t("A quick look at the current weather.")}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
          </>
        ) : (
          <>
            {renderIcon()}
            <p className="flex-1 text-muted-foreground">{weatherSummary}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

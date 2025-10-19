
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
import Link from "next/link";

type Coordinates = {
  latitude: number;
  longitude: number;
};

export function WeatherCard() {
  const { t, language } = useLanguage();
  const [weatherSummary, setWeatherSummary] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("CloudSun");
  const [isLoading, setIsLoading] = useState(true);
  const [coords, setCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    async function getWeather(position: GeolocationPosition) {
      try {
        const { summary, icon } = await summarizeWeather({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          language,
        });
        setWeatherSummary(summary);
        setWeatherIcon(icon);
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } catch (error) {
        console.error("Error getting weather summary:", error);
        setWeatherSummary(t("Could not fetch weather data."));
      } finally {
        setIsLoading(false);
      }
    }

    function handleGeoError(error: GeolocationPositionError) {
      console.error("Geolocation error:", error);
      setWeatherSummary(t("Geolocation is not available."));
      setIsLoading(false);
    }
    
    navigator.geolocation.getCurrentPosition(getWeather, handleGeoError);

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

  const weatherUrl = coords
    ? `https://www.google.com/search?q=weather+${coords.latitude},${coords.longitude}`
    : "#";

  const cardContent = (
    <Card className="lg:col-span-2 h-full transition-all hover:bg-muted/50">
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

  return isLoading || !coords ? (
    <div className="lg:col-span-2">
      {cardContent}
    </div>
  ) : (
    <Link href={weatherUrl} target="_blank" rel="noopener noreferrer" className="lg:col-span-2">
      {cardContent}
    </Link>
  );
}

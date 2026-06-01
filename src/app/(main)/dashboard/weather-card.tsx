
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CloudSun, Sun, Cloud, CloudRain, Snowflake } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { summarizeWeather, type SummarizeWeatherOutput } from "@/ai/flows/summarize-weather";
import { Skeleton } from "@/components/ui/skeleton";

type Coordinates = {
  latitude: number;
  longitude: number;
};

const renderIcon = (iconName: string, className: string = "h-16 w-16") => {
  switch (iconName.toLowerCase()) {
    case "sun":
      return <Sun className={`${className} text-yellow-500`} />;
    case "cloud":
      return <Cloud className={`${className} text-gray-400`} />;
    case "rain":
      return <CloudRain className={`${className} text-blue-400`} />;
    case "snow":
      return <Snowflake className={`${className} text-sky-300`} />;
    default:
      return <CloudSun className={`${className} text-orange-400`} />;
  }
};

export function WeatherCard() {
  const { t, language } = useLanguage();
  const [weather, setWeather] = useState<SummarizeWeatherOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    const defaultCoords = { latitude: 48.8566, longitude: 2.3522 }; // Paris (Hotel Location)

    async function fetchWeather(lat: number, lon: number) {
      setIsLoading(true);
      try {
        const result = await summarizeWeather({
          latitude: lat,
          longitude: lon,
          language,
        });
        setWeather(result);
        setCoords({
          latitude: lat,
          longitude: lon,
        });
        setError(null);
      } catch (error) {
        console.error("Error getting weather summary:", error);
        setError(t("weather_fetch_error"));
      } finally {
        setIsLoading(false);
      }
    }

    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation error, checking localStorage fallback:", error);
          const cachedLat = localStorage.getItem("user_lat");
          const cachedLon = localStorage.getItem("user_lon");
          if (cachedLat && cachedLon) {
            fetchWeather(parseFloat(cachedLat), parseFloat(cachedLon));
          } else {
            fetchWeather(defaultCoords.latitude, defaultCoords.longitude);
          }
        }
      );
    } else {
      const cachedLat = typeof window !== "undefined" ? localStorage.getItem("user_lat") : null;
      const cachedLon = typeof window !== "undefined" ? localStorage.getItem("user_lon") : null;
      if (cachedLat && cachedLon) {
        fetchWeather(parseFloat(cachedLat), parseFloat(cachedLon));
      } else {
        console.warn("Geolocation not supported, falling back to hotel location.");
        fetchWeather(defaultCoords.latitude, defaultCoords.longitude);
      }
    }
  }, [language, t]);

  const cardContent = (
    <>
      <CardHeader>
        <CardTitle>{t("local_weather_title")}</CardTitle>
        <CardDescription className="hidden sm:block">{t("local_weather_description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-2 text-center">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] hidden sm:block" />
                <Skeleton className="h-4 w-[200px] hidden sm:block" />
                <Skeleton className="h-8 w-16 sm:hidden" />
            </div>
          </>
        ) : error || !weather ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <>
            <div className="flex flex-col sm:flex-col items-center gap-2">
              {renderIcon(weather.icon)}
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold sm:text-lg sm:font-normal sm:text-muted-foreground">
                  {weather.currentTemp}°C
                </p>
                <p className="text-muted-foreground hidden sm:block">{weather.summary}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </>
  );

  return (
    <Dialog>
      <DialogTrigger asChild disabled={isLoading || !!error}>
        <Card className="h-full transition-all hover:bg-muted/50 cursor-pointer">
          {cardContent}
        </Card>
      </DialogTrigger>
      {weather && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('five_day_forecast_title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                <div className="flex items-center gap-4">
                    {renderIcon(weather.icon, "h-12 w-12")}
                    <div>
                        <p className="font-semibold">{t('weather_now')}</p>
                        <p className="text-2xl font-bold">{weather.currentTemp}°C</p>
                    </div>
                </div>
            </div>
            <Accordion type="single" collapsible className="w-full">
                {weather.forecast.map((day) => (
                    <AccordionItem value={day.day} key={day.day}>
                        <AccordionTrigger>
                          <div className="flex w-full items-center justify-between">
                            <p className="w-12 font-medium">{t(day.day as any) || day.day}</p>
                            {renderIcon(day.icon, "h-6 w-6")}
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">{day.high}°</span> / {day.low}°
                            </p>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground pl-1">{day.description}</p>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}


"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lightbulb, Thermometer, Wind, Tv, Moon, BookOpen, Loader, Wifi } from "lucide-react";

function SmartRoomControls() {
  const { t } = useLanguage();
  const [brightness, setBrightness] = useState(75);
  const [temperature, setTemperature] = useState(22);
  const [colorTemperature, setColorTemperature] = useState(4000);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [makeUpRoom, setMakeUpRoom] = useState(false);
  const [selectedAmbiance, setSelectedAmbiance] = useState<string | null>(null);

  const handleAmbianceClick = (ambiance: string) => {
    if (selectedAmbiance === ambiance) {
      setSelectedAmbiance(null);
    } else {
      setSelectedAmbiance(ambiance);
    }
  };

  const ambiancePresets = [
    { id: "reading", icon: BookOpen, label: "reading_preset" },
    { id: "relax", icon: Moon, label: "relax_preset" },
    { id: "energize", icon: Lightbulb, label: "energize_preset" },
    { id: "movie", icon: Tv, label: "movie_preset" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Lighting Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('lighting_title')}</CardTitle>
          <CardDescription>{t('lighting_description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brightness">{t('brightness_label')}</Label>
            <Slider
              id="brightness"
              value={[brightness]}
              onValueChange={(value) => setBrightness(value[0])}
              max={100}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color-temp">{t('color_temperature_label')}</Label>
            <Slider
              id="color-temp"
              value={[colorTemperature]}
              onValueChange={(value) => setColorTemperature(value[0])}
              min={2700}
              max={6500}
              step={100}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ambiance Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('ambiance_title')}</CardTitle>
          <CardDescription>{t('ambiance_description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {ambiancePresets.map((preset) => (
            <Button
              key={preset.id}
              variant={selectedAmbiance === preset.id ? "default" : "outline"}
              className="flex flex-col h-20"
              onClick={() => handleAmbianceClick(preset.id)}
            >
              <preset.icon className="h-6 w-6 mb-1" />
              {t(preset.label as any)}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Climate Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('climate_title')}</CardTitle>
          <CardDescription>{t('climate_description')}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center gap-6">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => setTemperature(temperature - 1)}
          >
            <Thermometer className="h-6 w-6" />-
          </Button>
          <div className="text-center">
            <p className="text-5xl font-bold">{temperature}°C</p>
            <p className="text-sm text-muted-foreground">{t('temperature_label')}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => setTemperature(temperature + 1)}
          >
            <Thermometer className="h-6 w-6" />+
          </Button>
        </CardContent>
      </Card>

      {/* Blinds Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('blinds_title')}</CardTitle>
          <CardDescription>{t('blinds_description')}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
          <Button variant="outline" size="lg">{t('open_button')}</Button>
          <Button variant="outline" size="lg">{t('close_button')}</Button>
        </CardContent>
      </Card>
      
      {/* Room Status Card */}
      <Card className="lg:col-span-2">
          <CardHeader>
              <CardTitle>{t('room_status_title')}</CardTitle>
              <CardDescription>{t('room_status_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                  <Label htmlFor="dnd-switch" className="font-medium">
                      {t('do_not_disturb_label')}
                  </Label>
                  <Switch
                      id="dnd-switch"
                      checked={doNotDisturb}
                      onCheckedChange={setDoNotDisturb}
                  />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                  <Label htmlFor="makeup-switch" className="font-medium">
                      {t('make_up_room_label')}
                  </Label>
                  <Switch
                      id="makeup-switch"
                      checked={makeUpRoom}
                      onCheckedChange={setMakeUpRoom}
                  />
              </div>
          </CardContent>
      </Card>
    </div>
  );
}


export default function SmartRoomPage() {
  const { t } = useLanguage();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 2000);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-8 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t('smart_room_title')}
        </h1>
        <p className="text-muted-foreground">
          {t('smart_room_subtitle')}
        </p>
      </div>

      {isConnected ? (
        <SmartRoomControls />
      ) : (
        <div className="flex items-center justify-center pt-20">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-2xl">{t('connect_to_room_title')}</CardTitle>
                    <CardDescription>{t('connect_to_room_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Wifi className="h-24 w-24 text-muted-foreground" />
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleConnect} disabled={isConnecting}>
                        {isConnecting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                        {isConnecting ? t('connecting_button') : t('connect_button')}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      )}
    </div>
  );
}

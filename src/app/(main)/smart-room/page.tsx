
"use client";

import { useState, memo, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lightbulb, Thermometer, Wind, Tv, Moon, BookOpen, Loader, Wifi, Sun, User, BellOff, Sparkles as SparklesIcon } from "lucide-react";

type ControlType = "lighting" | "climate" | "ambiance" | "blinds" | "status";

function LightingControls() {
  const { t } = useLanguage();
  const [brightness, setBrightness] = useState(75);
  const [colorTemperature, setColorTemperature] = useState(4000);

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-2">
        <Label htmlFor="brightness">Luminosité</Label>
        <Slider
          id="brightness"
          value={[brightness]}
          onValueChange={(value) => setBrightness(value[0])}
          max={100}
          step={1}
        />
        <div className="text-center text-sm text-muted-foreground">{brightness}%</div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="color-temp">Température de couleur</Label>
        <Slider
          id="color-temp"
          value={[colorTemperature]}
          onValueChange={(value) => setColorTemperature(value[0])}
          min={2700}
          max={6500}
          step={100}
        />
        <div className="text-center text-sm text-muted-foreground">{colorTemperature}K</div>
      </div>
    </div>
  );
}

function AmbianceControls() {
    const { t } = useLanguage();
    const [selectedAmbiance, setSelectedAmbiance] = useState<string | null>(null);

    const handleAmbianceClick = (ambiance: string) => {
        setSelectedAmbiance(prev => (prev === ambiance ? null : ambiance));
    };

    const ambiancePresets = [
        { id: "reading", icon: BookOpen, label: "Lecture" },
        { id: "relax", icon: Moon, label: "Détente" },
        { id: "energize", icon: Lightbulb, label: "Énergie" },
        { id: "movie", icon: Tv, label: "Film" },
    ];
    return (
        <div className="grid grid-cols-2 gap-4 pt-4">
            {ambiancePresets.map((preset) => (
                <Button
                key={preset.id}
                variant={selectedAmbiance === preset.id ? "default" : "outline"}
                className="flex h-24 flex-col items-center justify-center gap-2"
                onClick={() => handleAmbianceClick(preset.id)}
                >
                <preset.icon className="h-8 w-8" />
                <span>{preset.label}</span>
                </Button>
            ))}
        </div>
    );
}

function ClimateControls() {
    const { t } = useLanguage();
    const [temperature, setTemperature] = useState(22);
    return (
        <div className="flex items-center justify-center gap-6 pt-4">
          <Button
            variant="outline"
            size="icon"
            className="h-16 w-16 rounded-full"
            onClick={() => setTemperature(temperature - 1)}
          >
            <Thermometer className="h-8 w-8" />-
          </Button>
          <div className="text-center">
            <p className="text-6xl font-bold">{temperature}°C</p>
            <p className="text-sm text-muted-foreground">Température</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-16 w-16 rounded-full"
            onClick={() => setTemperature(temperature + 1)}
          >
            <Thermometer className="h-8 w-8" />+
          </Button>
        </div>
    );
}

function BlindsControls() {
    const { t } = useLanguage();
    return (
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" size="lg" className="h-24 w-32 flex-col gap-2">
            <Sun className="h-8 w-8"/>
            Ouvrir
          </Button>
          <Button variant="outline" size="lg" className="h-24 w-32 flex-col gap-2">
            <Moon className="h-8 w-8"/>
            Fermer
          </Button>
        </div>
    );
}

function StatusControls({ doNotDisturb, setDoNotDisturb, makeUpRoom, setMakeUpRoom }: {
    doNotDisturb: boolean;
    setDoNotDisturb: (value: boolean) => void;
    makeUpRoom: boolean;
    setMakeUpRoom: (value: boolean) => void;
}) {
    const { t } = useLanguage();
    
    return (
         <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                  <Label htmlFor="dnd-switch" className="flex-1 font-medium">
                      Ne pas déranger
                  </Label>
                  <Switch
                      id="dnd-switch"
                      checked={doNotDisturb}
                      onCheckedChange={setDoNotDisturb}
                  />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                  <Label htmlFor="makeup-switch" className="flex-1 font-medium">
                      Faire la chambre
                  </Label>
                  <Switch
                      id="makeup-switch"
                      checked={makeUpRoom}
                      onCheckedChange={setMakeUpRoom}
                  />
              </div>
          </div>
    );
}


function SmartRoomControls() {
  const { t } = useLanguage();
  const [activeControl, setActiveControl] = useState<ControlType | null>(null);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [makeUpRoom, setMakeUpRoom] = useState(false);
  
  const controls: { id: ControlType; icon: React.ElementType; label: string; description: string; content: React.ReactNode, activeState?: boolean, activeIcon?: React.ElementType, activeText?: string }[] = [
    { id: 'lighting', icon: Lightbulb, label: 'Éclairage', description: 'Ajustez la luminosité et la température de couleur.', content: <LightingControls /> },
    { id: 'climate', icon: Thermometer, label: 'Climat', description: 'Réglez la température parfaite pour votre chambre.', content: <ClimateControls /> },
    { id: 'ambiance', icon: Wind, label: 'Ambiance', description: 'Créez l\'ambiance d\'un simple toucher.', content: <AmbianceControls /> },
    { id: 'blinds', icon: Sun, label: 'Stores', description: 'Contrôlez la lumière naturelle.', content: <BlindsControls /> },
    { id: 'status', icon: User, label: 'Statut de la Chambre', description: 'Informez le personnel de vos besoins.', content: <StatusControls doNotDisturb={doNotDisturb} setDoNotDisturb={setDoNotDisturb} makeUpRoom={makeUpRoom} setMakeUpRoom={setMakeUpRoom} />, activeState: doNotDisturb || makeUpRoom, activeIcon: doNotDisturb ? BellOff : SparklesIcon, activeText: doNotDisturb ? 'Ne pas déranger' : 'Faire la chambre' },
  ];

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setActiveControl(null)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {controls.map((control) => (
          <DialogTrigger asChild key={control.id}>
            <Card className="flex h-32 cursor-pointer flex-col justify-between p-4 transition-all hover:bg-muted/50" onClick={() => setActiveControl(control.id)}>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{control.label}</p>
                <control.icon className="h-6 w-6 text-primary" />
              </div>
              {control.activeState && control.activeIcon && control.activeText ? (
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <control.activeIcon className="h-4 w-4" />
                  <span>{control.activeText}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{control.description}</p>
              )}
            </Card>
          </DialogTrigger>
        ))}
      </div>
      
      <DialogContent>
        {activeControl && (
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl">{controls.find(c => c.id === activeControl)?.label}</DialogTitle>
            </DialogHeader>
            {controls.find(c => c.id === activeControl)?.content}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

const SmartRoomPage = memo(function SmartRoomPage() {
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
      
      {!isConnected ? (
          <div className="flex items-center justify-center pt-20">
              <Card className="w-full max-w-md text-center">
                  <CardHeader>
                      <CardTitle className="text-2xl">Se Connecter à la Chambre</CardTitle>
                      <CardDescription>Appuyez sur le bouton pour vous connecter aux systèmes de votre chambre.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                      <Wifi className="h-24 w-24 text-muted-foreground" />
                  </CardContent>
                  <CardFooter>
                      <Button className="w-full" onClick={handleConnect} disabled={isConnecting}>
                          {isConnecting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                          {isConnecting ? "Connexion en cours..." : "Se connecter"}
                      </Button>
                  </CardFooter>
              </Card>
          </div>
      ) : (
        <SmartRoomControls />
      )}
    </div>
  );
});

export default SmartRoomPage;

    


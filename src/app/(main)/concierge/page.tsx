
"use client";

import { useState, useRef, useEffect, memo } from "react";
import type { FormEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot } from "lucide-react";
import type { Message } from "@/lib/types";
import { answerUserQuery } from "@/ai/flows/answer-user-queries";
import { useUserProfile } from "@/context/user-profile-context";
import { useLanguage } from "@/context/language-context";
import { summarizeWeather, type SummarizeWeatherOutput } from "@/ai/flows/summarize-weather";
import restaurantMenu from '@/lib/restaurant-menu.json';
import signatureMenu from '@/lib/signature-menu.json';
import roomServiceMenu from '@/lib/room-service-menu.json';
import wellnessServices from '@/lib/wellness-services.json';


const ConciergePage = memo(function ConciergePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { profile } = useUserProfile();
  const { t, language } = useLanguage();
  const [weather, setWeather] = useState<SummarizeWeatherOutput | null>(null);
  const [coords, setCoords] = useState<{latitude: number, longitude: number} | null>(null);

  useEffect(() => {
    function getWeather(position: GeolocationPosition) {
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      summarizeWeather({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        language: language,
      }).then(setWeather).catch(console.error);
    }
    
    function handleGeoError(error: GeolocationPositionError) {
      console.error("Geolocation error:", error);
    }
    
    navigator.geolocation.getCurrentPosition(getWeather, handleGeoError);
  }, [language]);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  const knowledgeBase = `
    GENERAL HOTEL INFO: 
    - Check-in is at 3:00 PM, Check-out is at 11:00 AM.
    - We cater to bleisure travelers with high-speed Wi-Fi throughout the hotel and dedicated co-working areas in the lobby.
    - Eco-commitments: Solar panels for hot water, linen reuse program, 80% of restaurant ingredients from local farms within a 50-mile radius, EV charging stations, partnership with a local e-bike rental company.
    - Direct booking for services is available through their respective pages in the app.

    SPECIAL REQUESTS:
    - Guests can request a "Wake-up Call" or a "Late Check-out" through the "Special Requests" (Requêtes Spéciales) page in the app. If a guest asks for either of these, explicitly tell them to navigate to the "Special Requests" section of the app to submit their preferred time.

    RESTAURANT MENUS:
    - Vegetarian Menu: ${JSON.stringify(restaurantMenu)}
    - Signature Menu: ${JSON.stringify(signatureMenu)}

    ROOM SERVICE MENUS:
    - Classic, Vegan, and Beverages: ${JSON.stringify(roomServiceMenu)}

    WELLNESS & SERVICES:
    - Spa, Fitness, Eco-Services: ${JSON.stringify(wellnessServices)}
  `;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await answerUserQuery({
        query: input,
        userProfile: {
          language: profile.language,
          tripType: profile.tripType,
          ecoSensitivity: profile.ecoSensitivity,
          budget: "moderate", // Placeholder
        },
        knowledgeBase: knowledgeBase,
        geolocation: coords || undefined,
        weatherCondition: weather?.summary,
        timeOfDay: getTimeOfDay(),
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: t("concierge_error"),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Error fetching AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold font-headline">{t('concierge_title')}</h1>
        <p className="text-muted-foreground">
          {t('concierge_subtitle')}
        </p>
      </header>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-6 pr-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 ${
                message.role === "user" ? "justify-end" : ""
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-md rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://picsum.photos/seed/avatar/200" alt={profile.name} />
                  <AvatarFallback>{profile.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-md rounded-lg bg-muted p-3">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="mt-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('concierge_placeholder')}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
});

export default ConciergePage;

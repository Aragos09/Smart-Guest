
"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { personalizedRecommendation } from "@/ai/flows/personalized-recommendation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Experience } from "@/lib/types";
import { useLanguage } from "@/context/language-context";
import { useEffect, useState, memo } from "react";
import { useUserProfile } from "@/context/user-profile-context";

const mockExperiences: Experience[] = [
  {
    id: "nature-hike",
    name: "guided_nature_hike_title",
    description: "guided_nature_hike_desc",
    image: PlaceHolderImages.find(p => p.id === 'guided-nature-hike')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'guided-nature-hike')?.imageHint || '',
  },
  {
    id: "artisan-market",
    name: "local_artisan_market_title",
    description: "local_artisan_market_desc",
    image: PlaceHolderImages.find(p => p.id === 'local-artisan-market')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'local-artisan-market')?.imageHint || '',
  },
  {
    id: "gardening-workshop",
    name: "urban_gardening_workshop_title",
    description: "urban_gardening_workshop_desc",
    image: PlaceHolderImages.find(p => p.id === 'urban-gardening-workshop')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'urban-gardening-workshop')?.imageHint || '',
  },
  {
    id: "cooking-class",
    name: "zero_waste_cooking_class_title",
    description: "zero_waste_cooking_class_desc",
    image: PlaceHolderImages.find(p => p.id === 'zero-waste-cooking-class')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'zero-waste-cooking-class')?.imageHint || '',
  },
];

function ExperienceCard({ experience }: { experience: Experience }) {
  const { t } = useLanguage();
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative h-56 w-full">
        <Image
          src={experience.image}
          alt={t(experience.name as any)}
          fill
          className="object-cover"
          data-ai-hint={experience.imageHint}
        />
      </div>
      <CardHeader>
        <CardTitle>{t(experience.name as any)}</CardTitle>
        <CardDescription>{t(experience.description as any)}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Button variant="secondary" className="w-full">
          {t('learn_more_button')}
        </Button>
      </CardFooter>
    </Card>
  );
}

const ExperiencesPage = memo(function ExperiencesPage({ params }: { params: { locale: string }}) {
  const { t } = useLanguage();
  const [displayExperiences, setDisplayExperiences] = useState<Experience[]>(mockExperiences);
  const { profile } = useUserProfile();

  useEffect(() => {
    async function getRecommendations() {
      // In a real app, these values would be dynamic.
      const recommendationInput = {
        language: profile.language,
        tripType: profile.tripType,
        ecoSensitivity: profile.ecoSensitivity,
        geolocation: { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
        weatherCondition: "Sunny",
        userProfile: "User enjoys outdoor activities and cultural experiences. Interested in photography."
      };

      try {
        const { recommendations } = await personalizedRecommendation(recommendationInput);
        
        // For this scaffold, we'll map AI recommendations to our mock data.
        // A real implementation would fetch detailed data from a database based on the recommendation IDs/names.
        const recommendedExperiences = mockExperiences.filter(exp => 
          recommendations.some(rec => rec.toLowerCase().includes(exp.name.toLowerCase()))
        );
        
        // If AI recommendations don't match, show all mock experiences as a fallback.
        setDisplayExperiences(recommendedExperiences.length > 0 ? recommendedExperiences : mockExperiences);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setDisplayExperiences(mockExperiences);
      }
    }
    
    if (profile.name) {
      getRecommendations();
    }
  }, [profile]);


  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-8 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t('experiences_title')}
        </h1>
        <p className="text-muted-foreground">
          {t('experiences_subtitle')}
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {displayExperiences.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>
    </div>
  );
});

export default ExperiencesPage;

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

const mockExperiences: Experience[] = [
  {
    id: "nature-hike",
    name: "Guided Nature Hike",
    description: "Explore the breathtaking local trails with an expert guide. Learn about the native flora and fauna.",
    image: PlaceHolderImages.find(p => p.id === 'guided-nature-hike')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'guided-nature-hike')?.imageHint || '',
  },
  {
    id: "artisan-market",
    name: "Local Artisan Market",
    description: "Visit the weekly market to discover unique, handmade goods from local artists and craftspeople.",
    image: PlaceHolderImages.find(p => p.id === 'local-artisan-market')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'local-artisan-market')?.imageHint || '',
  },
  {
    id: "gardening-workshop",
    name: "Urban Gardening Workshop",
    description: "Get your hands dirty and learn the basics of sustainable urban gardening on a rooftop farm.",
    image: PlaceHolderImages.find(p => p.id === 'urban-gardening-workshop')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'urban-gardening-workshop')?.imageHint || '',
  },
  {
    id: "cooking-class",
    name: "Zero-Waste Cooking Class",
    description: "Learn how to create delicious meals while minimizing food waste with a professional chef.",
    image: PlaceHolderImages.find(p => p.id === 'zero-waste-cooking-class')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'zero-waste-cooking-class')?.imageHint || '',
  },
];

function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative h-56 w-full">
        <Image
          src={experience.image}
          alt={experience.name}
          fill
          className="object-cover"
          data-ai-hint={experience.imageHint}
        />
      </div>
      <CardHeader>
        <CardTitle>{experience.name}</CardTitle>
        <CardDescription>{experience.description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Button variant="secondary" className="w-full">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
}

export default async function ExperiencesPage() {
  // In a real app, these values would be dynamic.
  const recommendationInput = {
    language: "en",
    tripType: "leisure",
    ecoSensitivity: "high" as "high" | "medium" | "low",
    geolocation: { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
    weatherCondition: "Sunny",
    userProfile: "User enjoys outdoor activities and cultural experiences. Interested in photography."
  };

  const { recommendations } = await personalizedRecommendation(recommendationInput);
  
  // For this scaffold, we'll map AI recommendations to our mock data.
  // A real implementation would fetch detailed data from a database based on the recommendation IDs/names.
  const recommendedExperiences = mockExperiences.filter(exp => 
    recommendations.some(rec => rec.toLowerCase().includes(exp.name.toLowerCase()))
  );
  
  // If AI recommendations don't match, show all mock experiences as a fallback.
  const displayExperiences = recommendedExperiences.length > 0 ? recommendedExperiences : mockExperiences;

  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-8 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Local Eco-Friendly Experiences
        </h1>
        <p className="text-muted-foreground">
          Personalized recommendations for sustainable activities near you.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {displayExperiences.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>
    </div>
  );
}

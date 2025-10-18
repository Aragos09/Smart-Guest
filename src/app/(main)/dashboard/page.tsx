import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ArrowRight,
  BotMessageSquare,
  Building2,
  HeartHandshake,
  Leaf,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { generateDynamicWelcomeMessage } from "@/ai/flows/dynamic-welcome-message";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
} from "recharts";

const chartData = [
  { category: "Water", score: 82, fullMark: 100 },
  { category: "Energy", score: 75, fullMark: 100 },
  { category: "Waste", score: 90, fullMark: 100 },
  { category: "Transport", score: 65, fullMark: 100 },
  { category: "Sourcing", score: 88, fullMark: 100 },
];

const chartConfig = {
  score: {
    label: "EcoScore",
    color: "hsl(var(--accent))",
  },
};

const quickLinks = [
  {
    href: "/eco-manager",
    icon: Leaf,
    title: "Eco Manager",
    description: "Track your impact.",
  },
  {
    href: "/services",
    icon: Building2,
    title: "Sustainable Services",
    description: "Book eco-friendly services.",
  },
  {
    href: "/experiences",
    icon: HeartHandshake,
    title: "Local Experiences",
    description: "Discover green activities.",
  },
  {
    href: "/concierge",
    icon: BotMessageSquare,
    title: "AI Concierge",
    description: "Ask me anything.",
  },
];

export default async function DashboardPage() {
  const welcomeMessageData = await generateDynamicWelcomeMessage({
    userName: "Alex",
    travelHistory: "Frequent business traveler, last stayed in our eco-suite.",
    userPreferences: "Prefers quiet rooms, plant-based meals, and digital check-ins.",
    ecoSensitivity: "high",
    newOptions: "We've introduced a new rooftop garden and electric scooter rentals.",
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            Welcome back, Alex!
          </CardTitle>
          <CardDescription>
            {welcomeMessageData.welcomeMessage}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your EcoScore</CardTitle>
            <CardDescription>
              A summary of your environmental impact during your stay.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[350px]"
            >
              <RadarChart data={chartData}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <PolarAngleAxis dataKey="category" />
                <PolarGrid />
                <Radar
                  dataKey="score"
                  fill="var(--color-score)"
                  fillOpacity={0.6}
                  stroke="var(--color-score)"
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>
              Navigate to key features of your Smart Guest experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link href={link.href} key={link.href} passHref>
                <div className="group flex h-full flex-col rounded-lg border p-4 transition-colors hover:bg-accent/10">
                  <div className="flex items-center justify-between">
                    <link.icon className="h-8 w-8 text-primary" />
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold">{link.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

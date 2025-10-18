"use client";

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
  ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Area,
} from "recharts";
import {
  EnergyBadge,
  LeafBadge,
  RecycleBadge,
  WaterBadge,
} from "@/components/icons";

const impactChartData = [
  { category: "Water", impact: 186, target: 200 },
  { category: "Energy", impact: 305, target: 300 },
  { category: "Waste", impact: 237, target: 250 },
  { category: "Sourcing", impact: 73, target: 100 },
];

const impactChartConfig = {
  impact: {
    label: "Your Impact",
    color: "hsl(var(--primary))",
  },
  target: {
    label: "Target",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig;

const trendChartData = [
  { date: "Day 1", score: 65 },
  { date: "Day 2", score: 72 },
  { date: "Day 3", score: 70 },
  { date: "Day 4", score: 78 },
  { date: "Day 5", score: 82 },
  { date: "Day 6", score: 85 },
];

const trendChartConfig = {
  score: {
    label: "EcoScore",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const badges = [
  {
    icon: WaterBadge,
    title: "Water Saver",
    description: "Used less water than average for 3 consecutive days.",
    color: "text-blue-500",
  },
  {
    icon: EnergyBadge,
    title: "Energy Star",
    description: "Consumed 15% less energy than the daily target.",
    color: "text-yellow-500",
  },
  {
    icon: RecycleBadge,
    title: "Recycling Champion",
    description: "Recycled over 5kg of waste.",
    color: "text-green-500",
  },
  {
    icon: LeafBadge,
    title: "Eco Pioneer",
    description: "Booked two or more sustainable services.",
    color: "text-teal-500",
  },
];

export default function EcoManagerPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Eco Manager</h1>
          <p className="text-muted-foreground">
            Visualize your positive impact on the environment.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Impact Breakdown</CardTitle>
            <CardDescription>
              Your consumption compared to daily eco-targets. (Lower is better)
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={impactChartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={impactChartData} layout="vertical">
                <CartesianGrid horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="category"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  width={80}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="impact"
                  name="Your Impact"
                  fill="var(--color-impact)"
                  radius={4}
                  barSize={20}
                />
                <Bar
                  dataKey="target"
                  name="Target"
                  fill="var(--color-target)"
                  radius={4}
                  barSize={20}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>EcoScore Trend</CardTitle>
            <CardDescription>Your daily EcoScore during your stay.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendChartConfig} className="h-[300px] w-full">
              <LineChart
                accessibilityLayer
                data={trendChartData}
                margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <defs>
                  <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-score)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-score)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="score"
                  type="natural"
                  fill="url(#fillScore)"
                  stroke="var(--color-score)"
                  stackId="a"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-7">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>
              Badges you've earned for your eco-friendly choices.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {badges.map((badge, index) => (
              <div key={index} className="flex items-start space-x-4">
                <badge.icon className={`h-12 w-12 shrink-0 ${badge.color}`} />
                <div>
                  <p className="font-semibold">{badge.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

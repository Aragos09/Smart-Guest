
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
  Area,
  LineChart,
} from "recharts";
import {
  EnergyBadge,
  LeafBadge,
  RecycleBadge,
  WaterBadge,
} from "@/components/icons";
import { useLanguage } from "@/context/language-context";
import { memo } from "react";

const impactChartData = [
  { category: "water_category", impact: 186, target: 200 },
  { category: "energy_category", impact: 305, target: 300 },
  { category: "waste_category", impact: 237, target: 250 },
  { category: "sourcing_category", impact: 73, target: 100 },
];

const trendChartData = [
  { date: "Day 1", score: 65 },
  { date: "Day 2", score: 72 },
  { date: "Day 3", score: 70 },
  { date: "Day 4", score: 78 },
  { date: "Day 5", score: 82 },
  { date: "Day 6", score: 85 },
];

const EcoManagerPage = memo(function EcoManagerPage({ params }: { params: { locale: string }}) {
  const { t } = useLanguage();

  const impactChartConfig = {
    impact: {
      label: t("your_impact_label"),
      color: "hsl(var(--primary))",
    },
    target: {
      label: t("target_label"),
      color: "hsl(var(--muted-foreground))",
    },
  } satisfies ChartConfig;
  
  const trendChartConfig = {
    score: {
      label: "EcoScore",
      color: "hsl(var(--accent))",
    },
  } satisfies ChartConfig;

  const badges = [
    {
      icon: WaterBadge,
      title: "water_saver_badge",
      description: "water_saver_badge_desc",
      color: "text-blue-500",
    },
    {
      icon: EnergyBadge,
      title: "energy_star_badge",
      description: "energy_star_badge_desc",
      color: "text-yellow-500",
    },
    {
      icon: RecycleBadge,
      title: "recycling_champion_badge",
      description: "recycling_champion_badge_desc",
      color: "text-green-500",
    },
    {
      icon: LeafBadge,
      title: "eco_pioneer_badge",
      description: "eco_pioneer_badge_desc",
      color: "text-teal-500",
    },
  ];

  const localizedImpactData = impactChartData.map(item => ({
    ...item,
    category: t(item.category as any),
  }));

  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-8 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">{t('eco_manager_title')}</h1>
          <p className="text-muted-foreground">
            {t('eco_manager_subtitle')}
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t('impact_breakdown_title')}</CardTitle>
            <CardDescription>
              {t('impact_breakdown_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={impactChartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={localizedImpactData} layout="vertical">
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
                  name={t("your_impact_label")}
                  fill="var(--color-impact)"
                  radius={4}
                  barSize={20}
                />
                <Bar
                  dataKey="target"
                  name={t("target_label")}
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
            <CardTitle>{t('ecoscore_trend_title')}</CardTitle>
            <CardDescription>{t('ecoscore_trend_description')}</CardDescription>
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
            <CardTitle>{t('achievements_title')}</CardTitle>
            <CardDescription>
              {t("achievements_description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {badges.map((badge, index) => (
              <div key={index} className="flex items-start space-x-4">
                <badge.icon className={`h-12 w-12 shrink-0 ${badge.color}`} />
                <div>
                  <p className="font-semibold">{t(badge.title as any)}</p>
                  <p className="text-sm text-muted-foreground">
                    {t(badge.description as any)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default EcoManagerPage;


"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
} from "recharts";
import { memo } from 'react';
import { useLanguage } from "@/context/language-context";

const chartConfig = {
  score: {
    label: "EcoScore",
    color: "hsl(var(--accent))",
  },
};

export const EcoScoreChart = memo(function EcoScoreChart() {
  const { t } = useLanguage();

  const chartData = [
    { category: t('water_category' as any), score: 82, fullMark: 100 },
    { category: t('energy_category' as any), score: 75, fullMark: 100 },
    { category: t('waste_category' as any), score: 90, fullMark: 100 },
    { category: t('sourcing_category' as any), score: 88, fullMark: 100 },
  ];

  return (
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
  );
});

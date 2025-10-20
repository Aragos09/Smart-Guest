
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

export const EcoScoreChart = memo(function EcoScoreChart() {
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

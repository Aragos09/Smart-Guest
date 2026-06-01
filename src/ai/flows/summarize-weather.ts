
'use server';

/**
 * @fileOverview A Genkit flow to summarize the weather for a given location.
 *
 * - summarizeWeather - A function that returns a weather summary and icon.
 * - SummarizeWeatherInput - The input type for the summarizeWeather function.
 * - SummarizeWeatherOutput - The return type for the summarizeWeather function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SummarizeWeatherInputSchema = z.object({
  latitude: z.number().describe('The latitude for the weather forecast.'),
  longitude: z.number().describe('The longitude for the weather forecast.'),
  language: z.string().describe('The language for the weather summary.'),
});

export type SummarizeWeatherInput = z.infer<typeof SummarizeWeatherInputSchema>;

const DailyForecastSchema = z.object({
    day: z.string().describe("The day of the week (e.g., 'Monday')."),
    icon: z.enum(["Sun", "CloudSun", "Cloud", "Rain", "Snow"]).describe('An icon name that best represents the weather conditions for the day.'),
    high: z.number().describe('The high temperature for the day in Celsius.'),
    low: z.number().describe('The low temperature for the day in Celsius.'),
    description: z.string().describe('A very brief (5-10 word) description of the weather for that day.'),
});

const SummarizeWeatherOutputSchema = z.object({
  summary: z.string().describe('A short, descriptive summary of the current weather (e.g., "Sunny with a light breeze, perfect for a walk.").'),
  icon: z.enum(["Sun", "CloudSun", "Cloud", "Rain", "Snow"]).describe('An icon name that best represents the current weather conditions.'),
  currentTemp: z.number().describe('The current temperature in Celsius.'),
  forecast: z.array(DailyForecastSchema).describe("A 5-day weather forecast."),
});

export type SummarizeWeatherOutput = z.infer<typeof SummarizeWeatherOutputSchema>;

export async function summarizeWeather(
  input: SummarizeWeatherInput
): Promise<SummarizeWeatherOutput> {
  const simulatedWeatherData = {
    current: {
        temperature: 22,
        condition: 'Partly Cloudy',
        windSpeed: 10,
    },
    forecast: [
        { day: "Today", high: 24, low: 18, condition: "Partly Cloudy" },
        { day: "Mon", high: 26, low: 19, condition: "Sunny" },
        { day: "Tue", high: 23, low: 17, condition: "Cloudy" },
        { day: "Wed", high: 20, low: 15, condition: "Rain" },
        { day: "Thu", high: 25, low: 18, condition: "Sunny" },
    ],
  };

  const isFrench = input.language?.toLowerCase().startsWith('fr');
  
  const summary = isFrench 
    ? "Partiellement nuageux avec une brise légère de 10 km/h, idéal pour une promenade éco-responsable."
    : "Partly cloudy with a gentle breeze of 10 km/h, perfect for a sustainable walk.";

  const forecast = simulatedWeatherData.forecast.map(day => {
    let icon: "Sun" | "CloudSun" | "Cloud" | "Rain" | "Snow" = "CloudSun";
    let desc = "";
    
    if (day.condition === "Sunny") {
      icon = "Sun";
      desc = isFrench ? "Grand soleil toute la journée." : "Clear skies and sunny.";
    } else if (day.condition === "Cloudy") {
      icon = "Cloud";
      desc = isFrench ? "Ciel couvert et nuageux." : "Overcast and cloudy skies.";
    } else if (day.condition === "Rain") {
      icon = "Rain";
      desc = isFrench ? "Pluie modérée passagère." : "Showers and rain.";
    } else {
      icon = "CloudSun";
      desc = isFrench ? "Éclaircies et passages nuageux." : "Intervals of sun and clouds.";
    }

    return {
      day: day.day,
      icon,
      high: day.high,
      low: day.low,
      description: desc
    };
  });

  return {
    summary,
    icon: "CloudSun",
    currentTemp: simulatedWeatherData.current.temperature,
    forecast
  };
}

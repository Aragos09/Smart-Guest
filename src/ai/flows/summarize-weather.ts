
'use server';

/**
 * @fileOverview A Genkit flow to summarize the weather for a given location.
 *
 * - summarizeWeather - A function that returns a weather summary and icon.
 * - SummarizeWeatherInput - The input type for the summarizeWeather function.
 * - SummarizeWeatherOutput - The return type for the summarizeWeather function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeWeatherInputSchema = z.object({
  latitude: z.number().describe('The latitude for the weather forecast.'),
  longitude: z.number().describe('The longitude for the weather forecast.'),
  language: z.string().describe('The language for the weather summary.'),
});

export type SummarizeWeatherInput = z.infer<typeof SummarizeWeatherInputSchema>;

const SummarizeWeatherOutputSchema = z.object({
  summary: z.string().describe('A short, descriptive summary of the weather (e.g., "Sunny with a light breeze, perfect for a walk.").'),
  icon: z.enum(["Sun", "CloudSun", "Cloud", "Rain", "Snow"]).describe('An icon name that best represents the weather conditions.'),
});

export type SummarizeWeatherOutput = z.infer<typeof SummarizeWeatherOutputSchema>;

export async function summarizeWeather(
  input: SummarizeWeatherInput
): Promise<SummarizeWeatherOutput> {
  // In a real app, you would call a weather API here.
  // For this example, we will simulate the API call and use AI to generate a creative summary.
  const simulatedWeatherData = {
    temperature: 22,
    condition: 'Partly Cloudy',
    windSpeed: 10,
  };

  const flow = ai.defineFlow(
    {
      name: 'summarizeWeatherFlow',
      inputSchema: z.object({
        weatherData: z.any(),
        language: z.string(),
      }),
      outputSchema: SummarizeWeatherOutputSchema,
    },
    async ({ weatherData, language }) => {
      const prompt = ai.definePrompt({
        name: 'summarizeWeatherPrompt',
        output: { schema: SummarizeWeatherOutputSchema },
        prompt: `Based on the following weather data, provide a short, friendly, and descriptive summary for a hotel guest. Also suggest an appropriate icon.

        The summary should be in ${language}.
        
        Weather Data:
        - Condition: ${weatherData.condition}
        - Temperature: ${weatherData.temperature}°C
        - Wind Speed: ${weatherData.windSpeed} km/h
        `,
      });

      const { output } = await prompt();
      return output!;
    }
  );

  return await flow({ weatherData: simulatedWeatherData, language: input.language });
}

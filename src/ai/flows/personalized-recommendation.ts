'use server';

/**
 * @fileOverview Personalized recommendation flow for sustainable services and local eco-friendly experiences.
 *
 * - personalizedRecommendation - A function that generates personalized recommendations.
 * - PersonalizedRecommendationInput - The input type for the personalizedRecommendation function.
 * - PersonalizedRecommendationOutput - The return type for the personalizedRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationInputSchema = z.object({
  language: z.string().describe('User language preference.'),
  tripType: z.string().describe('Type of trip the user is planning (e.g., business, leisure).'),
  ecoSensitivity: z.string().describe('User eco-sensitivity level (e.g., high, medium, low).'),
  geolocation: z.object({
    latitude: z.number().describe('Latitude of the user.'),
    longitude: z.number().describe('Longitude of the user.'),
  }).describe('User geolocation coordinates.'),
  weatherCondition: z.string().describe('Current weather condition at the user location.'),
  userProfile: z.string().describe('The user profile and preferences')
});
export type PersonalizedRecommendationInput = z.infer<typeof PersonalizedRecommendationInputSchema>;

const PersonalizedRecommendationOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of personalized recommendations for sustainable services and local eco-friendly experiences.')
});
export type PersonalizedRecommendationOutput = z.infer<typeof PersonalizedRecommendationOutputSchema>;

export async function personalizedRecommendation(input: PersonalizedRecommendationInput): Promise<PersonalizedRecommendationOutput> {
  return personalizedRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationPrompt',
  input: {schema: PersonalizedRecommendationInputSchema},
  output: {schema: PersonalizedRecommendationOutputSchema},
  prompt: `You are an AI concierge providing personalized recommendations for sustainable services and local eco-friendly experiences.

  Based on the user's profile preferences, geolocation, and weather conditions, provide a list of recommendations.

  User Language: {{{language}}}
  Trip Type: {{{tripType}}}
  Eco-Sensitivity: {{{ecoSensitivity}}}
  Geolocation: Latitude: {{{geolocation.latitude}}}, Longitude: {{{geolocation.longitude}}}
  Weather Condition: {{{weatherCondition}}}
  User Profile: {{{userProfile}}}

  Provide recommendations as a list of strings.
  `
});

const personalizedRecommendationFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationFlow',
    inputSchema: PersonalizedRecommendationInputSchema,
    outputSchema: PersonalizedRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

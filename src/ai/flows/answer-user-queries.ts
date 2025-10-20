'use server';

/**
 * @fileOverview This file defines a Genkit flow for an intelligent concierge that provides
 * hyper-personalized recommendations. It analyzes user preferences, location, weather, and time
 * to suggest activities, restaurants, and eco-friendly options.
 *
 * - answerUserQuery - A function that handles the user query and returns an answer.
 * - AnswerUserQueryInput - The input type for the answerUserQuery function.
 * - AnswerUserQueryOutput - The return type for the answerUserQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerUserQueryInputSchema = z.object({
  query: z.string().describe('The user query about sustainable travel, eco-friendly practices, or service details.'),
  userProfile: z.object({
    language: z.string().optional().describe('The user’s preferred language.'),
    tripType: z.string().optional().describe('The user’s preferred trip type (e.g., business, leisure).'),
    ecoSensitivity: z.string().optional().describe('The user’s eco-sensitivity level (e.g., high, medium, low).'),
    budget: z.string().optional().describe('The user\'s budget preference.'),
  }).optional().describe('The user profile including language, trip type, and eco-sensitivity.'),
  knowledgeBase: z.string().optional().describe('A knowledge base of eco-friendly information, hotel services, and local partners.'),
  geolocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional().describe('The current geolocation of the user.'),
  weatherCondition: z.string().optional().describe('The current weather condition.'),
  timeOfDay: z.string().optional().describe('The current time of day (e.g., morning, afternoon, evening).'),
});

export type AnswerUserQueryInput = z.infer<typeof AnswerUserQueryInputSchema>;

const AnswerUserQueryOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query, based on the knowledge base and user profile.'),
});

export type AnswerUserQueryOutput = z.infer<typeof AnswerUserQueryOutputSchema>;

export async function answerUserQuery(input: AnswerUserQueryInput): Promise<AnswerUserQueryOutput> {
  return answerUserQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerUserQueryPrompt',
  input: {schema: AnswerUserQueryInputSchema},
  output: {schema: AnswerUserQueryOutputSchema},
  prompt: `You are an intelligent, conversational AI concierge for a luxury, eco-friendly hotel. Your goal is to provide hyper-personalized recommendations to guests.

You have access to a knowledge base about the hotel's services, sustainability practices, and local partners. You also receive context about the user and their environment.

Analyze all the provided information to give helpful, relevant, and personalized suggestions.

Your recommendations should:
1.  Align with the user's profile (trip type, eco-sensitivity, budget).
2.  Be appropriate for the current weather, time of day, and user's location.
3.  Prioritize ethical and sustainable partners: certified establishments, short supply chains, local artisans, and low-impact experiences.
4.  Be conversational and friendly in tone. If the user asks to book something, guide them to the relevant section of the app (e.g., "You can book a spa session under the 'Wellness' section.").

If the knowledge base doesn't have the answer, use your general knowledge to provide a helpful response.

CONTEXT:
- Knowledge Base: {{{knowledgeBase}}}
- User Profile: {{{userProfile}}}
- Geolocation: {{{geolocation}}}
- Current Weather: {{{weatherCondition}}}
- Time of Day: {{{timeOfDay}}}

USER QUERY:
{{{query}}}

Answer:`,
});

const answerUserQueryFlow = ai.defineFlow(
  {
    name: 'answerUserQueryFlow',
    inputSchema: AnswerUserQueryInputSchema,
    outputSchema: AnswerUserQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

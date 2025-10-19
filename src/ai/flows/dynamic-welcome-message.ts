
'use server';

/**
 * @fileOverview AI flow for generating a dynamic welcome message personalized to the user.
 *
 * - generateDynamicWelcomeMessage - A function that generates a personalized welcome message.
 * - DynamicWelcomeMessageInput - The input type for the generateDynamicWelcomeMessage function.
 * - DynamicWelcomeMessageOutput - The return type for the generateDynamicWelcomeMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DynamicWelcomeMessageInputSchema = z.object({
  userName: z.string().describe('The name of the user.'),
  travelHistory: z.string().describe('The user travel history.'),
  userPreferences: z.string().describe('The user preferences.'),
  ecoSensitivity: z.enum(['low', 'medium', 'high']).describe('The user eco sensitivity level.'),
  newOptions: z.string().describe('A summary of new eco-friendly options and recommendations for the area'),
  language: z.string().describe('The language to generate the message in.')
});
export type DynamicWelcomeMessageInput = z.infer<typeof DynamicWelcomeMessageInputSchema>;

const DynamicWelcomeMessageOutputSchema = z.object({
  welcomeMessage: z.string().describe('A personalized welcome message for the user.'),
});
export type DynamicWelcomeMessageOutput = z.infer<typeof DynamicWelcomeMessageOutputSchema>;

export async function generateDynamicWelcomeMessage(input: DynamicWelcomeMessageInput): Promise<DynamicWelcomeMessageOutput> {
  return dynamicWelcomeMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dynamicWelcomeMessagePrompt',
  input: {schema: DynamicWelcomeMessageInputSchema},
  output: {schema: DynamicWelcomeMessageOutputSchema},
  prompt: `You are an AI assistant that generates dynamic welcome messages for returning users.

  Based on the user's travel history, user preferences, and eco-sensitivity, create a personalized welcome message. Do not include a salutation or the user's name in your response.
  Also include a summary of new eco-friendly options and recommendations for the area.

  Crucially, you must adapt the tone and content based on the user's eco-sensitivity level:
  - If ecoSensitivity is 'high', be enthusiastic about the new eco-options and frame them as exciting opportunities for sustainable living.
  - If ecoSensitivity is 'medium', mention the new options in a balanced way, highlighting both convenience and sustainability.
  - If ecoSensitivity is 'low', introduce the new options subtly, focusing on their benefits for comfort and experience (e.g., "try our new e-scooters for a fun way to see the city"). Avoid overly "green" language.

  The message must be in the following language: {{{language}}}

  User Name: {{{userName}}}
  Travel History: {{{travelHistory}}}
  User Preferences: {{{userPreferences}}}
  Eco-Sensitivity: {{{ecoSensitivity}}}
  New Eco-Friendly Options: {{{newOptions}}}

  Welcome Message:`,
});

const dynamicWelcomeMessageFlow = ai.defineFlow(
  {
    name: 'dynamicWelcomeMessageFlow',
    inputSchema: DynamicWelcomeMessageInputSchema,
    outputSchema: DynamicWelcomeMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


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
  ecoSensitivity: z.string().describe('The user eco sensitivity.'),
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

  Based on the user's name, travel history, user preferences, and eco-sensitivity, create a personalized welcome message.
  Also include a summary of new eco-friendly options and recommendations for the area.

  The message should be in the following language: {{{language}}}

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

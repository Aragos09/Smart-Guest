'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering user queries related to sustainable travel,
 * local eco-friendly practices, and specific service details. It leverages a knowledge base to provide
 * relevant information to the user.
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
    language: z.string().optional().describe('The user\u2019s preferred language.'),
    tripType: z.string().optional().describe('The user\u2019s preferred trip type.'),
    ecoSensitivity: z.string().optional().describe('The user\u2019s eco-sensitivity level.'),
  }).optional().describe('The user profile including language, trip type, and eco-sensitivity.'),
  knowledgeBase: z.string().optional().describe('A knowledge base of eco-friendly information.'),
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
  prompt: `You are a helpful AI concierge specializing in sustainable travel and eco-friendly practices.

  You have access to a knowledge base of eco-friendly information and the user's profile, which includes their language, trip type, and eco-sensitivity.

  Use this information to answer the user's query as accurately and informatively as possible.  If the knowledge base does not contain the answer, answer to the best of your ability.

  Knowledge Base: {{{knowledgeBase}}}
  User Profile: {{{userProfile}}}
  Query: {{{query}}}

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

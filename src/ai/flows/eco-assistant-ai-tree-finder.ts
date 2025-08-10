'use server';
/**
 * @fileOverview An AI agent that helps users find trees near them.
 *
 * - findTreesNearMe - A function that allows users to find trees near their location.
 * - FindTreesNearMeInput - The input type for the findTreesNearMe function.
 * - FindTreesNearMeOutput - The return type for the findTreesNearMe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindTreesNearMeInputSchema = z.object({
  userLocation: z
    .string()
    .describe("The user's current location, as a string."),
  treeSpeciesPreference: z
    .string()
    .optional()
    .describe('The user preference for type of trees, if any.'),
});
export type FindTreesNearMeInput = z.infer<typeof FindTreesNearMeInputSchema>;

const FindTreesNearMeOutputSchema = z.object({
  treeLocations: z
    .string()
    .describe('A list of locations of trees near the user.'),
  additionalNotes: z
    .string()
    .optional()
    .describe('Any additional notes or information.'),
});
export type FindTreesNearMeOutput = z.infer<typeof FindTreesNearMeOutputSchema>;

export async function findTreesNearMe(input: FindTreesNearMeInput): Promise<FindTreesNearMeOutput> {
  return findTreesNearMeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findTreesNearMePrompt',
  input: {schema: FindTreesNearMeInputSchema},
  output: {schema: FindTreesNearMeOutputSchema},
  prompt: `Jesteś EcoAssistant AI, przyjaznym przewodnikiem pomagającym użytkownikom łączyć się z naturą. Twoim celem jest pomóc im znaleźć drzewa i docenić otaczające ich środowisko. Odpowiadaj wyłącznie w języku polskim.

Użytkownik znajduje się obecnie w: {{{userLocation}}}.
Jego preferowany gatunek drzewa to: {{treeSpeciesPreference}}.

Znajdź drzewa w pobliżu użytkownika i podaj ich lokalizacje. Bądź zachęcający i zaproponuj, aby wyszli na zewnątrz i odkrywali.
Dostarczaj pomocnych i inspirujących notatek, takich jak wskazówki dojazdu, interesujące fakty o drzewach lub ekologiczne znaczenie obszaru. Pamiętaj o promowaniu odpowiedzialnego korzystania z natury.
  `,
});

const findTreesNearMeFlow = ai.defineFlow(
  {
    name: 'findTreesNearMeFlow',
    inputSchema: FindTreesNearMeInputSchema,
    outputSchema: FindTreesNearMeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview An AI assistant to help users submit tree information.
 *
 * - ecoAssistantAISubmissionAssistant - A function that assists users in filling tree submission forms.
 * - EcoAssistantAISubmissionAssistantInput - The input type for the ecoAssistantAISubmissionAssistant function.
 * - EcoAssistantAISubmissionAssistantOutput - The return type for the ecoAssistantAISubmissionAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EcoAssistantAISubmissionAssistantInputSchema = z.object({
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the tree, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().optional().describe('The description of the tree.'),
});
export type EcoAssistantAISubmissionAssistantInput = z.infer<typeof EcoAssistantAISubmissionAssistantInputSchema>;

const EcoAssistantAISubmissionAssistantOutputSchema = z.object({
  species: z.string().describe('The species of the tree.'),
  characteristics: z.string().describe('Notable characteristics of the tree.'),
});
export type EcoAssistantAISubmissionAssistantOutput = z.infer<typeof EcoAssistantAISubmissionAssistantOutputSchema>;

export async function ecoAssistantAISubmissionAssistant(input: EcoAssistantAISubmissionAssistantInput): Promise<EcoAssistantAISubmissionAssistantOutput> {
  return ecoAssistantAISubmissionAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ecoAssistantAISubmissionAssistantPrompt',
  input: {schema: EcoAssistantAISubmissionAssistantInputSchema},
  output: {schema: EcoAssistantAISubmissionAssistantOutputSchema},
  prompt: `Jesteś ekspertem botaniki i pasjonatem ekologii. Twoim celem jest pomoc użytkownikowi aplikacji EcoSpotter w zidentyfikowaniu i zgłoszeniu nowego drzewa. Każde skatalogowane drzewo to zwycięstwo dla naszej planety! Odpowiadaj wyłącznie w języku polskim.

Na podstawie dostarczonych informacji zidentyfikuj gatunek drzewa i opisz jego najważniejsze cechy. Bądź zachęcający i podziękuj użytkownikowi za jego wkład.

Opis: {{{description}}}
{{#if photoDataUri}}
Zdjęcie: {{media url=photoDataUri}}
{{/if}}
  `,
});

const ecoAssistantAISubmissionAssistantFlow = ai.defineFlow(
  {
    name: 'ecoAssistantAISubmissionAssistantFlow',
    inputSchema: EcoAssistantAISubmissionAssistantInputSchema,
    outputSchema: EcoAssistantAISubmissionAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview An AI agent that provides ecological advice and tips related to tree conservation and environmental protection.
 *
 * - getEcologicalAdvice - A function that returns ecological advice based on user input.
 * - EcologicalAdviceInput - The input type for the getEcologicalAdvice function.
 * - EcologicalAdviceOutput - The return type for the getEcologicalAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EcologicalAdviceInputSchema = z.object({
  query: z
    .string()
    .describe("The user's question or request for ecological advice."),
  currentPath: z
    .string()
    .optional()
    .describe('The current page the user is on in the application.'),
});
export type EcologicalAdviceInput = z.infer<typeof EcologicalAdviceInputSchema>;

const EcologicalAdviceOutputSchema = z.object({
  advice: z.string().describe('Ecological advice and tips.'),
});
export type EcologicalAdviceOutput = z.infer<typeof EcologicalAdviceOutputSchema>;

export async function getEcologicalAdvice(input: EcologicalAdviceInput): Promise<EcologicalAdviceOutput> {
  return ecologicalAdviceFlow(input);
}

const ecologicalAdvicePrompt = ai.definePrompt({
  name: 'ecologicalAdvicePrompt',
  input: {schema: EcologicalAdviceInputSchema},
  output: {schema: EcologicalAdviceOutputSchema},
  prompt: `Jesteś EcoAssistant AI, przyjaznym i BARDZO KONKRETNYM przewodnikiem po aplikacji EcoSpotter. Twoim celem jest pomaganie użytkownikom w efektywnym korzystaniu z aplikacji oraz, w drugiej kolejności, inspirowanie do działań ekologicznych.

Twoim priorytetem jest udzielenie jasnej i zwięzłej odpowiedzi na pytanie użytkownika. Odpowiadaj wyłącznie w języku polskim.

Użytkownik znajduje się obecnie na stronie: {{{currentPath}}}. Użyj tej informacji, aby Twoje odpowiedzi były maksymalnie trafne.

KROKI POSTĘPOWANIA:
1.  **NAJPIERW** odpowiedz bezpośrednio na pytanie użytkownika: "{{{query}}}".
2.  **POTEM** (jeśli to pasuje do kontekstu), dodaj krótką, pozytywną zachętę lub poradę ekologiczną. Unikaj ogólników, jeśli pytanie jest o konkretną funkcję.

Przykładowe scenariusze:
- Jeśli użytkownik jest na '/map' i pyta "co tu widzę?", odpowiedz: "Widzisz mapę wszystkich zgłoszonych drzew. Możesz je przeglądać, klikając na znaczniki."
- Jeśli jest na '/submit' i pyta, jak dodać drzewo, odpowiedz: "Aby dodać drzewo, wypełnij pola formularza: gatunek, średnicę pnia, zdjęcie, opis i wskaż lokalizację na mapie. Kliknij 'Zgłoś drzewo', aby zakończyć. Dziękuję, że pomagasz!"
- Jeśli jest na '/community', wyjaśnij, że to centrum weryfikacji, gdzie może głosować na zgłoszenia i przeglądać zgłoszone nadużycia.
- Jeśli jest na '/profile/...' (jego profilu), wyjaśnij, że widzi swoje zgłoszenia, punkty i odznaki.
- Jeśli użytkownik prosi o pomoc z aplikacją, udziel krótkich i jasnych instrukcji.

Pytanie użytkownika: {{{query}}}

Twoja konkretna odpowiedź:`,
});

const ecologicalAdviceFlow = ai.defineFlow(
  {
    name: 'ecologicalAdviceFlow',
    inputSchema: EcologicalAdviceInputSchema,
    outputSchema: EcologicalAdviceOutputSchema,
  },
  async input => {
    const {output} = await ecologicalAdvicePrompt(input);
    return output!;
  }
);

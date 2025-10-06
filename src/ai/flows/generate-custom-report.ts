'use server';

/**
 * @fileOverview AI-powered report generation flow.
 *
 * - generateCustomReport - A function that generates custom reports based on user criteria.
 * - GenerateCustomReportInput - The input type for the generateCustomReport function.
 * - GenerateCustomReportOutput - The return type for the generateCustomReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCustomReportInputSchema = z.object({
  criteria: z
    .string()
    .describe('Specific criteria for the report, such as financial health, student attendance, or academic achievements.'),
  timeframe: z.string().describe('The timeframe for the report (e.g., last month, last year, specific dates).'),
  additionalDetails: z
    .string()
    .optional()
    .describe('Any additional details or specific requirements for the report.'),
});
export type GenerateCustomReportInput = z.infer<typeof GenerateCustomReportInputSchema>;

const GenerateCustomReportOutputSchema = z.object({
  reportTitle: z.string().describe('The title of the generated report.'),
  reportSummary: z.string().describe('A summary of the key insights from the report.'),
  reportDetails: z.string().describe('Detailed information and data included in the report.'),
});
export type GenerateCustomReportOutput = z.infer<typeof GenerateCustomReportOutputSchema>;

export async function generateCustomReport(input: GenerateCustomReportInput): Promise<GenerateCustomReportOutput> {
  return generateCustomReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCustomReportPrompt',
  input: {schema: GenerateCustomReportInputSchema},
  output: {schema: GenerateCustomReportOutputSchema},
  prompt: `You are an AI-powered report generation tool for a school administration. Your goal is to create comprehensive reports based on specific criteria and timeframes provided by the admin.

  Criteria: {{{criteria}}}
  Timeframe: {{{timeframe}}}
  Additional Details: {{{additionalDetails}}}

  Based on the given criteria, timeframe, and any additional details, generate a report with a title, a summary of key insights, and detailed information.
  The reportTitle should be concise and descriptive.
  The reportSummary should highlight the most important findings and trends.
  The reportDetails should provide comprehensive data and analysis to support the summary.

  Ensure the report is well-structured and easy to understand.

  The output should be in a JSON format, following the GenerateCustomReportOutputSchema.
  `,
});

const generateCustomReportFlow = ai.defineFlow(
  {
    name: 'generateCustomReportFlow',
    inputSchema: GenerateCustomReportInputSchema,
    outputSchema: GenerateCustomReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

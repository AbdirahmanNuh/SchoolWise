"use server";

import {
  generateCustomReport,
  type GenerateCustomReportInput,
  type GenerateCustomReportOutput,
} from "@/ai/flows/generate-custom-report";

export async function generateReportAction(
  input: GenerateCustomReportInput
): Promise<GenerateCustomReportOutput> {
  try {
    const output = await generateCustomReport(input);
    return output;
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("Failed to generate report. Please try again.");
  }
}

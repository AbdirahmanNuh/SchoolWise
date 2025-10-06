"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateReportAction } from "./actions";
import type { GenerateCustomReportOutput } from "@/ai/flows/generate-custom-report";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  criteria: z.string().min(1, "Criteria is required."),
  timeframe: z.string().min(1, "Timeframe is required."),
  additionalDetails: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ReportForm() {
  const [report, setReport] = useState<GenerateCustomReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      criteria: "Financial health",
      timeframe: "Last school year",
      additionalDetails: "Include a comparison with the previous year.",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setReport(null);
    try {
      const result = await generateReportAction(values);
      setReport(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Report Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="criteria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Criteria</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Financial health, student attendance"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeframe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeframe</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Last quarter, 2023-2024 school year"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additionalDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Focus on grade 10, compare with previous year"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? "Generating..." : "Generate Report"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {isLoading && (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        )}
        {report && (
          <Card>
            <CardHeader>
              <CardTitle>{report.reportTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 font-headline">
                  Summary
                </h3>
                <p className="text-muted-foreground">{report.reportSummary}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 font-headline">
                  Details
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {report.reportDetails}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

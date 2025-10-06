"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

const chartData = [
  { category: "Tuition", amount: 50 },
  { category: "Fees", amount: 70 },
  { category: "Grants", amount: 60 },
  { category: "Other", amount: 40 },
];

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function ExpenseChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Current Year</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-foreground">$80,000</p>
            <p className="text-sm font-medium text-destructive">-5%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48 pt-4">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="amount" fill="var(--color-amount)" radius={8} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

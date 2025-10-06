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
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

const chartData = [
  { month: "January", revenue: 10900 },
  { month: "February", revenue: 2100 },
  { month: "March", revenue: 4100 },
  { month: "April", revenue: 9300 },
  { month: "May", revenue: 3300 },
  { month: "June", revenue: 10100 },
  { month: "July", revenue: 6100 },
  { month: "August", revenue: 4500 },
  { month: "September", revenue: 12100 },
  { month: "October", revenue: 14900 },
  { month: "November", revenue: 1000 },
  { month: "December", revenue: 8100 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Last 12 Months</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-foreground">$120,000</p>
            <p className="text-sm font-medium text-success">+15%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="revenue"
                type="natural"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                strokeWidth={3}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { axios } from "@/lib/axios";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const chartConfig = {
  revenue: {
    label: "Revenue",
  },
  subscription: {
    label: "Subscription",
    color: "hsl(var(--chart-1))",
  },
  advertisement: {
    label: "Advertisement",
    color: "hsl(var(--chart-2))",
  },
  merchandise: {
    label: "Merchandise",
    color: "hsl(var(--chart-3))",
  },
  licensing: {
    label: "Licensing",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

interface RevenueChartProps {
  className?: string;
}

function RevenueChartUI({ className }: RevenueChartProps) {
  const { dateRange } = useStore();

  const { data: revenueChartData } = useSuspenseQuery<{
    totalRevenue: number;
    revenueBySource: {
      source: string;
      revenue: number;
      fill: string;
    }[];
  }>({
    queryKey: ["revenue", dateRange],
    queryFn: async () => {
      const response = await axios.get("/overview/revenue", {
        params: {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        },
      });

      return response.data;
    },
  });

  return (
    <Card className={cn("w-full flex flex-col", className)}>
      <CardHeader className="items-start pb-0">
        <CardTitle>Revenue Distribution</CardTitle>
        <CardDescription>
          {`${format(dateRange.from, "MMMM yyyy")} - ${format(
            dateRange.to,
            "MMMM yyyy"
          )}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[350px] w-full h-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={revenueChartData.revenueBySource}
              dataKey="revenue"
              nameKey="source"
              innerRadius={65}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {revenueChartData.totalRevenue}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Revenue
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function RevenueChartFallback({ className }: RevenueChartProps) {
  return (
    <Card className={cn("w-full flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-transparent bg-slate-200 rounded w-fit animate-pulse">
          Revenue Distribution
        </CardTitle>
        <CardDescription className="text-transparent bg-slate-200 rounded w-fit animate-pulse">
          January - June 2024
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="bg-slate-200 rounded-md animate-pulse"
        >
          <></>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function RevenueChart({ className }: RevenueChartProps) {
  return (
    <React.Suspense fallback={<RevenueChartFallback className={className} />}>
      <RevenueChartUI className={className} />
    </React.Suspense>
  );
}

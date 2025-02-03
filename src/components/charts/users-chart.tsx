import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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
import { Suspense } from "react";

const chartConfig = {
  total: {
    label: "Total Users",
    color: "hsl(var(--chart-1))",
  },
  active: {
    label: "Active Users",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface UsersChartProps {
  className?: string;
}

function UsersChartUI({ className }: UsersChartProps) {
  const { dateRange } = useStore();

  const { data: chartData } = useSuspenseQuery<
    {
      date: string;
      total: number;
      active: number;
    }[]
  >({
    queryKey: ["user-growth", dateRange],
    queryFn: async () => {
      const response = await axios.get("/overview/user-growth", {
        params: {
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        },
      });

      return response.data;
    },
  });

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>User Growth Chart</CardTitle>
        <CardDescription>
          {`${format(dateRange.from, "MMMM yyyy")} - ${format(
            dateRange.to,
            "MMMM yyyy"
          )}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="total"
              type="monotone"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="active"
              type="monotone"
              stroke="var(--color-active)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function UsersChartFallback({ className }: UsersChartProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-transparent bg-slate-200 rounded w-fit animate-pulse">
          User Growth Chart
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

export function UsersChart({ className }: UsersChartProps) {
  return (
    <Suspense fallback={<UsersChartFallback className={className} />}>
      <UsersChartUI className={className} />
    </Suspense>
  );
}

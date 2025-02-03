import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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
  count: {
    label: "Playbacks",
    color: "hsl(var(--chart-1))",
  },
  name: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

interface TopStreamsChartProps {
  className?: string;
}

function TopStreamsChartUI({ className }: TopStreamsChartProps) {
  const { dateRange } = useStore();

  const { data: streamsChartData } = useSuspenseQuery<
    {
      name: string;
      count: number;
    }[]
  >({
    queryKey: ["top-streams", dateRange],
    queryFn: async () => {
      const response = await axios.get("/overview/top-streams", {
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
        <CardTitle>Top Streams</CardTitle>
        <CardDescription>
          {`${format(dateRange.from, "MMMM yyyy")} - ${format(
            dateRange.to,
            "MMMM yyyy"
          )}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={streamsChartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--color-count)"
              radius={4}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-[--color-name]"
                fontSize={12}
              />
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function TopStreamsChartFallback({ className }: TopStreamsChartProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-transparent bg-slate-200 rounded w-fit animate-pulse">
          Top Streams
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

export function TopStreamsChart({ className }: TopStreamsChartProps) {
  return (
    <Suspense fallback={<TopStreamsChartFallback className={className} />}>
      <TopStreamsChartUI className={className} />
    </Suspense>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axios } from "@/lib/axios";
import { useStore } from "@/lib/store";
import { MetricesAPIResponse } from "@/types/api-response";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DollarSign, Headphones, Music, TrendingUp, Users } from "lucide-react";
import { useMemo } from "react";

export const MetricsCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-transparent bg-slate-300 animate-pulse rounded">
          Total Users
        </CardTitle>
        <div className="p-1 text-transparent bg-slate-300 animate-pulse rounded-full">
          <Users className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-transparent bg-slate-300 animate-pulse rounded">
          1,234,567
        </div>
        <p className="text-xs mt-0.5 text-transparent bg-slate-300 animate-pulse rounded">
          Registered users
        </p>
      </CardContent>
    </Card>
  );
};

type MetricsCardProps = {
  title: string;
  icon: keyof typeof iconsMap;
  value: string;
  description: string;
};

const iconsMap = {
  users: Users,
  headphones: Headphones,
  music: Music,
  "dollar-sign": DollarSign,
  "trending-up": TrendingUp,
};

export const MetricsCard = ({
  title,
  icon,
  value,
  description,
}: MetricsCardProps) => {
  const Icon = useMemo(() => iconsMap[icon], [icon]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-1 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs mt-0.5 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export const MetricsList = () => {
  const { dateRange } = useStore();

  const { data: metrices } = useSuspenseQuery<MetricesAPIResponse>({
    queryKey: ["metrices", dateRange],
    queryFn: async () => {
      const response = await axios.get("/overview/metrices", {
        params: {
          startDate: dateRange.from,
          endDate: dateRange.to,
        },
      });
      return response.data;
    },
  });

  return (
    <>
      {metrices.map((metric) => (
        <MetricsCard
          key={metric.title}
          title={metric.title}
          icon={metric.icon as keyof typeof iconsMap}
          value={metric.value}
          description={metric.description}
        />
      ))}
    </>
  );
};

export const MetricsListSkeleton = () => {
  return Array.from({ length: 5 }).map((_, index) => (
    <MetricsCardSkeleton key={index} />
  ));
};

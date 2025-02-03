import { AppSidebar } from "@/components/app-sidebar";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { TopStreamsChart } from "@/components/charts/top-streams-chart";
import { UsersChart } from "@/components/charts/users-chart";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { MetricsList, MetricsListSkeleton } from "@/components/metrices";
import { StreamsTable } from "@/components/streams-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useStore } from "@/lib/store";
import { Suspense } from "react";

export default function Page() {
  const { dateRange, setDateRange } = useStore();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 sticky top-0 z-30 bg-background border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    Overview
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
            <CalendarDateRangePicker
              date={dateRange}
              setDate={(range) => setDateRange(range)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <Suspense fallback={<MetricsListSkeleton />}>
              <MetricsList />
            </Suspense>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <UsersChart />
            <RevenueChart />
            <TopStreamsChart />
          </div>
          <div className="grid grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Recent Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <StreamsTable />
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

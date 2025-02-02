import { AppSidebar } from "@/components/app-sidebar";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { TopStreamsChart } from "@/components/charts/top-streams-chart";
import { UsersChart } from "@/components/charts/users-chart";
import { DataTable } from "@/components/data-table";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
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
import { ColumnDef } from "@tanstack/react-table";
import { Users } from "lucide-react";
import { useEffect } from "react";

const API_BASE_URL = "https://mock.example.com/api";

const MetricsCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">1,234,567</div>
        <p className="text-xs text-muted-foreground">Registered users</p>
      </CardContent>
    </Card>
  );
};

type Stream = {
  id: string;
  name: string;
  artist: string;
  date: string;
  count: number;
  userId: string;
};

const TopStreamsTable = () => {
  const columns: ColumnDef<Stream>[] = [
    {
      header: "Song Name",
      accessorKey: "name",
    },
    {
      header: "Artist",
      accessorKey: "artist",
    },
    {
      header: "Date Streamed",
      accessorKey: "date",
    },
    {
      header: "Stream Count",
      accessorKey: "count",
    },
    {
      header: "User ID",
      accessorKey: "userId",
    },
  ];

  const data: Stream[] = [
    {
      id: "1",
      name: "Stream 1",
      artist: "Artist 1",
      date: "2024-01-01",
      count: 100,
      userId: "1",
    },
    {
      id: "2",
      name: "Stream 2",
      artist: "Artist 2",
      date: "2024-01-02",
      count: 200,
      userId: "2",
    },
    {
      id: "3",
      name: "Stream 3",
      artist: "Artist 3",
      date: "2024-01-03",
      count: 300,
      userId: "3",
    },
    {
      id: "4",
      name: "Stream 4",
      artist: "Artist 4",
      date: "2024-01-04",
      count: 400,
      userId: "4",
    },
    {
      id: "5",
      name: "Stream 5",
      artist: "Artist 5",
      date: "2024-01-05",
      count: 500,
      userId: "5",
    },
    {
      id: "6",
      name: "Stream 6",
      artist: "Artist 6",
      date: "2024-01-06",
      count: 600,
      userId: "6",
    },
    {
      id: "7",
      name: "Stream 7",
      artist: "Artist 7",
      date: "2024-01-07",
      count: 700,
      userId: "7",
    },
    {
      id: "8",
      name: "Stream 8",
      artist: "Artist 8",
      date: "2024-01-08",
      count: 800,
      userId: "8",
    },
    {
      id: "9",
      name: "Stream 9",
      artist: "Artist 9",
      date: "2024-01-09",
      count: 900,
      userId: "9",
    },
    {
      id: "10",
      name: "Stream 10",
      artist: "Artist 10",
      date: "2024-01-10",
      count: 1000,
      userId: "10",
    },
  ];

  return <DataTable columns={columns} data={data} />;
};

export default function Page() {
  useEffect(() => {
    fetch(
      `${API_BASE_URL}/overview/metrices?startDate=2024-01-01&endDate=2025-02-02`
    )
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

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
          <div className="ml-auto px-3">{/* TODO: Add User Avatar */}</div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
            <CalendarDateRangePicker />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <MetricsCard />
            <MetricsCard />
            <MetricsCard />
            <MetricsCard />
            <MetricsCard />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <UsersChart className="col-span-2" />
            <RevenueChart className="col-span-2" />
            <TopStreamsChart className="col-span-2" />
          </div>
          <div className="grid grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Top Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <TopStreamsTable />
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

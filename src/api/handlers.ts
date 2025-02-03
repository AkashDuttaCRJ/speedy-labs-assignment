import { MetricesAPIResponse } from "@/types/api-response";
import { http, HttpResponse } from "msw";
import activeUsersJson from "./data/active_users.json";
import streamsJson from "./data/streams.json";
import topArtistsJson from "./data/top_artists.json";
import totalRevenuesJson from "./data/total_revenues.json";
import totalStreamsJson from "./data/total_streams.json";
import totalUsersJson from "./data/total_users.json";

const BASE_URL = "https://mock.example.com/api";

const filterByDateRange = <T extends { date: string }>(
  data: T[],
  startDate: string,
  endDate: string
) => {
  return data.filter((entry) => {
    const date = new Date(entry.date);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    return date >= startDateObj && date <= endDateObj;
  });
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const handlers = [
  http.get(`${BASE_URL}/overview/metrices`, async ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    if (!startDate || !endDate) {
      return new HttpResponse(null, { status: 400 });
    }

    const totalUsers = filterByDateRange(
      totalUsersJson,
      startDate,
      endDate
    ).reduce((acc, curr) => acc + curr.count, 0);

    const activeUsers = filterByDateRange(
      activeUsersJson,
      startDate,
      endDate
    ).reduce((acc, curr) => acc + curr.count, 0);

    const totalStreams = filterByDateRange(
      totalStreamsJson,
      startDate,
      endDate
    ).reduce((acc, curr) => acc + curr.count, 0);

    const totalRevenues = filterByDateRange(
      totalRevenuesJson,
      startDate,
      endDate
    ).reduce((acc, curr) => acc + curr.revenue, 0);

    const topArtistsMap = filterByDateRange(
      topArtistsJson,
      startDate,
      endDate
    ).reduce((acc, curr) => {
      acc[curr.artist] = {
        playbacks: (acc[curr.artist]?.playbacks || 0) + curr.playbacks,
        count: (acc[curr.artist]?.count || 0) + 1,
      };
      return acc;
    }, {} as Record<string, { playbacks: number; count: number }>);

    const topArtist = { artist: "", playbacks: 0, count: 0 };

    for (const [artist, data] of Object.entries(topArtistsMap)) {
      if (data.count > topArtist.count) {
        topArtist.artist = artist;
        topArtist.playbacks = data.playbacks;
        topArtist.count = data.count;
      }
    }

    await delay(2000);

    return HttpResponse.json([
      {
        title: "Total Users",
        icon: "users",
        value: Intl.NumberFormat("en-US", {
          notation: "compact",
          compactDisplay: "short",
          maximumFractionDigits: 1,
        }).format(totalUsers),
        description: "registered users",
      },
      {
        title: "Active Users",
        icon: "headphones",
        value: Intl.NumberFormat("en-US", {
          notation: "compact",
          compactDisplay: "short",
          maximumFractionDigits: 1,
        }).format(activeUsers),
        description: "users are active with atleast one stream",
      },
      {
        title: "Total Streams",
        icon: "music",
        value: Intl.NumberFormat("en-US", {
          notation: "compact",
          compactDisplay: "short",
          maximumFractionDigits: 2,
        }).format(totalStreams),
        description: "songs were streamed",
      },
      {
        title: "Total Revenues",
        icon: "dollar-sign",
        value: Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
          compactDisplay: "short",
          maximumFractionDigits: 2,
        }).format(totalRevenues),
        description: "revenues from multiple sources",
      },
      {
        title: "Top Artist",
        icon: "trending-up",
        value: topArtist.artist,
        description: `with ${Intl.NumberFormat("en-US", {
          notation: "compact",
          compactDisplay: "short",
          maximumFractionDigits: 0,
        }).format(topArtist.playbacks)} playbacks`,
      },
    ] satisfies MetricesAPIResponse);
  }),
  http.get(`${BASE_URL}/overview/user-growth`, async ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    if (!startDate || !endDate) {
      return new HttpResponse(null, { status: 400 });
    }

    const totalUsers = filterByDateRange(totalUsersJson, startDate, endDate);

    const activeUsers = filterByDateRange(activeUsersJson, startDate, endDate);

    const mergedUsers = totalUsers.map((user, index) => ({
      date: user.date,
      total: user.count,
      active: activeUsers[index].count,
    }));

    await delay(2000);

    return HttpResponse.json(mergedUsers);
  }),
  http.get(`${BASE_URL}/overview/revenue`, async ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    if (!startDate || !endDate) {
      return new HttpResponse(null, { status: 400 });
    }

    const filteredRevenue = filterByDateRange(
      totalRevenuesJson,
      startDate,
      endDate
    );

    const totalRevenue = filteredRevenue.reduce(
      (acc, curr) => acc + curr.revenue,
      0
    );
    const revenueBySource = filteredRevenue.reduce((acc, curr) => {
      acc[curr.source] = (acc[curr.source] || 0) + curr.revenue;
      return acc;
    }, {} as Record<string, number>);

    await delay(2000);

    return HttpResponse.json({
      totalRevenue,
      revenueBySource: Object.entries(revenueBySource).map(
        ([source, revenue]) => ({
          source,
          revenue,
          fill: `var(--color-${source})`,
        })
      ),
    });
  }),
  http.get(`${BASE_URL}/overview/top-streams`, async ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    if (!startDate || !endDate) {
      return new HttpResponse(null, { status: 400 });
    }

    const filteredStreams = filterByDateRange(streamsJson, startDate, endDate);

    const streamsMap = filteredStreams.reduce((acc, curr) => {
      acc[curr.name] = (acc[curr.name] || 0) + curr.count;
      return acc;
    }, {} as Record<string, number>);

    const sortedStreams = Object.entries(streamsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .reduce((acc, [name, count]) => {
        acc.push({ name, count });
        return acc;
      }, [] as { name: string; count: number }[]);

    await delay(2000);

    return HttpResponse.json(sortedStreams);
  }),
  http.get(`${BASE_URL}/overview/streams`, async ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const page = url.searchParams.get("page") ?? "0";
    const limit = url.searchParams.get("limit") ?? "10";

    if (!startDate || !endDate) {
      return new HttpResponse(null, { status: 400 });
    }

    if (isNaN(Number(page)) || isNaN(Number(limit))) {
      return new HttpResponse(null, { status: 400 });
    }

    if (Number(page) < 0 || Number(limit) < 1) {
      return new HttpResponse(null, { status: 400 });
    }

    const filteredStreams = filterByDateRange(streamsJson, startDate, endDate);

    await delay(2000);

    return HttpResponse.json({
      total: filteredStreams.length,
      streams: filteredStreams.slice(
        Number(page) * Number(limit),
        (Number(page) + 1) * Number(limit)
      ),
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(filteredStreams.length / Number(limit)),
    });
  }),
];

export default handlers;

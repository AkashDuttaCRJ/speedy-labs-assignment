import { http, HttpResponse } from "msw";
import activeUsersJson from "./data/active_users.json";
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

    return HttpResponse.json({
      totalUsers,
      activeUsers,
      totalStreams,
      totalRevenues,
      topArtist,
    });
  }),
];

export default handlers;

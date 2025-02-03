import { Stream } from "@/types/client";

export type MetricesAPIResponse = {
  title: string;
  icon: string;
  value: string;
  description: string;
}[];

export type StreamsAPIResponse = {
  total: number;
  streams: Stream[];
  page: number;
  limit: number;
  totalPages: number;
};

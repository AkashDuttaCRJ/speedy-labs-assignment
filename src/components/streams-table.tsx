import { DataTable } from "@/components/data-table";
import { axios } from "@/lib/axios";
import { useStore } from "@/lib/store";
import { StreamsAPIResponse } from "@/types/api-response";
import { Stream } from "@/types/client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

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

export const StreamsTable = () => {
  const { dateRange } = useStore();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["streams", pagination, dateRange],
    queryFn: async () => {
      const response = await axios.get<StreamsAPIResponse>(
        "/overview/streams",
        {
          params: {
            startDate: dateRange.from,
            endDate: dateRange.to,
            page: pagination.pageIndex,
            limit: pagination.pageSize,
          },
        }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  return (
    <DataTable
      columns={columns}
      data={data?.streams ?? []}
      isLoading={isLoading}
      pagination={{
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        total: data?.total ?? 0,
        onPageChange: setPagination,
      }}
    />
  );
};

import { subDays } from "date-fns";
import { create } from "zustand";

type Store = {
  dateRange: { from: Date; to: Date };
  setDateRange: (dateRange: { from: Date; to: Date }) => void;
};

export const useStore = create<Store>()((set) => ({
  dateRange: { from: subDays(new Date(), 30), to: new Date() },
  setDateRange: (dateRange) => set({ dateRange }),
}));

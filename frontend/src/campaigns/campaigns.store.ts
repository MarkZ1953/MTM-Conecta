import { persist } from "zustand/middleware";
import { create } from "zustand";

import {
  type DataTableFilterMeta,
  type SortingState,
} from "@/components/ui/ui-datatable";

type SetState<T> = (value: T | ((prev: T) => T)) => void;

type CampaignsStore = {
  filters: DataTableFilterMeta;
  setFilters: SetState<DataTableFilterMeta>;

  sorting: SortingState;
  setSorting: SetState<SortingState>;

  pageIndex: number;
  setPageIndex: SetState<number>;

  pageSize: number;
  setPageSize: SetState<number>;

  refresh: boolean;
  setRefresh: SetState<boolean>;
};

export const useCampaignsStore = create<
  CampaignsStore,
  [["zustand/persist", CampaignsStore]]
>(
  persist<CampaignsStore>(
    (set) => ({
      filters: {},
      setFilters: (value) =>
        set((state) => ({
          filters: typeof value === "function" ? value(state.filters) : value,
        })),

      sorting: [] as SortingState,
      setSorting: (value) =>
        set((state) => ({
          sorting: typeof value === "function" ? value(state.sorting) : value,
        })),

      pageIndex: 0,
      setPageIndex: (value) =>
        set((state) => ({
          pageIndex: typeof value === "function" ? value(state.pageIndex) : value,
        })),

      pageSize: 10,
      setPageSize: (value) =>
        set((state) => ({
          pageSize: typeof value === "function" ? value(state.pageSize) : value,
        })),

      refresh: false,
      setRefresh: (value) =>
        set((state) => ({
          refresh: typeof value === "function" ? value(state.refresh) : value,
        })),
    }),
    { name: "campaigns-storage" },
  ),
);

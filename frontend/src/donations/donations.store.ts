import { persist } from "zustand/middleware";
import { create } from "zustand";

import {
  type DataTableFilterMeta,
  type SortingState,
} from "@/components/ui/ui-datatable";

type SetState<T> = (value: T | ((prev: T) => T)) => void;

type DonationsStore = {
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

export const useDonationsStore = create<
  DonationsStore,
  [["zustand/persist", DonationsStore]]
>(
  persist<DonationsStore>(
    (set) => ({
      filters: {},
      setFilters: (
        value:
          | DataTableFilterMeta
          | ((prev: DataTableFilterMeta) => DataTableFilterMeta),
      ) =>
        set((state: DonationsStore) => ({
          filters:
            typeof value === "function" ? value(state.filters) : value,
        })),

      sorting: [] as SortingState,
      setSorting: (
        value: SortingState | ((prev: SortingState) => SortingState),
      ) =>
        set((state: DonationsStore) => ({
          sorting: typeof value === "function" ? value(state.sorting) : value,
        })),

      pageIndex: 0,
      setPageIndex: (value: number | ((prev: number) => number)) =>
        set((state: DonationsStore) => ({
          pageIndex:
            typeof value === "function" ? value(state.pageIndex) : value,
        })),

      pageSize: 10,
      setPageSize: (value: number | ((prev: number) => number)) =>
        set((state: DonationsStore) => ({
          pageSize: typeof value === "function" ? value(state.pageSize) : value,
        })),

      refresh: false,
      setRefresh: (value: boolean | ((prev: boolean) => boolean)) =>
        set((state: DonationsStore) => ({
          refresh: typeof value === "function" ? value(state.refresh) : value,
        })),
    }),
    { name: "donations-storage" },
  ),
);

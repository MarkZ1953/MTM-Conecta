import { persist } from "zustand/middleware";
import { create } from "zustand";

import {
  type DataTableFilterMeta,
  type SortingState,
} from "@/components/ui/ui-datatable";

type SetState<T> = (value: T | ((prev: T) => T)) => void;

type AttendanceStore = {
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

export const useAttendanceStore = create<
  AttendanceStore,
  [["zustand/persist", AttendanceStore]]
>(
  persist<AttendanceStore>(
    (set) => ({
      filters: {},
      setFilters: (
        value:
          | DataTableFilterMeta
          | ((prev: DataTableFilterMeta) => DataTableFilterMeta),
      ) =>
        set((state: AttendanceStore) => ({
          filters:
            typeof value === "function" ? value(state.filters) : value,
        })),

      sorting: [] as SortingState,
      setSorting: (
        value: SortingState | ((prev: SortingState) => SortingState),
      ) =>
        set((state: AttendanceStore) => ({
          sorting: typeof value === "function" ? value(state.sorting) : value,
        })),

      pageIndex: 0,
      setPageIndex: (value: number | ((prev: number) => number)) =>
        set((state: AttendanceStore) => ({
          pageIndex:
            typeof value === "function" ? value(state.pageIndex) : value,
        })),

      pageSize: 10,
      setPageSize: (value: number | ((prev: number) => number)) =>
        set((state: AttendanceStore) => ({
          pageSize: typeof value === "function" ? value(state.pageSize) : value,
        })),

      refresh: false,
      setRefresh: (value: boolean | ((prev: boolean) => boolean)) =>
        set((state: AttendanceStore) => ({
          refresh: typeof value === "function" ? value(state.refresh) : value,
        })),
    }),
    { name: "attendance-storage" },
  ),
);

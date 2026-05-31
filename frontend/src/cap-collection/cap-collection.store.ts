import { persist } from "zustand/middleware";
import { create } from "zustand";

import {
  type DataTableFilterMeta,
  type SortingState,
} from "@/components/ui/ui-datatable";

type SetState<T> = (value: T | ((prev: T) => T)) => void;

// ── Companies Store ────────────────────────────────────────

type CompaniesStore = {
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

export const useCompaniesStore = create<
  CompaniesStore,
  [["zustand/persist", CompaniesStore]]
>(
  persist<CompaniesStore>(
    (set) => ({
      filters: {},
      setFilters: (
        value:
          | DataTableFilterMeta
          | ((prev: DataTableFilterMeta) => DataTableFilterMeta),
      ) =>
        set((state: CompaniesStore) => ({
          filters:
            typeof value === "function" ? value(state.filters) : value,
        })),

      sorting: [] as SortingState,
      setSorting: (
        value: SortingState | ((prev: SortingState) => SortingState),
      ) =>
        set((state: CompaniesStore) => ({
          sorting: typeof value === "function" ? value(state.sorting) : value,
        })),

      pageIndex: 0,
      setPageIndex: (value: number | ((prev: number) => number)) =>
        set((state: CompaniesStore) => ({
          pageIndex:
            typeof value === "function" ? value(state.pageIndex) : value,
        })),

      pageSize: 10,
      setPageSize: (value: number | ((prev: number) => number)) =>
        set((state: CompaniesStore) => ({
          pageSize: typeof value === "function" ? value(state.pageSize) : value,
        })),

      refresh: false,
      setRefresh: (value: boolean | ((prev: boolean) => boolean)) =>
        set((state: CompaniesStore) => ({
          refresh: typeof value === "function" ? value(state.refresh) : value,
        })),
    }),
    { name: "companies-storage" },
  ),
);

// ── Collection Points Store ────────────────────────────────

type CollectionPointsStore = {
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

export const useCollectionPointsStore = create<
  CollectionPointsStore,
  [["zustand/persist", CollectionPointsStore]]
>(
  persist<CollectionPointsStore>(
    (set) => ({
      filters: {},
      setFilters: (
        value:
          | DataTableFilterMeta
          | ((prev: DataTableFilterMeta) => DataTableFilterMeta),
      ) =>
        set((state: CollectionPointsStore) => ({
          filters:
            typeof value === "function" ? value(state.filters) : value,
        })),

      sorting: [] as SortingState,
      setSorting: (
        value: SortingState | ((prev: SortingState) => SortingState),
      ) =>
        set((state: CollectionPointsStore) => ({
          sorting: typeof value === "function" ? value(state.sorting) : value,
        })),

      pageIndex: 0,
      setPageIndex: (value: number | ((prev: number) => number)) =>
        set((state: CollectionPointsStore) => ({
          pageIndex:
            typeof value === "function" ? value(state.pageIndex) : value,
        })),

      pageSize: 10,
      setPageSize: (value: number | ((prev: number) => number)) =>
        set((state: CollectionPointsStore) => ({
          pageSize: typeof value === "function" ? value(state.pageSize) : value,
        })),

      refresh: false,
      setRefresh: (value: boolean | ((prev: boolean) => boolean)) =>
        set((state: CollectionPointsStore) => ({
          refresh: typeof value === "function" ? value(state.refresh) : value,
        })),
    }),
    { name: "collection-points-storage" },
  ),
);

// ── Collection Requests Store ──────────────────────────────

type CollectionRequestsStore = {
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

export const useCollectionRequestsStore = create<
  CollectionRequestsStore,
  [["zustand/persist", CollectionRequestsStore]]
>(
  persist<CollectionRequestsStore>(
    (set) => ({
      filters: {},
      setFilters: (
        value:
          | DataTableFilterMeta
          | ((prev: DataTableFilterMeta) => DataTableFilterMeta),
      ) =>
        set((state: CollectionRequestsStore) => ({
          filters:
            typeof value === "function" ? value(state.filters) : value,
        })),

      sorting: [] as SortingState,
      setSorting: (
        value: SortingState | ((prev: SortingState) => SortingState),
      ) =>
        set((state: CollectionRequestsStore) => ({
          sorting: typeof value === "function" ? value(state.sorting) : value,
        })),

      pageIndex: 0,
      setPageIndex: (value: number | ((prev: number) => number)) =>
        set((state: CollectionRequestsStore) => ({
          pageIndex:
            typeof value === "function" ? value(state.pageIndex) : value,
        })),

      pageSize: 10,
      setPageSize: (value: number | ((prev: number) => number)) =>
        set((state: CollectionRequestsStore) => ({
          pageSize: typeof value === "function" ? value(state.pageSize) : value,
        })),

      refresh: false,
      setRefresh: (value: boolean | ((prev: boolean) => boolean)) =>
        set((state: CollectionRequestsStore) => ({
          refresh: typeof value === "function" ? value(state.refresh) : value,
        })),
    }),
    { name: "collection-requests-storage" },
  ),
);

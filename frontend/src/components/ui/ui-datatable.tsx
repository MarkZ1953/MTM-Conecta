import React, { useMemo, useState } from "react";
import { DataTable as PrimeDataTable, type DataTablePageEvent, type DataTableSortEvent, type DataTableFilterMeta, type DataTableFilterEvent } from "primereact/datatable";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Column, type ColumnFilterElementTemplateOptions, type ColumnFilterApplyTemplateOptions, type ColumnFilterClearTemplateOptions } from "primereact/column";
import { Button } from "primereact/button";

// Re-exportamos los tipos de PrimeReact para que puedan ser usados en otros archivos
export type { DataTableFilterMeta, ColumnFilterElementTemplateOptions, ColumnFilterApplyTemplateOptions, ColumnFilterClearTemplateOptions };
export { FilterMatchMode, FilterOperator };

// Types mapping from TanStack to PrimeReact
export type ColumnDef<TData = any> = {
  id?: string;
  accessorKey?: string;
  header: React.ReactNode;
  cell?: (info: { row: { original: TData } }) => React.ReactNode;
  enableSorting?: boolean;

  // -- Propiedades avanzadas de filtros de PrimeReact --
  filter?: boolean;
  filterField?: string;
  filterElement?: (options: ColumnFilterElementTemplateOptions) => React.ReactNode;
  dataType?: "text" | "numeric" | "date" | "boolean";
  showFilterMatchModes?: boolean;
  filterMenuStyle?: React.CSSProperties;
  filterClear?: (options: ColumnFilterClearTemplateOptions) => React.ReactNode;
  filterApply?: (options: ColumnFilterApplyTemplateOptions) => React.ReactNode;
  filterFooter?: (options: any) => React.ReactNode;
  filterPlaceholder?: string;

  meta?: any;
};

export type SortingState = { id: string; desc: boolean }[];

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];

  pageIndex: number;
  pageSize: number;
  totalCount: number;
  onPageSizeChange: React.Dispatch<React.SetStateAction<number>> | ((size: number) => void);

  columnVisibility?: Record<string, boolean>;
  onColumnVisibilityChange?: React.Dispatch<React.SetStateAction<Record<string, boolean>>> | ((vis: Record<string, boolean>) => void);

  sorting: SortingState;
  onSortingChange: React.Dispatch<React.SetStateAction<SortingState>> | ((sort: SortingState) => void);

  filters?: DataTableFilterMeta;
  onFilter?: React.Dispatch<React.SetStateAction<DataTableFilterMeta>> | ((filters: DataTableFilterMeta) => void);

  globalFilterFields?: string[];
  header?: React.ReactNode;

  onPageChange: (page: number) => void;

  renderToolbar?: (table: any) => React.ReactNode;

  rowSelection?: Record<string, boolean>;
  setRowSelection?: React.Dispatch<React.SetStateAction<Record<string, boolean>>> | ((sel: Record<string, boolean>) => void);

  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const UIDataTable = <TData extends { id?: string | number }>({
  data,
  columns,
  pageIndex,
  pageSize,
  totalCount,
  onPageSizeChange,
  columnVisibility = {},
  onColumnVisibilityChange,
  sorting,
  onSortingChange,
  filters,
  onFilter,
  globalFilterFields,
  header,
  onPageChange,
  renderToolbar,
  rowSelection = {},
  setRowSelection,
  size = "md",
  isLoading = false,
}: DataTableProps<TData>) => {

  const onPage = (e: DataTablePageEvent) => {
    if (e.page !== pageIndex) {
      onPageChange(e.page as number);
    }
    if (e.rows !== pageSize) {
      if (typeof onPageSizeChange === "function") {
        onPageSizeChange(e.rows);
      }
    }
  };

  const onSort = (e: DataTableSortEvent) => {
    if (typeof onSortingChange === "function") {
      if (e.sortField) {
        onSortingChange([{ id: e.sortField, desc: e.sortOrder === -1 }]);
      } else {
        onSortingChange([]);
      }
    }
  };

  const selectedItems = useMemo(() => {
    if (!rowSelection) return [];
    return data.filter((item) => item.id && rowSelection[item.id.toString()]);
  }, [rowSelection, data]);

  const onSelectionChange = (e: any) => {
    if (typeof setRowSelection === "function") {
      const newSelection: Record<string, boolean> = {};
      if (Array.isArray(e.value)) {
        e.value.forEach((item: any) => {
          if (item.id) newSelection[item.id.toString()] = true;
        });
      }
      setRowSelection(newSelection);
    }
  };

  const sortField = sorting?.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting?.length > 0 ? (sorting[0].desc ? -1 : 1) : null;

  const mockTable = useMemo(() => {
    return {
      getState: () => ({ rowSelection, pagination: { pageIndex, pageSize } }),
      getPageCount: () => Math.ceil(totalCount / pageSize),
      resetRowSelection: () => setRowSelection && setRowSelection({}),
      getIsAllPageRowsSelected: () => selectedItems.length === data.length && data.length > 0,
      getIsSomePageRowsSelected: () => selectedItems.length > 0 && selectedItems.length < data.length,
      toggleAllPageRowsSelected: (value: boolean) => {
        if (typeof setRowSelection === "function") {
          if (value) {
            const newSelection: Record<string, boolean> = {};
            data.forEach((item) => {
              if (item.id) newSelection[item.id.toString()] = true;
            });
            setRowSelection(newSelection);
          } else {
            setRowSelection({});
          }
        }
      },
      setColumnFilters: (f: any) => {
        if (typeof onFilter === "function") {
          onFilter(f);
        }
      }
    };
  }, [rowSelection, pageIndex, pageSize, totalCount, selectedItems, data, setRowSelection, onFilter]);

  const ptSize = size === "sm" ? "small" : size === "lg" ? "large" : "normal";

  const emptyTemplate = () => (
    <div className="flex flex-col items-center justify-center py-6 text-slate-500">
      <i className="pi pi-inbox text-4xl mb-2" />
      <p>No se encontraron datos.</p>
    </div>
  );

  const visibleColumns = columns.filter(
    (col) => columnVisibility[col.id || col.accessorKey!] !== false
  );

  const paginatorLeft = Object.keys(rowSelection || {}).length > 0 ? (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        {Object.keys(rowSelection).length} seleccionados
      </div>
      <Button
        type="button"
        icon="pi pi-times"
        label="Limpiar"
        className="p-button-text p-button-sm p-0"
        onClick={() => typeof setRowSelection === 'function' && setRowSelection({})}
      />
    </div>
  ) : <span />;

  return (
    <div className="w-full flex flex-col gap-4">
      {renderToolbar && renderToolbar(mockTable)}

      <PrimeDataTable
        value={data}
        lazy
        paginator
        first={pageIndex * pageSize}
        rows={pageSize}
        totalRecords={totalCount}
        onPage={onPage}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSort}

        // -- Filtros avanzados --
        filters={filters}
        onFilter={(e: DataTableFilterEvent) => {
          if (typeof onFilter === "function") {
            onFilter(e.filters as DataTableFilterMeta);
          }
        }}
        globalFilterFields={globalFilterFields}
        header={header}
        filterDisplay="menu"
        // -----------------------
        loading={isLoading}
        selectionMode={setRowSelection ? "checkbox" : null}
        selection={selectedItems}
        onSelectionChange={onSelectionChange}
        dataKey="id"
        size={ptSize}
        emptyMessage={emptyTemplate}
        className="border border-slate-200 rounded-md overflow-hidden w-full"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
        rowsPerPageOptions={[5, 10, 20, 50]}
        paginatorLeft={paginatorLeft}
      >
        {setRowSelection && (
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
        )}

        {visibleColumns.map((col, i) => {
          const field = col.accessorKey || col.id;
          return (
            <Column
              key={field || i}
              field={field}
              header={col.header}
              sortable={col.enableSorting !== false}
              body={
                col.cell
                  ? (rowData) => col.cell!({ row: { original: rowData } })
                  : undefined
              }
              // -- Propiedades de filtros --
              filter={col.filter}
              filterField={col.filterField}
              filterElement={col.filterElement}
              dataType={col.dataType}
              showFilterMatchModes={col.showFilterMatchModes}
              filterMenuStyle={col.filterMenuStyle}
              filterClear={col.filterClear}
              filterApply={col.filterApply}
              filterFooter={col.filterFooter}
              filterPlaceholder={col.filterPlaceholder}
            />
          );
        })}
      </PrimeDataTable>
    </div>
  );
};

export const DataTable = UIDataTable;

// Export empty pagination component to avoid import errors from old code
export const DataTablePagination = () => null;

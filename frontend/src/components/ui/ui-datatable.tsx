import React, { useMemo } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import type { DataTableFilterMeta } from "primereact/datatable";
import type {
  ColumnFilterElementTemplateOptions,
  ColumnFilterApplyTemplateOptions,
  ColumnFilterClearTemplateOptions,
} from "primereact/column";
import "./resource-page.css";

// Re-exportamos los tipos/enums de PrimeReact usados por las páginas (filtros del store)
export type {
  DataTableFilterMeta,
  ColumnFilterElementTemplateOptions,
  ColumnFilterApplyTemplateOptions,
  ColumnFilterClearTemplateOptions,
};
export { FilterMatchMode, FilterOperator };

// ─── Tipos ──────────────────────────────────────────────────────────────────

export type ColumnDef<TData = any> = {
  id?: string;
  accessorKey?: string;
  header: React.ReactNode;
  cell?: (info: { row: { original: TData } }) => React.ReactNode;
  enableSorting?: boolean;
  /** Alineación del contenido de la columna */
  align?: "left" | "right" | "center";
  meta?: any;

  // Propiedades de filtros heredadas (compatibilidad con páginas existentes; no se renderizan)
  filter?: boolean;
  filterField?: string;
  filterElement?: (options: ColumnFilterElementTemplateOptions) => React.ReactNode;
  dataType?: "text" | "numeric" | "date" | "boolean";
  filterPlaceholder?: string;
};

export type SortingState = { id: string; desc: boolean }[];

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];

  pageIndex: number;
  pageSize: number;
  totalCount: number;
  onPageSizeChange: ((size: number) => void) | React.Dispatch<React.SetStateAction<number>>;
  onPageChange: (page: number) => void;

  sorting: SortingState;
  onSortingChange: ((sort: SortingState) => void) | React.Dispatch<React.SetStateAction<SortingState>>;

  columnVisibility?: Record<string, boolean>;
  onColumnVisibilityChange?: ((vis: Record<string, boolean>) => void) | React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

  rowSelection?: Record<string, boolean>;
  setRowSelection?: ((sel: Record<string, boolean>) => void) | React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

  /** Contenido del toolbar (búsqueda, chips de filtro, etc.) */
  header?: React.ReactNode;
  /** Botones que aparecen en la barra de selección cuando hay filas marcadas */
  selectionActions?: React.ReactNode;

  /** Filtros heredados (compatibilidad; el store los sigue usando para el server-side) */
  filters?: DataTableFilterMeta;
  onFilter?: ((filters: DataTableFilterMeta) => void) | React.Dispatch<React.SetStateAction<DataTableFilterMeta>>;
  globalFilterFields?: string[];

  // Empty state
  emptyTitle?: string;
  emptyText?: string;
  emptyAction?: React.ReactNode;

  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export const UIDataTable = <TData extends { id?: string | number }>({
  data,
  columns,
  pageIndex,
  pageSize,
  totalCount,
  onPageSizeChange,
  onPageChange,
  sorting,
  onSortingChange,
  columnVisibility = {},
  rowSelection = {},
  setRowSelection,
  header,
  selectionActions,
  emptyTitle = "No se encontraron datos",
  emptyText = "Aún no hay registros para mostrar.",
  emptyAction,
  isLoading = false,
}: DataTableProps<TData>) => {
  const selectable = typeof setRowSelection === "function";

  const visibleColumns = useMemo(
    () => columns.filter((col) => columnVisibility[col.id || col.accessorKey || ""] !== false),
    [columns, columnVisibility],
  );

  const colSpan = visibleColumns.length + (selectable ? 1 : 0);
  const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1);
  const currentSort = sorting?.[0];

  // ── Selección ──
  const selectedCount = useMemo(
    () => Object.values(rowSelection).filter(Boolean).length,
    [rowSelection],
  );
  const allPageSelected =
    data.length > 0 && data.every((d) => d.id != null && rowSelection[String(d.id)]);

  const toggleSelectAll = () => {
    if (!setRowSelection) return;
    const next = { ...rowSelection };
    if (allPageSelected) {
      data.forEach((d) => d.id != null && delete next[String(d.id)]);
    } else {
      data.forEach((d) => d.id != null && (next[String(d.id)] = true));
    }
    setRowSelection(next);
  };
  const toggleRow = (id: string | number) => {
    if (!setRowSelection) return;
    setRowSelection({ ...rowSelection, [String(id)]: !rowSelection[String(id)] });
  };
  const clearSelection = () => setRowSelection && setRowSelection({});

  // ── Ordenamiento ──
  const toggleSort = (field: string) => {
    if (!currentSort || currentSort.id !== field) onSortingChange([{ id: field, desc: false }]);
    else if (!currentSort.desc) onSortingChange([{ id: field, desc: true }]);
    else onSortingChange([]);
  };
  const sortArrow = (field: string) => {
    const on = currentSort?.id === field;
    if (!on) return <span className="arrow">▲▼</span>;
    return <span className="arrow on">{currentSort?.desc ? "▼" : "▲"}</span>;
  };

  // ── Paginación ──
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(0, Math.min(pageIndex - 2, totalPages - 5));
    for (let i = start; i < Math.min(start + 5, totalPages); i++) pages.push(i);
    return pages;
  }, [pageIndex, totalPages]);

  const hasData = data.length > 0;

  const cellValue = (col: ColumnDef<TData>, row: TData) => {
    if (col.cell) return col.cell({ row: { original: row } });
    const key = col.accessorKey;
    const value = key ? (row as Record<string, unknown>)[key] : undefined;
    return value == null || value === "" ? "—" : String(value);
  };

  return (
    <div className="rp-card">
      {/* Toolbar */}
      {header && (
        <div className="rp-toolbar">
          <div className="rp-toolbar-left">{header}</div>
        </div>
      )}

      {/* Barra de selección */}
      {selectable && selectedCount > 0 && (
        <div className="rp-selection">
          <span>{selectedCount} seleccionado(s)</span>
          <div className="rp-selection-actions">
            {selectionActions}
            <button className="rp-btn rp-btn-ghost" onClick={clearSelection}>Limpiar</button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="rp-table-wrap">
        <table className="rp-table">
          <thead>
            <tr>
              {selectable && (
                <th style={{ width: 42 }}>
                  <input
                    type="checkbox"
                    className="rp-check"
                    checked={allPageSelected}
                    onChange={toggleSelectAll}
                    aria-label="Seleccionar todos"
                  />
                </th>
              )}
              {visibleColumns.map((col, i) => {
                const field = col.accessorKey || col.id || String(i);
                const sortable = col.enableSorting !== false && !!col.accessorKey;
                return (
                  <th
                    key={field}
                    className={sortable ? "rp-th-sort" : undefined}
                    style={{ textAlign: col.align ?? "left" }}
                    onClick={sortable ? () => toggleSort(field) : undefined}
                  >
                    {col.header} {sortable && sortArrow(field)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: Math.min(pageSize, 8) }).map((_, i) => (
                <tr className="rp-skeleton-row" key={i}>
                  {Array.from({ length: colSpan }).map((__, j) => (
                    <td key={j}><div className="rp-skeleton" style={{ width: j === (selectable ? 1 : 0) ? "70%" : "50%" }} /></td>
                  ))}
                </tr>
              ))
            ) : hasData ? (
              data.map((row) => {
                const id = row.id != null ? String(row.id) : undefined;
                const selected = id ? !!rowSelection[id] : false;
                return (
                  <tr key={id ?? Math.random()} className={selected ? "selected" : ""}>
                    {selectable && (
                      <td>
                        <input
                          type="checkbox"
                          className="rp-check"
                          checked={selected}
                          onChange={() => id && toggleRow(id)}
                          aria-label="Seleccionar fila"
                        />
                      </td>
                    )}
                    {visibleColumns.map((col, i) => (
                      <td key={col.accessorKey || col.id || i} style={{ textAlign: col.align ?? "left" }}>
                        {cellValue(col, row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={colSpan}>
                  <div className="rp-empty">
                    <div className="rp-empty-icon"><i className="pi pi-inbox" /></div>
                    <h4 className="rp-empty-title">{emptyTitle}</h4>
                    <p className="rp-empty-text">{emptyText}</p>
                    {emptyAction}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / paginación */}
      {hasData && (
        <div className="rp-foot">
          <div>
            Mostrando{" "}
            <strong style={{ color: "var(--rp-ink-2)" }}>
              {pageIndex * pageSize + 1}–{Math.min((pageIndex + 1) * pageSize, totalCount)}
            </strong>{" "}
            de <strong style={{ color: "var(--rp-ink-2)" }}>{new Intl.NumberFormat("es-CO").format(totalCount)}</strong>
          </div>
          <div className="rp-pager">
            <select
              className="rp-page-size"
              value={pageSize}
              onChange={(e) => { onPageSizeChange(Number(e.target.value)); onPageChange(0); }}
            >
              {[5, 10, 20, 50].map((s) => <option key={s} value={s}>{s} / pág.</option>)}
            </select>
            <button className="rp-page-btn" disabled={pageIndex === 0} onClick={() => onPageChange(pageIndex - 1)}>‹</button>
            {pageNumbers.map((p) => (
              <button key={p} className={`rp-page-btn ${p === pageIndex ? "current" : ""}`} onClick={() => onPageChange(p)}>
                {p + 1}
              </button>
            ))}
            <button className="rp-page-btn" disabled={pageIndex >= totalPages - 1} onClick={() => onPageChange(pageIndex + 1)}>›</button>
          </div>
        </div>
      )}
    </div>
  );
};

export const DataTable = UIDataTable;

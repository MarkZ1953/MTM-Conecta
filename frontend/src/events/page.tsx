import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";
import { OverlayPanel } from "primereact/overlaypanel";
import {
  DataTable,
  FilterMatchMode,
  FilterOperator,
  UIPageHeader,
  toast,
  type ColumnDef,
  type DataTableFilterMeta,
} from "@/components";
import { buildQueryParams } from "@/utils";
import { eventsAPI } from "./events.api";
import { useEventsStore } from "./events.store";
import type { Event } from "./events.types";
import {
  EventsBulkDeleteDialog,
  EventsCreateForm,
  EventsDeleteDialog,
  EventsEditForm,
} from "./components/forms";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  location: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
  },
};

const COLUMN_VISIBILITY_KEY = "events_table_column_visibility";

const columnLabels: Record<string, string> = {
  title: "Título",
  start_date: "Fecha Inicio",
  end_date: "Fecha Fin",
  location: "Ubicación",
};

type RowActionsProps = {
  eventObj: Event;
  onEdit: (eventObj: Event) => void;
  onDelete: (eventObj: Event) => void;
};

const EventsRowActions = ({
  eventObj,
  onEdit,
  onDelete,
}: RowActionsProps) => {
  const menuRef = useRef<Menu>(null);

  const items: MenuItem[] = [
    {
      label: "Editar",
      icon: "pi pi-pencil",
      command: () => onEdit(eventObj),
    },
    { separator: true },
    {
      label: "Eliminar",
      icon: "pi pi-trash",
      className: "text-red-600",
      command: () => onDelete(eventObj),
    },
  ];

  return (
    <div className="flex justify-content-end">
      <Menu ref={menuRef} model={items} popup />
      <Button
        type="button"
        icon="pi pi-ellipsis-v"
        rounded
        text
        size="small"
        severity="secondary"
        className="h-2rem w-2rem"
        aria-label={`Acciones para ${eventObj.title}`}
        onClick={(e) => menuRef.current?.toggle(e)}
      />
    </div>
  );
};

export const EventsPage = () => {
  const {
    filters,
    setFilters,
    sorting,
    setSorting,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    refresh,
    setRefresh,
  } = useEventsStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const globalFilter = filters.global;
    return globalFilter && "value" in globalFilter
      ? ((globalFilter.value as string) ?? "")
      : "";
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(COLUMN_VISIBILITY_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const actionsMenuRef = useRef<Menu>(null);
  const columnsPanelRef = useRef<OverlayPanel>(null);

  useEffect(() => {
    if (Object.keys(filters).length === 0) {
      setFilters(defaultFilters);
    }
  }, [filters, setFilters]);

  useEffect(() => {
    localStorage.setItem(COLUMN_VISIBILITY_KEY, JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const { data, isLoading } = useQuery({
    queryKey: ["events", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({
        columnFilters: filters,
        sorting,
        pageIndex,
        pageSize,
      });

      const { data } = await eventsAPI.getAll({ params });

      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los eventos.");
      return false;
    },
  });

  const eventsList = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const selectedIds = useMemo(
    () =>
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([id]) => Number(id))
        .filter((id) => Number.isFinite(id)),
    [rowSelection],
  );

  const clearFilter = () => {
    setFilters(defaultFilters);
    setGlobalFilterValue("");
  };

  const onGlobalFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const nextFilters = { ...filters };

    if (!nextFilters.global) {
      nextFilters.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    }

    if ("value" in nextFilters.global) {
      nextFilters.global.value = value;
    }

    setFilters(nextFilters);
    setGlobalFilterValue(value);
  };

  const openEdit = (eventObj: Event) => {
    setSelectedEvent(eventObj);
    setEditOpen(true);
  };

  const openDelete = (eventObj: Event) => {
    setSelectedEvent(eventObj);
    setDeleteOpen(true);
  };

  const onBulkDeleteSuccess = () => {
    setRowSelection({});
    setRefresh((prev) => !prev);
  };

  const setColumnVisible = (key: string, visible: boolean) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [key]: visible,
    }));
  };

  const resetColumnVisibility = () => setColumnVisibility({});

  const actionMenuItems: MenuItem[] = [
    {
      label: "Acciones",
      items: [
        {
          label:
            selectedIds.length > 0
              ? `Eliminar seleccionados (${selectedIds.length})`
              : "Eliminar seleccionados",
          icon: "pi pi-trash",
          disabled: selectedIds.length === 0,
          command: () => setBulkDeleteOpen(true),
        },
      ],
    },
  ];

  const renderHeader = () => (
    <div className="flex flex-column gap-2 md:flex-row md:justify-content-between md:align-items-center">
      <div className="flex flex-wrap align-items-center gap-2">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Limpiar"
          outlined
          size="small"
          onClick={clearFilter}
        />

        <Menu ref={actionsMenuRef} model={actionMenuItems} popup />
        <Button
          type="button"
          icon="pi pi-bolt"
          label="Acciones"
          outlined
          size="small"
          onClick={(e) => actionsMenuRef.current?.toggle(e)}
          aria-haspopup
        />

        <OverlayPanel ref={columnsPanelRef}>
          <div className="w-16rem">
            <div className="flex align-items-center justify-content-between mb-3">
              <span className="font-semibold text-900">Columnas</span>
              <Button
                type="button"
                label="Restablecer"
                text
                size="small"
                className="p-0"
                onClick={resetColumnVisibility}
              />
            </div>
            <div className="flex flex-column gap-3">
              {Object.entries(columnLabels).map(([key, label]) => (
                <label
                  key={key}
                  htmlFor={`column-${key}`}
                  className="flex align-items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    inputId={`column-${key}`}
                    checked={columnVisibility[key] !== false}
                    onChange={(e) => setColumnVisible(key, Boolean(e.checked))}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </OverlayPanel>
        <Button
          type="button"
          icon="pi pi-table"
          label="Columnas"
          outlined
          size="small"
          onClick={(e) => columnsPanelRef.current?.toggle(e)}
          aria-haspopup
        />

        {selectedIds.length > 0 && (
          <Button
            type="button"
            icon="pi pi-times"
            label={`${selectedIds.length} seleccionados`}
            text
            size="small"
            onClick={() => setRowSelection({})}
          />
        )}
      </div>

      <IconField iconPosition="left" className="w-full md:w-auto">
        <InputIcon className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Búsqueda global..."
          className="p-inputtext-sm w-full md:w-20rem"
        />
      </IconField>
    </div>
  );

  const eventColumns: ColumnDef<Event>[] = [
    {
      accessorKey: "title",
      header: "Título",
      enableSorting: true,
      filter: true,
      filterPlaceholder: "Buscar título",
    },
    {
      accessorKey: "start_date",
      header: "Fecha Inicio",
      enableSorting: true,
      filter: false,
      cell: ({ row }) => new Date(row.original.start_date).toLocaleString(),
    },
    {
      accessorKey: "end_date",
      header: "Fecha Fin",
      enableSorting: true,
      filter: false,
      cell: ({ row }) => new Date(row.original.end_date).toLocaleString(),
    },
    {
      accessorKey: "location",
      header: "Ubicación",
      enableSorting: true,
      filter: true,
      filterPlaceholder: "Buscar ubicación",
    },
    {
      id: "actions",
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }) => (
        <EventsRowActions
          eventObj={row.original}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      ),
    },
  ];

  return (
    <div className="w-full flex-1 flex flex-column">
      <UIPageHeader
        title="Eventos"
        icon="pi pi-calendar"
        actions={
          <Button
            label="Nuevo evento"
            icon="pi pi-plus"
            size="small"
            onClick={() => setCreateOpen(true)}
          />
        }
      />

      <DataTable
        data={eventsList}
        columns={eventColumns}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageSizeChange={setPageSize}
        sorting={sorting}
        onSortingChange={setSorting}
        onPageChange={setPageIndex}
        isLoading={isLoading}
        filters={filters}
        onFilter={setFilters}
        globalFilterFields={["title", "location"]}
        header={renderHeader()}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        size="sm"
      />

      <EventsCreateForm
        open={createOpen}
        setOpen={setCreateOpen}
        setRefresh={setRefresh}
      />
      <EventsEditForm
        open={editOpen}
        setOpen={setEditOpen}
        eventObj={selectedEvent}
        setRefresh={setRefresh}
      />
      <EventsDeleteDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        eventObj={selectedEvent}
        setRefresh={setRefresh}
      />
      <EventsBulkDeleteDialog
        open={bulkDeleteOpen}
        setOpen={setBulkDeleteOpen}
        ids={selectedIds}
        onSuccess={onBulkDeleteSuccess}
      />
    </div>
  );
};

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
import { donationsAPI } from "./donations.api";
import { useDonationsStore } from "./donations.store";
import type { Donation } from "./donations.types";
import {
  DonationsBulkDeleteDialog,
  DonationsCreateForm,
  DonationsDeleteDialog,
  DonationsEditForm,
} from "./components/forms";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
};

const COLUMN_VISIBILITY_KEY = "donations_table_column_visibility";

const columnLabels: Record<string, string> = {
  id: "ID Donación",
  donor: "ID Donante",
  amount: "Monto",
  status: "Estado",
  date: "Fecha",
};

type RowActionsProps = {
  donationObj: Donation;
  onEdit: (donationObj: Donation) => void;
  onDelete: (donationObj: Donation) => void;
};

const DonationsRowActions = ({
  donationObj,
  onEdit,
  onDelete,
}: RowActionsProps) => {
  const menuRef = useRef<Menu>(null);

  const items: MenuItem[] = [
    {
      label: "Editar",
      icon: "pi pi-pencil",
      command: () => onEdit(donationObj),
    },
    { separator: true },
    {
      label: "Eliminar",
      icon: "pi pi-trash",
      className: "text-red-600",
      command: () => onDelete(donationObj),
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
        aria-label={`Acciones para la donación ${donationObj.id}`}
        onClick={(e) => menuRef.current?.toggle(e)}
      />
    </div>
  );
};

export const DonationsPage = () => {
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
  } = useDonationsStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const globalFilter = filters.global;
    return globalFilter && "value" in globalFilter
      ? ((globalFilter.value as string) ?? "")
      : "";
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
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
    queryKey: ["donations", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({
        columnFilters: filters,
        sorting,
        pageIndex,
        pageSize,
      });

      const { data } = await donationsAPI.getAll({ params });

      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar las donaciones.");
      return false;
    },
  });

  const donationsList = data?.results ?? [];
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

  const openEdit = (donationObj: Donation) => {
    setSelectedDonation(donationObj);
    setEditOpen(true);
  };

  const openDelete = (donationObj: Donation) => {
    setSelectedDonation(donationObj);
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

  const donationColumns: ColumnDef<Donation>[] = [
    {
      accessorKey: "id",
      header: "ID",
      enableSorting: true,
      filter: true,
      filterPlaceholder: "Buscar ID",
    },
    {
      accessorKey: "donor",
      header: "ID Donante",
      enableSorting: true,
      filter: true,
      filterPlaceholder: "Buscar donante",
    },
    {
      accessorKey: "amount",
      header: "Monto",
      enableSorting: true,
      filter: false,
      cell: ({ row }) => `$${row.original.amount}`,
    },
    {
      accessorKey: "status",
      header: "Estado",
      enableSorting: true,
      filter: true,
      filterPlaceholder: "Buscar estado",
    },
    {
      accessorKey: "date",
      header: "Fecha",
      enableSorting: true,
      filter: false,
      cell: ({ row }) => new Date(row.original.date).toLocaleString(),
    },
    {
      id: "actions",
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }) => (
        <DonationsRowActions
          donationObj={row.original}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      ),
    },
  ];

  return (
    <div className="w-full flex-1 flex flex-column">
      <UIPageHeader
        title="Donaciones"
        icon="pi pi-history"
        actions={
          <Button
            label="Registrar donación"
            icon="pi pi-plus"
            size="small"
            onClick={() => setCreateOpen(true)}
          />
        }
      />

      <DataTable
        data={donationsList}
        columns={donationColumns}
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
        globalFilterFields={["id", "donor", "status"]}
        header={renderHeader()}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        size="sm"
      />

      <DonationsCreateForm
        open={createOpen}
        setOpen={setCreateOpen}
        setRefresh={setRefresh}
      />
      <DonationsEditForm
        open={editOpen}
        setOpen={setEditOpen}
        donationObj={selectedDonation}
        setRefresh={setRefresh}
      />
      <DonationsDeleteDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        donationObj={selectedDonation}
        setRefresh={setRefresh}
      />
      <DonationsBulkDeleteDialog
        open={bulkDeleteOpen}
        setOpen={setBulkDeleteOpen}
        ids={selectedIds}
        onSuccess={onBulkDeleteSuccess}
      />
    </div>
  );
};

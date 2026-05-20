import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DataTable,
  FilterMatchMode,
  FilterOperator,
  toast,
  type ColumnDef,
  type DataTableFilterMeta,
} from "@/components";
import { buildQueryParams } from "@/utils";
import { guardiansAPI } from "./guardians.api";
import { useGuardiansStore } from "./guardians.store";
import type { Guardian } from "./guardians.types";
import {
  GuardiansBulkDeleteDialog,
  GuardiansCreateForm,
  GuardiansDeleteDialog,
  GuardiansEditForm,
} from "./components/forms";
import "@/components/ui/resource-page.css";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  beneficiary: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
};

const initials = (g: Guardian) => `${g.first_name?.[0] ?? ""}${g.last_name?.[0] ?? ""}`.toUpperCase();
const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);

export const GuardiansPage = () => {
  const {
    filters, setFilters, sorting, setSorting,
    pageIndex, setPageIndex, pageSize, setPageSize, refresh, setRefresh,
  } = useGuardiansStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const g = filters.global;
    return g && "value" in g ? ((g.value as string) ?? "") : "";
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters, setFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ["guardians", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
      const { data } = await guardiansAPI.getAll({ params });
      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los acudientes.");
      return false;
    },
  });

  const guardiansList = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, s]) => s).map(([id]) => Number(id)).filter(Number.isFinite),
    [rowSelection],
  );

  const distinctBeneficiaries = new Set(guardiansList.map((g) => g.beneficiary)).size;
  const withEmail = guardiansList.filter((g) => g.email).length;

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = { ...filters };
    if (!next.global) next.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    if ("value" in next.global) next.global.value = value;
    setFilters(next); setGlobalFilterValue(value); setPageIndex(0);
  };

  const openEdit = (g: Guardian) => { setSelectedGuardian(g); setEditOpen(true); };
  const openDelete = (g: Guardian) => { setSelectedGuardian(g); setDeleteOpen(true); };
  const onBulkDeleteSuccess = () => { setRowSelection({}); setRefresh((p) => !p); };

  const columns: ColumnDef<Guardian>[] = [
    {
      accessorKey: "first_name",
      header: "Acudiente",
      cell: ({ row: { original: g } }) => (
        <div className="rp-person">
          <div className={`rp-avatar rp-av-${Number(g.id) % 6}`}>{initials(g)}</div>
          <div>
            <div className="rp-person-name">{g.first_name} {g.last_name}</div>
            <div className="rp-person-id">ID #{g.id}</div>
          </div>
        </div>
      ),
    },
    { accessorKey: "identification_number", header: "Identificación" },
    { accessorKey: "phone_number", header: "Teléfono" },
    { accessorKey: "email", header: "Correo" },
    {
      id: "beneficiary",
      header: "Beneficiario",
      enableSorting: false,
      cell: ({ row: { original: g } }) => <span className="rp-badge inactive"><span className="dot" /> Benef. #{g.beneficiary}</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      align: "right",
      cell: ({ row: { original: g } }) => (
        <div className="rp-row-actions">
          <button className="rp-act" title="Editar" onClick={() => openEdit(g)}><i className="pi pi-pencil" /></button>
          <button className="rp-act danger" title="Eliminar" onClick={() => openDelete(g)}><i className="pi pi-trash" /></button>
        </div>
      ),
    },
  ];

  const toolbar = (
    <>
      <input className="rp-search" value={globalFilterValue} onChange={onGlobalFilterChange}
        placeholder="Buscar por nombre, identificación o correo…" />
      {globalFilterValue && (
        <span className="rp-chip active" onClick={() => onGlobalFilterChange({ target: { value: "" } } as ChangeEvent<HTMLInputElement>)}>
          Búsqueda: "{globalFilterValue}" <span className="remove">×</span>
        </span>
      )}
    </>
  );

  return (
    <div className="rp">
      <div className="rp-header">
        <div>
          <h1 className="rp-title">Acudientes <span className="count">{fmt(totalCount)} registrados</span></h1>
          <p className="rp-sub">Responsables y tutores asociados a los beneficiarios.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Registrar acudiente
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill teal"><i className="pi pi-shield" /></div>
          <div className="rp-stat-label">Total registrados</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Acudientes activos</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill lime"><i className="pi pi-list" /></div>
          <div className="rp-stat-label">En esta página</div>
          <div className="rp-stat-value">{fmt(guardiansList.length)}</div>
          <div className="rp-stat-meta">de {fmt(totalCount)} en total</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill ink"><i className="pi pi-users" /></div>
          <div className="rp-stat-label">Beneficiarios cubiertos</div>
          <div className="rp-stat-value">{fmt(distinctBeneficiaries)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill pink"><i className="pi pi-envelope" /></div>
          <div className="rp-stat-label">Con correo</div>
          <div className="rp-stat-value">{fmt(withEmail)}</div>
          <div className="rp-stat-meta">Contacto disponible</div>
        </div>
      </div>

      <DataTable
        data={guardiansList}
        columns={columns}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageSizeChange={setPageSize}
        onPageChange={setPageIndex}
        sorting={sorting}
        onSortingChange={setSorting}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        isLoading={isLoading}
        header={toolbar}
        selectionActions={
          <button className="rp-btn rp-btn-danger-ghost" onClick={() => setBulkDeleteOpen(true)}>Eliminar</button>
        }
        emptyTitle="No se encontraron acudientes"
        emptyText={globalFilterValue ? "Prueba con otra búsqueda." : "Registra el primer acudiente para empezar."}
        emptyAction={!globalFilterValue && (
          <button className="rp-btn rp-btn-primary" style={{ margin: "0 auto" }} onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Registrar acudiente
          </button>
        )}
      />

      <GuardiansCreateForm open={createOpen} setOpen={setCreateOpen} setRefresh={setRefresh} />
      <GuardiansEditForm open={editOpen} setOpen={setEditOpen} guardianObj={selectedGuardian} setRefresh={setRefresh} />
      <GuardiansDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} guardianObj={selectedGuardian} setRefresh={setRefresh} />
      <GuardiansBulkDeleteDialog open={bulkDeleteOpen} setOpen={setBulkDeleteOpen} ids={selectedIds} onSuccess={onBulkDeleteSuccess} />
    </div>
  );
};

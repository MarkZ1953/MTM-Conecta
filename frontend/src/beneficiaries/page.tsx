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
import { beneficiariesAPI } from "./beneficiaries.api";
import { useBeneficiariesStore } from "./beneficiaries.store";
import type { Beneficiary } from "./beneficiaries.types";
import {
  BeneficiariesBulkDeleteDialog,
  BeneficiariesCreateForm,
  BeneficiariesDeleteDialog,
  BeneficiariesEditForm,
} from "./components/forms";
import "@/components/ui/resource-page.css";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  first_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  last_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  identification_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
};

const initials = (b: Beneficiary) => `${b.first_name?.[0] ?? ""}${b.last_name?.[0] ?? ""}`.toUpperCase();
const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);
const age = (birthDate: string) => {
  const d = new Date(birthDate);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let years = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) years--;
  return years;
};
const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
};

export const BeneficiariesPage = () => {
  const {
    filters, setFilters, sorting, setSorting,
    pageIndex, setPageIndex, pageSize, setPageSize, refresh, setRefresh,
  } = useBeneficiariesStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const g = filters.global;
    return g && "value" in g ? ((g.value as string) ?? "") : "";
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters, setFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ["beneficiaries", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
      const { data } = await beneficiariesAPI.getAll({ params });
      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los beneficiarios.");
      return false;
    },
  });

  const beneficiaries = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, s]) => s).map(([id]) => Number(id)).filter(Number.isFinite),
    [rowSelection],
  );

  const pendingDocs = beneficiaries.filter((b) => !b.authorization_doc).length;
  const withDocs = beneficiaries.length - pendingDocs;

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = { ...filters };
    if (!next.global) next.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    if ("value" in next.global) next.global.value = value;
    setFilters(next); setGlobalFilterValue(value); setPageIndex(0);
  };

  const openEdit = (b: Beneficiary) => { setSelectedBeneficiary(b); setEditOpen(true); };
  const openDelete = (b: Beneficiary) => { setSelectedBeneficiary(b); setDeleteOpen(true); };
  const onBulkDeleteSuccess = () => { setRowSelection({}); setRefresh((p) => !p); };

  const columns: ColumnDef<Beneficiary>[] = [
    {
      accessorKey: "first_name",
      header: "Beneficiario",
      cell: ({ row: { original: b } }) => (
        <div className="rp-person">
          <div className={`rp-avatar rp-av-${Number(b.id) % 6}`} style={b.photo ? { backgroundImage: `url(${b.photo})`, backgroundSize: "cover" } : undefined}>
            {!b.photo && initials(b)}
          </div>
          <div>
            <div className="rp-person-name">{b.first_name} {b.last_name}</div>
            <div className="rp-person-id">ID #{b.id}</div>
          </div>
        </div>
      ),
    },
    { accessorKey: "identification_number", header: "Identificación" },
    {
      accessorKey: "birth_date",
      header: "Edad",
      cell: ({ row: { original: b } }) => {
        const a = age(b.birth_date);
        return a !== null ? `${a} años` : "—";
      },
    },
    {
      id: "documento",
      header: "Documento",
      enableSorting: false,
      cell: ({ row: { original: b } }) =>
        b.authorization_doc
          ? <span className="rp-badge active"><span className="dot" /> Cargado</span>
          : <span className="rp-badge pending"><span className="dot" /> Pendiente</span>,
    },
    {
      id: "estado",
      header: "Estado",
      enableSorting: false,
      cell: ({ row: { original: b } }) =>
        b.is_active
          ? <span className="rp-badge active"><span className="dot" /> Activo</span>
          : <span className="rp-badge inactive"><span className="dot" /> Inactivo</span>,
    },
    {
      id: "registrado",
      header: "Registrado",
      enableSorting: false,
      cell: ({ row: { original: b } }) => formatDate(b.registration_date),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      align: "right",
      cell: ({ row: { original: b } }) => (
        <div className="rp-row-actions">
          <button className="rp-act" title="Editar" onClick={() => openEdit(b)}><i className="pi pi-pencil" /></button>
          <button className="rp-act danger" title="Eliminar" onClick={() => openDelete(b)}><i className="pi pi-trash" /></button>
        </div>
      ),
    },
  ];

  const toolbar = (
    <>
      <input className="rp-search" value={globalFilterValue} onChange={onGlobalFilterChange}
        placeholder="Buscar por nombre o identificación…" />
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
          <h1 className="rp-title">Beneficiarios <span className="count">{fmt(totalCount)} registrados</span></h1>
          <p className="rp-sub">Personas y comunidades que reciben apoyo de la fundación.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-ghost"><i className="pi pi-download" style={{ fontSize: 13 }} /> Exportar</button>
          <button className="rp-btn rp-btn-ghost"><i className="pi pi-upload" style={{ fontSize: 13 }} /> Importar</button>
          <button className="rp-btn rp-btn-primary" onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nuevo beneficiario
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill teal"><i className="pi pi-users" /></div>
          <div className="rp-stat-label">Total registrados</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Beneficiarios activos</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill lime"><i className="pi pi-list" /></div>
          <div className="rp-stat-label">En esta página</div>
          <div className="rp-stat-value">{fmt(beneficiaries.length)}</div>
          <div className="rp-stat-meta">de {fmt(totalCount)} en total</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill ink"><i className="pi pi-check-circle" /></div>
          <div className="rp-stat-label">Con documentos</div>
          <div className="rp-stat-value">{fmt(withDocs)}</div>
          <div className="rp-stat-meta">Autorización cargada</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill pink"><i className="pi pi-file" /></div>
          <div className="rp-stat-label">Documentos pendientes</div>
          <div className="rp-stat-value">{fmt(pendingDocs)}</div>
          <div className="rp-stat-meta">Requieren autorización</div>
        </div>
      </div>

      <DataTable
        data={beneficiaries}
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
        emptyTitle="No se encontraron beneficiarios"
        emptyText={globalFilterValue ? "Prueba con otra búsqueda o limpia el filtro." : "Crea el primer beneficiario para empezar."}
        emptyAction={!globalFilterValue && (
          <button className="rp-btn rp-btn-primary" style={{ margin: "0 auto" }} onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nuevo beneficiario
          </button>
        )}
      />

      <BeneficiariesCreateForm open={createOpen} setOpen={setCreateOpen} setRefresh={setRefresh} />
      <BeneficiariesEditForm open={editOpen} setOpen={setEditOpen} beneficiary={selectedBeneficiary} setRefresh={setRefresh} />
      <BeneficiariesDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} beneficiary={selectedBeneficiary} setRefresh={setRefresh} />
      <BeneficiariesBulkDeleteDialog open={bulkDeleteOpen} setOpen={setBulkDeleteOpen} ids={selectedIds} onSuccess={onBulkDeleteSuccess} />
    </div>
  );
};

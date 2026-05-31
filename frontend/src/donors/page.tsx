import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DataTable,
  FilterMatchMode,
  toast,
  type ColumnDef,
  type DataTableFilterMeta,
} from "@/components";
import { buildQueryParams } from "@/utils";
import { donorsAPI } from "./donors.api";
import { useDonorsStore } from "./donors.store";
import { donorTypeLabels, type Donor, sponsorCategoryLabels } from "./donors.types";
import {
  DonorsBulkDeleteDialog,
  DonorsCreateForm,
  DonorsDeleteDialog,
  DonorsEditForm,
} from "./components/forms";
import "@/components/ui/resource-page.css";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

const CATEGORY_STYLES: Record<string, { label: string; cls: string }> = {
  BRONZE: { label: "Bronce (Nivel 1)", cls: "pending" },
  SILVER: { label: "Plata (Nivel 2)", cls: "inactive" },
  GOLD: { label: "Oro (Nivel 3)", cls: "active" },
  PLATINUM: { label: "Platino (Nivel 4)", cls: "completed" },
};

const getDonorDisplayName = (d: Donor) =>
  d.organization_name || `${d.first_name} ${d.last_name}`.trim();
const initials = (d: Donor) => {
  const displayName = getDonorDisplayName(d);
  return displayName.split(" ").map((word) => word[0]).slice(0, 2).join("").toUpperCase();
};
const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);

export const DonorsPage = () => {
  const {
    filters, setFilters, sorting, setSorting,
    pageIndex, setPageIndex, pageSize, setPageSize, refresh, setRefresh,
  } = useDonorsStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const g = filters.global;
    return g && "value" in g ? ((g.value as string) ?? "") : "";
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters, setFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ["donors", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
      const { data } = await donorsAPI.getAll({ params });
      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los donantes.");
      return false;
    },
  });

  const donorsList = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, s]) => s).map(([id]) => Number(id)).filter(Number.isFinite),
    [rowSelection],
  );

  const withEmail = donorsList.filter((d) => d.email).length;
  const linkedUsers = new Set(donorsList.map((d) => d.user)).size;
  const companyCount = donorsList.filter((d) => d.donor_type === "COMPANY").length;

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = { ...filters };
    if (!next.global) next.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    if ("value" in next.global) next.global.value = value;
    setFilters(next); setGlobalFilterValue(value); setPageIndex(0);
  };

  const openEdit = (d: Donor) => { setSelectedDonor(d); setEditOpen(true); };
  const openDelete = (d: Donor) => { setSelectedDonor(d); setDeleteOpen(true); };
  const onBulkDeleteSuccess = () => { setRowSelection({}); setRefresh((p) => !p); };

  const columns: ColumnDef<Donor>[] = [
    {
      accessorKey: "first_name",
      header: "Donante / Padrino",
      cell: ({ row: { original: d } }) => (
        <div className="rp-person">
          <div className={`rp-avatar rp-av-${Number(d.id) % 6}`}>{initials(d)}</div>
          <div>
            <div className="rp-person-name">{getDonorDisplayName(d)}</div>
            <div className="rp-person-id">{d.first_name} {d.last_name} · ID #{d.id}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "donor_type",
      header: "Tipo",
      cell: ({ row: { original: d } }) => (
        <span className="rp-badge active"><span className="dot" /> {donorTypeLabels[d.donor_type]}</span>
      ),
    },
    {
      accessorKey: "subscription_amount",
      header: "Compromiso Mensual",
      cell: ({ row: { original: d } }) => (
        <span style={{ fontWeight: 600, color: "var(--rp-ink)" }}>{fmt(parseFloat(String(d.subscription_amount || "0")))} COP</span>
      ),
    },
    {
      accessorKey: "payment_day",
      header: "Día de Pago / Boletín",
      cell: ({ row: { original: d } }) => (
        <div>
          <div style={{ fontWeight: 500 }}>Día {d.payment_day || 5} de cada mes</div>
          <div className="rp-person-id">{d.marketing_opt_in ? "Boletín Autorizado" : "Sin Boletín"}</div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Categoría",
      cell: ({ row: { original: d } }) => {
        const cat = CATEGORY_STYLES[d.category] ?? { label: "Bronce (Nivel 1)", cls: "pending" };
        return <span className={`rp-badge ${cat.cls}`}><span className="dot" /> {cat.label}</span>;
      },
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      align: "right",
      cell: ({ row: { original: d } }) => (
        <div className="rp-row-actions">
          <button className="rp-act" title="Editar" onClick={() => openEdit(d)}><i className="pi pi-pencil" /></button>
          <button className="rp-act danger" title="Eliminar" onClick={() => openDelete(d)}><i className="pi pi-trash" /></button>
        </div>
      ),
    },
  ];

  const toolbar = (
    <>
      <input className="rp-search" value={globalFilterValue} onChange={onGlobalFilterChange}
        placeholder="Buscar por nombre o correo…" />
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
          <h1 className="rp-title">Donantes <span className="count">{fmt(totalCount)} registrados</span></h1>
          <p className="rp-sub">Personas y empresas que realizan aportes a la fundación.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nuevo donante
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill pink"><i className="pi pi-heart" /></div>
          <div className="rp-stat-label">Total registrados</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Donantes activos</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill lime"><i className="pi pi-list" /></div>
          <div className="rp-stat-label">En esta página</div>
          <div className="rp-stat-value">{fmt(donorsList.length)}</div>
          <div className="rp-stat-meta">de {fmt(totalCount)} en total</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill teal"><i className="pi pi-envelope" /></div>
          <div className="rp-stat-label">Con correo</div>
          <div className="rp-stat-value">{fmt(withEmail)}</div>
          <div className="rp-stat-meta">Contacto disponible</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill ink"><i className="pi pi-building" /></div>
          <div className="rp-stat-label">Empresas</div>
          <div className="rp-stat-value">{fmt(companyCount)}</div>
          <div className="rp-stat-meta">{fmt(linkedUsers)} usuarios vinculados</div>
        </div>
      </div>

      <DataTable
        data={donorsList}
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
        emptyTitle="No se encontraron donantes"
        emptyText={globalFilterValue ? "Prueba con otra búsqueda." : "Registra el primer donante para empezar."}
        emptyAction={!globalFilterValue && (
          <button className="rp-btn rp-btn-primary" style={{ margin: "0 auto" }} onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nuevo donante
          </button>
        )}
      />

      <DonorsCreateForm open={createOpen} setOpen={setCreateOpen} setRefresh={setRefresh} />
      <DonorsEditForm open={editOpen} setOpen={setEditOpen} donorObj={selectedDonor} setRefresh={setRefresh} />
      <DonorsDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} donorObj={selectedDonor} setRefresh={setRefresh} />
      <DonorsBulkDeleteDialog open={bulkDeleteOpen} setOpen={setBulkDeleteOpen} ids={selectedIds} onSuccess={onBulkDeleteSuccess} />
    </div>
  );
};

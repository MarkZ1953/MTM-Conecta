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
import { donationsAPI } from "./donations.api";
import { useDonationsStore } from "./donations.store";
import { donationStatusLabels, donationTypeLabels, type Donation } from "./donations.types";
import {
  DonationsBulkDeleteDialog,
  DonationsCreateForm,
  DonationsDeleteDialog,
  DonationsEditForm,
} from "./components/forms";
import "@/components/ui/resource-page.css";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value || 0);
const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
};

const STATUS: Record<Donation["status"], { label: string; cls: string }> = {
  COMPLETED: { label: donationStatusLabels.COMPLETED, cls: "completed" },
  PENDING: { label: donationStatusLabels.PENDING, cls: "pending" },
  FAILED: { label: donationStatusLabels.FAILED, cls: "failed" },
};

export const DonationsPage = () => {
  const {
    filters, setFilters, sorting, setSorting,
    pageIndex, setPageIndex, pageSize, setPageSize, refresh, setRefresh,
  } = useDonationsStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const g = filters.global;
    return g && "value" in g ? ((g.value as string) ?? "") : "";
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters, setFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ["donations", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
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
    () => Object.entries(rowSelection).filter(([, s]) => s).map(([id]) => Number(id)).filter(Number.isFinite),
    [rowSelection],
  );

  const pageAmount = donationsList.reduce((acc, d) => acc + parseFloat(d.amount || "0"), 0);
  const completedCount = donationsList.filter((d) => d.status === "COMPLETED").length;
  const ecoaporteCount = donationsList.filter((d) => d.donation_type === "ECOAPORTE").length;
  const sponsorDonationCount = donationsList.filter((d) => d.donation_type === "PERMANENT_SPONSOR").length;

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = { ...filters };
    if (!next.global) next.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    if ("value" in next.global) next.global.value = value;
    setFilters(next); setGlobalFilterValue(value); setPageIndex(0);
  };

  const openEdit = (d: Donation) => { setSelectedDonation(d); setEditOpen(true); };
  const openDelete = (d: Donation) => { setSelectedDonation(d); setDeleteOpen(true); };
  const onBulkDeleteSuccess = () => { setRowSelection({}); setRefresh((p) => !p); };

  const columns: ColumnDef<Donation>[] = [
    {
      id: "donation",
      header: "Donación",
      enableSorting: false,
      cell: ({ row: { original: d } }) => (
        <div className="rp-person">
          <div className={`rp-avatar rp-av-${Number(d.id) % 6}`}><i className="pi pi-gift" /></div>
          <div>
            <div className="rp-person-name">Donación #{d.id}</div>
            <div className="rp-person-id">Registrada</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "donation_type",
      header: "Tipo",
      cell: ({ row: { original: d } }) => (
        <span className="rp-badge active"><span className="dot" /> {donationTypeLabels[d.donation_type]}</span>
      ),
    },
    {
      id: "donor",
      header: "Donante",
      enableSorting: false,
      cell: ({ row: { original: d } }) => <span className="rp-badge inactive"><span className="dot" /> Donante #{d.donor}</span>,
    },
    {
      accessorKey: "amount",
      header: "Monto",
      cell: ({ row: { original: d } }) => (
        <span style={{ fontWeight: 600, color: "var(--rp-ink)" }}>{formatCurrency(parseFloat(d.amount || "0"))}</span>
      ),
    },
    { accessorKey: "date", header: "Fecha", cell: ({ row: { original: d } }) => formatDate(d.date) },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row: { original: d } }) => {
        const st = STATUS[d.status] ?? { label: d.status, cls: "inactive" };
        return <span className={`rp-badge ${st.cls}`}><span className="dot" /> {st.label}</span>;
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
        placeholder="Buscar donación…" />
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
          <h1 className="rp-title">Donaciones <span className="count">{fmt(totalCount)} registradas</span></h1>
          <p className="rp-sub">Aportes recibidos por la fundación.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nueva donación
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill pink"><i className="pi pi-heart" /></div>
          <div className="rp-stat-label">Total donaciones</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Registradas</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill teal"><i className="pi pi-dollar" /></div>
          <div className="rp-stat-label">Monto en esta página</div>
          <div className="rp-stat-value">{formatCurrency(pageAmount)}</div>
          <div className="rp-stat-meta">{fmt(donationsList.length)} donaciones</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill lime"><i className="pi pi-check-circle" /></div>
          <div className="rp-stat-label">Completadas</div>
          <div className="rp-stat-value">{fmt(completedCount)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill ink"><i className="pi pi-tags" /></div>
          <div className="rp-stat-label">Ecoaportes</div>
          <div className="rp-stat-value">{fmt(ecoaporteCount)}</div>
          <div className="rp-stat-meta">{fmt(sponsorDonationCount)} padrino permanente</div>
        </div>
      </div>

      <DataTable
        data={donationsList}
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
        emptyTitle="No se encontraron donaciones"
        emptyText={globalFilterValue ? "Prueba con otra búsqueda." : "Registra la primera donación para empezar."}
        emptyAction={!globalFilterValue && (
          <button className="rp-btn rp-btn-primary" style={{ margin: "0 auto" }} onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nueva donación
          </button>
        )}
      />

      <DonationsCreateForm open={createOpen} setOpen={setCreateOpen} setRefresh={setRefresh} />
      <DonationsEditForm open={editOpen} setOpen={setEditOpen} donationObj={selectedDonation} setRefresh={setRefresh} />
      <DonationsDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} donationObj={selectedDonation} setRefresh={setRefresh} />
      <DonationsBulkDeleteDialog open={bulkDeleteOpen} setOpen={setBulkDeleteOpen} ids={selectedIds} onSuccess={onBulkDeleteSuccess} />
    </div>
  );
};

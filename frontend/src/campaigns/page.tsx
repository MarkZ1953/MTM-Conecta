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
import { campaignsAPI } from "./campaigns.api";
import { useCampaignsStore } from "./campaigns.store";
import type { Campaign } from "./campaigns.types";
import {
  CampaignsBulkDeleteDialog,
  CampaignsCreateForm,
  CampaignsDeleteDialog,
  CampaignsEditForm,
  CampaignsSendDialog,
} from "./components/forms";
import "@/components/ui/resource-page.css";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);
const formatDate = (value: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
};

const CONTENT_LABEL: Record<Campaign["content_type"], string> = {
  BUILDER: "Editor",
  IMAGE: "Imagen",
  PDF: "PDF",
};

const RECIPIENT_LABEL: Record<Campaign["recipient_group"], string> = {
  DONORS: "Donantes",
  GUARDIANS: "Cuidadores",
  USERS: "Usuarios",
  ALL: "Todos",
};

const STATUS: Record<Campaign["status"], { label: string; cls: string }> = {
  DRAFT: { label: "Borrador", cls: "inactive" },
  SENDING: { label: "Enviando", cls: "pending" },
  SENT: { label: "Enviada", cls: "completed" },
  FAILED: { label: "Fallida", cls: "failed" },
};

export const CampaignsPage = () => {
  const {
    filters, setFilters, sorting, setSorting,
    pageIndex, setPageIndex, pageSize, setPageSize, refresh, setRefresh,
  } = useCampaignsStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const g = filters.global;
    return g && "value" in g ? ((g.value as string) ?? "") : "";
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters, setFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ["campaigns", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
      const { data } = await campaignsAPI.getAll({ params });
      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar las campañas.");
      return false;
    },
  });

  const campaigns = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, s]) => s).map(([id]) => Number(id)).filter(Number.isFinite),
    [rowSelection],
  );

  const sentCount = campaigns.filter((c) => c.status === "SENT").length;
  const draftCount = campaigns.filter((c) => c.status === "DRAFT").length;

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = { ...filters };
    if (!next.global) next.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    if ("value" in next.global) next.global.value = value;
    setFilters(next); setGlobalFilterValue(value); setPageIndex(0);
  };

  const openEdit = (c: Campaign) => { setSelectedCampaign(c); setEditOpen(true); };
  const openDelete = (c: Campaign) => { setSelectedCampaign(c); setDeleteOpen(true); };
  const openSend = (c: Campaign) => { setSelectedCampaign(c); setSendOpen(true); };
  const onBulkDeleteSuccess = () => { setRowSelection({}); setRefresh((p) => !p); };

  const columns: ColumnDef<Campaign>[] = [
    {
      accessorKey: "subject",
      header: "Campaña",
      cell: ({ row: { original: c } }) => (
        <div className="rp-person">
          <div className={`rp-avatar rp-av-${Number(c.id) % 6}`}><i className="pi pi-megaphone" /></div>
          <div>
            <div className="rp-person-name">{c.subject}</div>
            <div className="rp-person-id">{CONTENT_LABEL[c.content_type]}</div>
          </div>
        </div>
      ),
    },
    {
      id: "recipient",
      header: "Destinatarios",
      enableSorting: false,
      cell: ({ row: { original: c } }) => (
        <span className="rp-badge inactive"><span className="dot" /> {RECIPIENT_LABEL[c.recipient_group]}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row: { original: c } }) => {
        const st = STATUS[c.status];
        return <span className={`rp-badge ${st.cls}`}><span className="dot" /> {st.label}</span>;
      },
    },
    {
      id: "sent",
      header: "Enviados",
      enableSorting: false,
      cell: ({ row: { original: c } }) =>
        c.status === "SENT"
          ? `${fmt(c.sent_count)} · ${formatDate(c.sent_at)}`
          : "—",
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      align: "right",
      cell: ({ row: { original: c } }) => (
        <div className="rp-row-actions">
          {c.status !== "SENT" && (
            <>
              <button className="rp-act" title="Editar" onClick={() => openEdit(c)}><i className="pi pi-pencil" /></button>
              <button className="rp-act" title="Enviar" onClick={() => openSend(c)}><i className="pi pi-send" /></button>
            </>
          )}
          <button className="rp-act danger" title="Eliminar" onClick={() => openDelete(c)}><i className="pi pi-trash" /></button>
        </div>
      ),
    },
  ];

  const toolbar = (
    <>
      <input className="rp-search" value={globalFilterValue} onChange={onGlobalFilterChange}
        placeholder="Buscar campaña por asunto…" />
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
          <h1 className="rp-title">Campañas <span className="count">{fmt(totalCount)} en total</span></h1>
          <p className="rp-sub">Correos promocionales enviados a donantes, cuidadores o usuarios.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nueva campaña
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill teal"><i className="pi pi-megaphone" /></div>
          <div className="rp-stat-label">Total campañas</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Registradas</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill lime"><i className="pi pi-list" /></div>
          <div className="rp-stat-label">En esta página</div>
          <div className="rp-stat-value">{fmt(campaigns.length)}</div>
          <div className="rp-stat-meta">de {fmt(totalCount)} en total</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill ink"><i className="pi pi-send" /></div>
          <div className="rp-stat-label">Enviadas</div>
          <div className="rp-stat-value">{fmt(sentCount)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill pink"><i className="pi pi-file-edit" /></div>
          <div className="rp-stat-label">Borradores</div>
          <div className="rp-stat-value">{fmt(draftCount)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
      </div>

      <DataTable
        data={campaigns}
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
        emptyTitle="No se encontraron campañas"
        emptyText={globalFilterValue ? "Prueba con otra búsqueda." : "Crea tu primera campaña para empezar."}
        emptyAction={!globalFilterValue && (
          <button className="rp-btn rp-btn-primary" style={{ margin: "0 auto" }} onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nueva campaña
          </button>
        )}
      />

      <CampaignsCreateForm open={createOpen} setOpen={setCreateOpen} setRefresh={setRefresh} />
      <CampaignsEditForm open={editOpen} setOpen={setEditOpen} campaignObj={selectedCampaign} setRefresh={setRefresh} />
      <CampaignsSendDialog open={sendOpen} setOpen={setSendOpen} campaignObj={selectedCampaign} setRefresh={setRefresh} />
      <CampaignsDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} campaignObj={selectedCampaign} setRefresh={setRefresh} />
      <CampaignsBulkDeleteDialog open={bulkDeleteOpen} setOpen={setBulkDeleteOpen} ids={selectedIds} onSuccess={onBulkDeleteSuccess} />
    </div>
  );
};

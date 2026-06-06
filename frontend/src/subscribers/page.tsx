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
import { subscribersAPI } from "./subscribers.api";
import { useSubscribersStore } from "./subscribers.store";
import type { NewsletterSubscriber } from "./subscribers.types";
import {
  SubscriberBulkDeleteDialog,
  SubscriberCreateForm,
  SubscriberDeleteDialog,
  SubscriberEditForm,
} from "./components/forms";
import "@/components/ui/resource-page.css";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);

const formatDate = (value?: string | null) => {
  if (!value) return "Sin fecha";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Sin fecha";
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
};

const ORIGIN_LABEL: Record<NewsletterSubscriber["origin"], string> = {
  BLOG: "Blog",
  HOME: "Sitio web",
  CAMPAIGN: "Campaña",
  ADMIN: "Panel",
  OTHER: "Otro",
};

const statusLabel = (subscriber: NewsletterSubscriber) =>
  subscriber.status === "ACTIVE"
    ? <span className="rp-badge active"><span className="dot" /> Activo</span>
    : <span className="rp-badge inactive"><span className="dot" /> Desuscrito</span>;

export const SubscribersPage = () => {
  const {
    filters, setFilters, sorting, setSorting,
    pageIndex, setPageIndex, pageSize, setPageSize, refresh, setRefresh,
  } = useSubscribersStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const g = filters.global;
    return g && "value" in g ? ((g.value as string) ?? "") : "";
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedSubscriber, setSelectedSubscriber] = useState<NewsletterSubscriber | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters, setFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ["subscribers", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
      const { data } = await subscribersAPI.getAll({ params });
      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los suscriptores.");
      return false;
    },
  });

  const subscribersList = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, selected]) => selected).map(([id]) => Number(id)).filter(Number.isFinite),
    [rowSelection],
  );
  const activeCount = subscribersList.filter((subscriber) => subscriber.status === "ACTIVE").length;
  const unsubscribedCount = subscribersList.filter((subscriber) => subscriber.status === "UNSUBSCRIBED").length;
  const blogCount = subscribersList.filter((subscriber) => subscriber.origin === "BLOG").length;

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = { ...filters };
    if (!next.global) next.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    if ("value" in next.global) next.global.value = value;
    setFilters(next);
    setGlobalFilterValue(value);
    setPageIndex(0);
  };

  const openEdit = (subscriber: NewsletterSubscriber) => {
    setSelectedSubscriber(subscriber);
    setEditOpen(true);
  };

  const openDelete = (subscriber: NewsletterSubscriber) => {
    setSelectedSubscriber(subscriber);
    setDeleteOpen(true);
  };

  const onBulkDeleteSuccess = () => {
    setRowSelection({});
    setRefresh((prev) => !prev);
  };

  const columns: ColumnDef<NewsletterSubscriber>[] = [
    {
      accessorKey: "email",
      header: "Suscriptor",
      cell: ({ row: { original: subscriber } }) => (
        <div className="rp-person">
          <div className={`rp-avatar rp-av-${Number(subscriber.id) % 6}`}>
            <i className="pi pi-envelope" />
          </div>
          <div>
            <div className="rp-person-name">{subscriber.email}</div>
            <div className="rp-person-id">{subscriber.name || "Sin nombre registrado"}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "subscribed_at",
      header: "Suscripción",
      cell: ({ row: { original: subscriber } }) => formatDate(subscriber.subscribed_at),
    },
    {
      accessorKey: "origin",
      header: "Origen",
      cell: ({ row: { original: subscriber } }) => ORIGIN_LABEL[subscriber.origin],
    },
    {
      accessorKey: "consent",
      header: "Consentimiento",
      enableSorting: false,
      cell: ({ row: { original: subscriber } }) =>
        subscriber.consent
          ? <span className="rp-badge active"><span className="dot" /> Sí</span>
          : <span className="rp-badge failed"><span className="dot" /> No</span>,
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row: { original: subscriber } }) => statusLabel(subscriber),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      align: "right",
      cell: ({ row: { original: subscriber } }) => (
        <div className="rp-row-actions">
          <button className="rp-act" title="Editar" onClick={() => openEdit(subscriber)}><i className="pi pi-pencil" /></button>
          <button className="rp-act danger" title="Eliminar" onClick={() => openDelete(subscriber)}><i className="pi pi-trash" /></button>
        </div>
      ),
    },
  ];

  const toolbar = (
    <>
      <input
        className="rp-search"
        value={globalFilterValue}
        onChange={onGlobalFilterChange}
        placeholder="Buscar por correo, nombre o notas..."
      />
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
          <h1 className="rp-title">Suscriptores <span className="count">{fmt(totalCount)} registros</span></h1>
          <p className="rp-sub">Personas inscritas al boletín para recibir novedades y campañas de Fundación MTM.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nuevo suscriptor
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill teal"><i className="pi pi-envelope" /></div>
          <div className="rp-stat-label">Total suscriptores</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Registrados</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill lime"><i className="pi pi-check-circle" /></div>
          <div className="rp-stat-label">Activos</div>
          <div className="rp-stat-value">{fmt(activeCount)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill pink"><i className="pi pi-ban" /></div>
          <div className="rp-stat-label">Desuscritos</div>
          <div className="rp-stat-value">{fmt(unsubscribedCount)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill ink"><i className="pi pi-book" /></div>
          <div className="rp-stat-label">Desde Blog</div>
          <div className="rp-stat-value">{fmt(blogCount)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
      </div>

      <DataTable
        data={subscribersList}
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
        emptyTitle="No se encontraron suscriptores"
        emptyText={globalFilterValue ? "Prueba con otra búsqueda." : "Cuando alguien se suscriba desde el Blog, aparecerá aquí."}
        emptyAction={!globalFilterValue && (
          <button className="rp-btn rp-btn-primary" style={{ margin: "0 auto" }} onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nuevo suscriptor
          </button>
        )}
      />

      <SubscriberCreateForm
        open={createOpen}
        setOpen={setCreateOpen}
        setRefresh={setRefresh}
        onSuccess={() => setPageIndex(0)}
      />
      <SubscriberEditForm open={editOpen} setOpen={setEditOpen} subscriber={selectedSubscriber} setRefresh={setRefresh} />
      <SubscriberDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} subscriber={selectedSubscriber} setRefresh={setRefresh} />
      <SubscriberBulkDeleteDialog open={bulkDeleteOpen} setOpen={setBulkDeleteOpen} ids={selectedIds} onSuccess={onBulkDeleteSuccess} />
    </div>
  );
};

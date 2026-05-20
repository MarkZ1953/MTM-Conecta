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
import { eventsAPI } from "./events.api";
import { useEventsStore } from "./events.store";
import type { Event } from "./events.types";
import {
  EventsBulkDeleteDialog,
  EventsCreateForm,
  EventsDeleteDialog,
  EventsEditForm,
} from "./components/forms";
import "@/components/ui/resource-page.css";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);
const formatDateTime = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
};
const isUpcoming = (value: string) => {
  const d = new Date(value);
  return !Number.isNaN(d.getTime()) && d.getTime() >= Date.now();
};

export const EventsPage = () => {
  const {
    filters, setFilters, sorting, setSorting,
    pageIndex, setPageIndex, pageSize, setPageSize, refresh, setRefresh,
  } = useEventsStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const g = filters.global;
    return g && "value" in g ? ((g.value as string) ?? "") : "";
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters, setFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ["events", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
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
    () => Object.entries(rowSelection).filter(([, s]) => s).map(([id]) => Number(id)).filter(Number.isFinite),
    [rowSelection],
  );

  const upcomingCount = eventsList.filter((e) => isUpcoming(e.start_date)).length;
  const attendeesSum = eventsList.reduce((acc, e) => acc + (e.attendees_count ?? 0), 0);

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = { ...filters };
    if (!next.global) next.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    if ("value" in next.global) next.global.value = value;
    setFilters(next); setGlobalFilterValue(value); setPageIndex(0);
  };

  const openEdit = (e: Event) => { setSelectedEvent(e); setEditOpen(true); };
  const openDelete = (e: Event) => { setSelectedEvent(e); setDeleteOpen(true); };
  const onBulkDeleteSuccess = () => { setRowSelection({}); setRefresh((p) => !p); };

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "title",
      header: "Evento",
      cell: ({ row: { original: e } }) => (
        <div className="rp-person">
          <div className={`rp-avatar rp-av-${Number(e.id) % 6}`}><i className="pi pi-calendar" /></div>
          <div>
            <div className="rp-person-name">{e.title}</div>
            <div className="rp-person-id">ID #{e.id}</div>
          </div>
        </div>
      ),
    },
    { accessorKey: "start_date", header: "Inicio", cell: ({ row: { original: e } }) => formatDateTime(e.start_date) },
    { accessorKey: "end_date", header: "Fin", cell: ({ row: { original: e } }) => formatDateTime(e.end_date) },
    { accessorKey: "location", header: "Ubicación" },
    {
      id: "attendees",
      header: "Asistentes",
      enableSorting: false,
      cell: ({ row: { original: e } }) => fmt(e.attendees_count ?? 0),
    },
    {
      id: "estado",
      header: "Estado",
      enableSorting: false,
      cell: ({ row: { original: e } }) =>
        isUpcoming(e.start_date)
          ? <span className="rp-badge upcoming"><span className="dot" /> Próximo</span>
          : <span className="rp-badge inactive"><span className="dot" /> Finalizado</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      align: "right",
      cell: ({ row: { original: e } }) => (
        <div className="rp-row-actions">
          <button className="rp-act" title="Editar" onClick={() => openEdit(e)}><i className="pi pi-pencil" /></button>
          <button className="rp-act danger" title="Eliminar" onClick={() => openDelete(e)}><i className="pi pi-trash" /></button>
        </div>
      ),
    },
  ];

  const toolbar = (
    <>
      <input className="rp-search" value={globalFilterValue} onChange={onGlobalFilterChange}
        placeholder="Buscar por título o ubicación…" />
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
          <h1 className="rp-title">Eventos <span className="count">{fmt(totalCount)} en total</span></h1>
          <p className="rp-sub">Actividades y jornadas organizadas por la fundación.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nuevo evento
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill teal"><i className="pi pi-calendar" /></div>
          <div className="rp-stat-label">Total eventos</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Registrados</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill lime"><i className="pi pi-clock" /></div>
          <div className="rp-stat-label">Próximos</div>
          <div className="rp-stat-value">{fmt(upcomingCount)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill pink"><i className="pi pi-users" /></div>
          <div className="rp-stat-label">Asistentes</div>
          <div className="rp-stat-value">{fmt(attendeesSum)}</div>
          <div className="rp-stat-meta">Sumados en esta página</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill ink"><i className="pi pi-list" /></div>
          <div className="rp-stat-label">En esta página</div>
          <div className="rp-stat-value">{fmt(eventsList.length)}</div>
          <div className="rp-stat-meta">de {fmt(totalCount)} en total</div>
        </div>
      </div>

      <DataTable
        data={eventsList}
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
        emptyTitle="No se encontraron eventos"
        emptyText={globalFilterValue ? "Prueba con otra búsqueda." : "Crea el primer evento para empezar."}
        emptyAction={!globalFilterValue && (
          <button className="rp-btn rp-btn-primary" style={{ margin: "0 auto" }} onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nuevo evento
          </button>
        )}
      />

      <EventsCreateForm open={createOpen} setOpen={setCreateOpen} setRefresh={setRefresh} />
      <EventsEditForm open={editOpen} setOpen={setEditOpen} eventObj={selectedEvent} setRefresh={setRefresh} />
      <EventsDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} eventObj={selectedEvent} setRefresh={setRefresh} />
      <EventsBulkDeleteDialog open={bulkDeleteOpen} setOpen={setBulkDeleteOpen} ids={selectedIds} onSuccess={onBulkDeleteSuccess} />
    </div>
  );
};

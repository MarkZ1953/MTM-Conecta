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
import { eventActAPI } from "./event-act.api";
import { useEventActStore } from "./event-act.store";
import type { EventAct } from "./event-act.types";
import {
  EventActBulkDeleteDialog,
  EventActCreateForm,
  EventActDeleteDialog,
  EventActEditForm,
} from "./components/forms";
import "@/components/ui/resource-page.css";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);
const truncate = (text: string, max = 60) =>
  !text ? "—" : text.length > max ? text.slice(0, max) + "…" : text;

export const ActsPage = () => {
  const {
    filters, setFilters, sorting, setSorting,
    pageIndex, setPageIndex, pageSize, setPageSize, refresh, setRefresh,
  } = useEventActStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const g = filters.global;
    return g && "value" in g ? ((g.value as string) ?? "") : "";
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedAct, setSelectedAct] = useState<EventAct | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters, setFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ["event-acts", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
      const { data } = await eventActAPI.getAll({ params });
      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar las actas.");
      return false;
    },
  });

  const actsList = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, s]) => s).map(([id]) => Number(id)).filter(Number.isFinite),
    [rowSelection],
  );

  const withSignature = actsList.filter((a) => a.digital_signature_path).length;
  const withoutSignature = actsList.length - withSignature;

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = { ...filters };
    if (!next.global) next.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    if ("value" in next.global) next.global.value = value;
    setFilters(next); setGlobalFilterValue(value); setPageIndex(0);
  };

  const openEdit = (a: EventAct) => { setSelectedAct(a); setEditOpen(true); };
  const openDelete = (a: EventAct) => { setSelectedAct(a); setDeleteOpen(true); };
  const onBulkDeleteSuccess = () => { setRowSelection({}); setRefresh((p) => !p); };

  const columns: ColumnDef<EventAct>[] = [
    {
      id: "acta",
      header: "Acta",
      enableSorting: false,
      cell: ({ row: { original: a } }) => (
        <div className="rp-person">
          <div className={`rp-avatar rp-av-${Number(a.id) % 6}`}><i className="pi pi-file" /></div>
          <div>
            <div className="rp-person-name">Acta #{a.id}</div>
            <div className="rp-person-id">Documento</div>
          </div>
        </div>
      ),
    },
    {
      id: "event",
      header: "Evento",
      enableSorting: false,
      cell: ({ row: { original: a } }) => <span className="rp-badge inactive"><span className="dot" /> Evento #{a.event}</span>,
    },
    {
      id: "content",
      header: "Contenido",
      enableSorting: false,
      cell: ({ row: { original: a } }) => truncate(a.content),
    },
    {
      id: "signature",
      header: "Firma",
      enableSorting: false,
      cell: ({ row: { original: a } }) =>
        a.digital_signature_path
          ? <span className="rp-badge active"><span className="dot" /> Firmada</span>
          : <span className="rp-badge pending"><span className="dot" /> Sin firma</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      align: "right",
      cell: ({ row: { original: a } }) => (
        <div className="rp-row-actions">
          <button className="rp-act" title="Editar" onClick={() => openEdit(a)}><i className="pi pi-pencil" /></button>
          <button className="rp-act danger" title="Eliminar" onClick={() => openDelete(a)}><i className="pi pi-trash" /></button>
        </div>
      ),
    },
  ];

  const toolbar = (
    <>
      <input className="rp-search" value={globalFilterValue} onChange={onGlobalFilterChange}
        placeholder="Buscar acta…" />
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
          <h1 className="rp-title">Actas de eventos <span className="count">{fmt(totalCount)} registradas</span></h1>
          <p className="rp-sub">Documentación formal de las actividades realizadas.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nueva acta
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill teal"><i className="pi pi-file" /></div>
          <div className="rp-stat-label">Total actas</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Registradas</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill lime"><i className="pi pi-list" /></div>
          <div className="rp-stat-label">En esta página</div>
          <div className="rp-stat-value">{fmt(actsList.length)}</div>
          <div className="rp-stat-meta">de {fmt(totalCount)} en total</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill ink"><i className="pi pi-verified" /></div>
          <div className="rp-stat-label">Firmadas</div>
          <div className="rp-stat-value">{fmt(withSignature)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill pink"><i className="pi pi-pencil" /></div>
          <div className="rp-stat-label">Sin firma</div>
          <div className="rp-stat-value">{fmt(withoutSignature)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
      </div>

      <DataTable
        data={actsList}
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
        emptyTitle="No se encontraron actas"
        emptyText={globalFilterValue ? "Prueba con otra búsqueda." : "Crea la primera acta para empezar."}
        emptyAction={!globalFilterValue && (
          <button className="rp-btn rp-btn-primary" style={{ margin: "0 auto" }} onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nueva acta
          </button>
        )}
      />

      <EventActCreateForm open={createOpen} setOpen={setCreateOpen} setRefresh={setRefresh} />
      <EventActEditForm open={editOpen} setOpen={setEditOpen} eventActObj={selectedAct} setRefresh={setRefresh} />
      <EventActDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} eventActObj={selectedAct} setRefresh={setRefresh} />
      <EventActBulkDeleteDialog open={bulkDeleteOpen} setOpen={setBulkDeleteOpen} ids={selectedIds} onSuccess={onBulkDeleteSuccess} />
    </div>
  );
};

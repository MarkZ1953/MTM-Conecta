import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { TabView, TabPanel } from "primereact/tabview";
import {
  DataTable,
  FilterMatchMode,
  toast,
  type ColumnDef,
  type DataTableFilterMeta,
} from "@/components";
import { buildQueryParams } from "@/utils";
import { companiesAPI, collectionPointsAPI, collectionRequestsAPI } from "./cap-collection.api";
import { useCompaniesStore, useCollectionPointsStore, useCollectionRequestsStore } from "./cap-collection.store";
import type { Company, CollectionPoint, CollectionRequest, CollectionRequestStatus } from "./cap-collection.types";
import {
  CompaniesCreateForm,
  CompaniesEditForm,
  CompaniesDeleteDialog,
  CompaniesBulkDeleteDialog,
  CollectionPointsCreateForm,
  CollectionPointsEditForm,
  CollectionPointsDeleteDialog,
  CollectionRequestsCreateForm,
  CollectionRequestsEditForm,
  CollectionRequestsDeleteDialog,
} from "./components/forms";
import "@/components/ui/resource-page.css";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);
const formatDate = (value: string) => {
  const d = new Date(value + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
};

const STATUS: Record<CollectionRequestStatus, { label: string; cls: string }> = {
  PENDING: { label: "Pendiente", cls: "pending" },
  ASSIGNED: { label: "Asignada", cls: "inactive" },
  IN_ROUTE: { label: "En Ruta", cls: "active" },
  COLLECTED: { label: "Recolectada", cls: "completed" },
  PROCESSED: { label: "Procesada", cls: "completed" },
  CANCELLED: { label: "Cancelada", cls: "failed" },
};

// ═══════════════════════════════════════════════════════════
//  TAB 1 — Empresas
// ═══════════════════════════════════════════════════════════

const CompaniesTab = () => {
  const {
    filters, setFilters, sorting, setSorting,
    pageIndex, setPageIndex, pageSize, setPageSize, refresh, setRefresh,
  } = useCompaniesStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const g = filters.global;
    return g && "value" in g ? ((g.value as string) ?? "") : "";
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters, setFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ["companies", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
      const { data } = await companiesAPI.getAll({ params });
      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar las empresas.");
      return false;
    },
  });

  const companiesList = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, s]) => s).map(([id]) => Number(id)).filter(Number.isFinite),
    [rowSelection],
  );

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = { ...filters };
    if (!next.global) next.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    if ("value" in next.global) next.global.value = value;
    setFilters(next); setGlobalFilterValue(value); setPageIndex(0);
  };

  const openEdit = (c: Company) => { setSelectedCompany(c); setEditOpen(true); };
  const openDelete = (c: Company) => { setSelectedCompany(c); setDeleteOpen(true); };
  const onBulkDeleteSuccess = () => { setRowSelection({}); setRefresh((p) => !p); };

  const columns: ColumnDef<Company>[] = [
    {
      id: "company",
      header: "Empresa",
      enableSorting: false,
      cell: ({ row: { original: c } }) => (
        <div className="rp-person">
          <div className={`rp-avatar rp-av-${Number(c.id) % 6}`}><i className="pi pi-building" /></div>
          <div>
            <div className="rp-person-name">{c.business_name}</div>
            <div className="rp-person-id">NIT: {c.nit}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "contact_name",
      header: "Contacto",
      cell: ({ row: { original: c } }) => (
        <div>
          <div style={{ fontWeight: 500 }}>{c.contact_name}</div>
          <div className="rp-person-id">{c.contact_email}</div>
        </div>
      ),
    },
    { accessorKey: "contact_phone", header: "Teléfono" },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      align: "right",
      cell: ({ row: { original: c } }) => (
        <div className="rp-row-actions">
          <button className="rp-act" title="Editar" onClick={() => openEdit(c)}><i className="pi pi-pencil" /></button>
          <button className="rp-act danger" title="Eliminar" onClick={() => openDelete(c)}><i className="pi pi-trash" /></button>
        </div>
      ),
    },
  ];

  const toolbar = (
    <>
      <input className="rp-search" value={globalFilterValue} onChange={onGlobalFilterChange}
        placeholder="Buscar empresa…" />
      {globalFilterValue && (
        <span className="rp-chip active" onClick={() => onGlobalFilterChange({ target: { value: "" } } as ChangeEvent<HTMLInputElement>)}>
          Búsqueda: "{globalFilterValue}" <span className="remove">×</span>
        </span>
      )}
    </>
  );

  return (
    <>
      <div className="rp-header">
        <div>
          <h1 className="rp-title">Empresas <span className="count">{fmt(totalCount)} registradas</span></h1>
          <p className="rp-sub">Empresas vinculadas al programa de recolección de tapas.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nueva empresa
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill teal"><i className="pi pi-building" /></div>
          <div className="rp-stat-label">Total empresas</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Registradas</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill ink"><i className="pi pi-list" /></div>
          <div className="rp-stat-label">En esta página</div>
          <div className="rp-stat-value">{fmt(companiesList.length)}</div>
          <div className="rp-stat-meta">de {fmt(totalCount)} en total</div>
        </div>
      </div>

      <DataTable
        data={companiesList}
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
        emptyTitle="No se encontraron empresas"
        emptyText={globalFilterValue ? "Prueba con otra búsqueda." : "Registra la primera empresa para empezar."}
        emptyAction={!globalFilterValue && (
          <button className="rp-btn rp-btn-primary" style={{ margin: "0 auto" }} onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nueva empresa
          </button>
        )}
      />

      <CompaniesCreateForm open={createOpen} setOpen={setCreateOpen} setRefresh={setRefresh} />
      <CompaniesEditForm open={editOpen} setOpen={setEditOpen} companyObj={selectedCompany} setRefresh={setRefresh} />
      <CompaniesDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} companyObj={selectedCompany} setRefresh={setRefresh} />
      <CompaniesBulkDeleteDialog open={bulkDeleteOpen} setOpen={setBulkDeleteOpen} ids={selectedIds} onSuccess={onBulkDeleteSuccess} />
    </>
  );
};

// ═══════════════════════════════════════════════════════════
//  TAB 2 — Puntos de Recolección
// ═══════════════════════════════════════════════════════════

const CollectionPointsTab = () => {
  const {
    filters, setFilters, sorting, setSorting,
    pageIndex, setPageIndex, pageSize, setPageSize, refresh, setRefresh,
  } = useCollectionPointsStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const g = filters.global;
    return g && "value" in g ? ((g.value as string) ?? "") : "";
  });
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters, setFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ["collection-points", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
      const { data } = await collectionPointsAPI.getAll({ params });
      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los puntos.");
      return false;
    },
  });

  const pointsList = data?.results ?? [];
  const totalCount = data?.count ?? 0;

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = { ...filters };
    if (!next.global) next.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    if ("value" in next.global) next.global.value = value;
    setFilters(next); setGlobalFilterValue(value); setPageIndex(0);
  };

  const openEdit = (p: CollectionPoint) => { setSelectedPoint(p); setEditOpen(true); };
  const openDelete = (p: CollectionPoint) => { setSelectedPoint(p); setDeleteOpen(true); };

  const columns: ColumnDef<CollectionPoint>[] = [
    {
      id: "point",
      header: "Sede",
      enableSorting: false,
      cell: ({ row: { original: p } }) => (
        <div className="rp-person">
          <div className={`rp-avatar rp-av-${Number(p.id) % 6}`}><i className="pi pi-map-marker" /></div>
          <div>
            <div className="rp-person-name">{p.name}</div>
            <div className="rp-person-id">{p.company_name}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Dirección",
      cell: ({ row: { original: p } }) => (
        <div>
          <div style={{ fontWeight: 500 }}>{p.address}</div>
          <div className="rp-person-id">{p.municipality}, {p.department}</div>
        </div>
      ),
    },
    {
      id: "contact",
      header: "Contacto Sede",
      enableSorting: false,
      cell: ({ row: { original: p } }) => (
        <span>{p.contact_name ?? "—"}{p.contact_phone ? ` · ${p.contact_phone}` : ""}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      align: "right",
      cell: ({ row: { original: p } }) => (
        <div className="rp-row-actions">
          <button className="rp-act" title="Editar" onClick={() => openEdit(p)}><i className="pi pi-pencil" /></button>
          <button className="rp-act danger" title="Eliminar" onClick={() => openDelete(p)}><i className="pi pi-trash" /></button>
        </div>
      ),
    },
  ];

  const toolbar = (
    <>
      <input className="rp-search" value={globalFilterValue} onChange={onGlobalFilterChange}
        placeholder="Buscar punto de recolección…" />
      {globalFilterValue && (
        <span className="rp-chip active" onClick={() => onGlobalFilterChange({ target: { value: "" } } as ChangeEvent<HTMLInputElement>)}>
          Búsqueda: "{globalFilterValue}" <span className="remove">×</span>
        </span>
      )}
    </>
  );

  return (
    <>
      <div className="rp-header">
        <div>
          <h1 className="rp-title">Puntos de Recolección <span className="count">{fmt(totalCount)} registrados</span></h1>
          <p className="rp-sub">Sedes vinculadas a las empresas del programa.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nuevo punto
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill lime"><i className="pi pi-map-marker" /></div>
          <div className="rp-stat-label">Total puntos</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Registrados</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill ink"><i className="pi pi-list" /></div>
          <div className="rp-stat-label">En esta página</div>
          <div className="rp-stat-value">{fmt(pointsList.length)}</div>
          <div className="rp-stat-meta">de {fmt(totalCount)} en total</div>
        </div>
      </div>

      <DataTable
        data={pointsList}
        columns={columns}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageSizeChange={setPageSize}
        onPageChange={setPageIndex}
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={isLoading}
        header={toolbar}
        emptyTitle="No se encontraron puntos de recolección"
        emptyText={globalFilterValue ? "Prueba con otra búsqueda." : "Registra el primer punto para empezar."}
        emptyAction={!globalFilterValue && (
          <button className="rp-btn rp-btn-primary" style={{ margin: "0 auto" }} onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nuevo punto
          </button>
        )}
      />

      <CollectionPointsCreateForm open={createOpen} setOpen={setCreateOpen} setRefresh={setRefresh} />
      <CollectionPointsEditForm open={editOpen} setOpen={setEditOpen} pointObj={selectedPoint} setRefresh={setRefresh} />
      <CollectionPointsDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} pointObj={selectedPoint} setRefresh={setRefresh} />
    </>
  );
};

// ═══════════════════════════════════════════════════════════
//  TAB 3 — Solicitudes de Recolección
// ═══════════════════════════════════════════════════════════

const CollectionRequestsTab = () => {
  const {
    filters, setFilters, sorting, setSorting,
    pageIndex, setPageIndex, pageSize, setPageSize, refresh, setRefresh,
  } = useCollectionRequestsStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const g = filters.global;
    return g && "value" in g ? ((g.value as string) ?? "") : "";
  });
  const [selectedRequest, setSelectedRequest] = useState<CollectionRequest | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters, setFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ["collection-requests", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
      const { data } = await collectionRequestsAPI.getAll({ params });
      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar las solicitudes.");
      return false;
    },
  });

  const requestsList = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const pendingCount = requestsList.filter((r) => r.status === "PENDING").length;
  const collectedCount = requestsList.filter((r) => r.status === "COLLECTED").length;
  const totalWeight = requestsList.reduce((acc, r) => acc + parseFloat(r.estimated_weight_kg || "0"), 0);

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = { ...filters };
    if (!next.global) next.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    if ("value" in next.global) next.global.value = value;
    setFilters(next); setGlobalFilterValue(value); setPageIndex(0);
  };

  const openEdit = (r: CollectionRequest) => { setSelectedRequest(r); setEditOpen(true); };
  const openDelete = (r: CollectionRequest) => { setSelectedRequest(r); setDeleteOpen(true); };

  const columns: ColumnDef<CollectionRequest>[] = [
    {
      id: "request",
      header: "Solicitud",
      enableSorting: false,
      cell: ({ row: { original: r } }) => (
        <div className="rp-person">
          <div className={`rp-avatar rp-av-${Number(r.id) % 6}`}><i className="pi pi-replay" /></div>
          <div>
            <div className="rp-person-name">Solicitud #{r.id}</div>
            <div className="rp-person-id">{r.collection_point_name} · {r.company_name}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "estimated_weight_kg",
      header: "Peso (kg)",
      cell: ({ row: { original: r } }) => (
        <span style={{ fontWeight: 600, color: "var(--rp-ink)" }}>{parseFloat(r.estimated_weight_kg).toFixed(2)} kg</span>
      ),
    },
    {
      accessorKey: "scheduled_date",
      header: "Fecha Programada",
      cell: ({ row: { original: r } }) => formatDate(r.scheduled_date),
    },
    {
      id: "driver",
      header: "Conductor",
      enableSorting: false,
      cell: ({ row: { original: r } }) => (
        <span>{r.driver_name || "—"}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row: { original: r } }) => {
        const st = STATUS[r.status] ?? { label: r.status, cls: "inactive" };
        return <span className={`rp-badge ${st.cls}`}><span className="dot" /> {st.label}</span>;
      },
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      align: "right",
      cell: ({ row: { original: r } }) => (
        <div className="rp-row-actions">
          <button className="rp-act" title="Editar" onClick={() => openEdit(r)}><i className="pi pi-pencil" /></button>
          <button className="rp-act danger" title="Eliminar" onClick={() => openDelete(r)}><i className="pi pi-trash" /></button>
        </div>
      ),
    },
  ];

  const toolbar = (
    <>
      <input className="rp-search" value={globalFilterValue} onChange={onGlobalFilterChange}
        placeholder="Buscar solicitud…" />
      {globalFilterValue && (
        <span className="rp-chip active" onClick={() => onGlobalFilterChange({ target: { value: "" } } as ChangeEvent<HTMLInputElement>)}>
          Búsqueda: "{globalFilterValue}" <span className="remove">×</span>
        </span>
      )}
    </>
  );

  return (
    <>
      <div className="rp-header">
        <div>
          <h1 className="rp-title">Solicitudes <span className="count">{fmt(totalCount)} registradas</span></h1>
          <p className="rp-sub">Pipeline de solicitudes de recolección de tapas.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nueva solicitud
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill pink"><i className="pi pi-replay" /></div>
          <div className="rp-stat-label">Total solicitudes</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Registradas</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill teal"><i className="pi pi-box" /></div>
          <div className="rp-stat-label">Peso en esta página</div>
          <div className="rp-stat-value">{totalWeight.toFixed(1)} kg</div>
          <div className="rp-stat-meta">{fmt(requestsList.length)} solicitudes</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill lime"><i className="pi pi-check-circle" /></div>
          <div className="rp-stat-label">Recolectadas</div>
          <div className="rp-stat-value">{fmt(collectedCount)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill ink"><i className="pi pi-clock" /></div>
          <div className="rp-stat-label">Pendientes</div>
          <div className="rp-stat-value">{fmt(pendingCount)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
      </div>

      <DataTable
        data={requestsList}
        columns={columns}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageSizeChange={setPageSize}
        onPageChange={setPageIndex}
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={isLoading}
        header={toolbar}
        emptyTitle="No se encontraron solicitudes"
        emptyText={globalFilterValue ? "Prueba con otra búsqueda." : "Crea la primera solicitud para empezar."}
        emptyAction={!globalFilterValue && (
          <button className="rp-btn rp-btn-primary" style={{ margin: "0 auto" }} onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nueva solicitud
          </button>
        )}
      />

      <CollectionRequestsCreateForm open={createOpen} setOpen={setCreateOpen} setRefresh={setRefresh} />
      <CollectionRequestsEditForm open={editOpen} setOpen={setEditOpen} requestObj={selectedRequest} setRefresh={setRefresh} />
      <CollectionRequestsDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} requestObj={selectedRequest} setRefresh={setRefresh} />
    </>
  );
};

// ═══════════════════════════════════════════════════════════
//  MAIN PAGE — TabView
// ═══════════════════════════════════════════════════════════

export const CapCollectionPage = () => {
  return (
    <div className="rp">
      <TabView>
        <TabPanel header="Empresas" leftIcon="pi pi-building mr-2">
          <CompaniesTab />
        </TabPanel>
        <TabPanel header="Puntos de Recolección" leftIcon="pi pi-map-marker mr-2">
          <CollectionPointsTab />
        </TabPanel>
        <TabPanel header="Solicitudes" leftIcon="pi pi-replay mr-2">
          <CollectionRequestsTab />
        </TabPanel>
      </TabView>
    </div>
  );
};

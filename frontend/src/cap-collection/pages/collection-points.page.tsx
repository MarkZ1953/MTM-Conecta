import { useEffect, useState, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DataTable,
  FilterMatchMode,
  toast,
  type ColumnDef,
  type DataTableFilterMeta,
} from "@/components";
import { buildQueryParams } from "@/utils";
import { collectionPointsAPI } from "../cap-collection.api";
import { useCollectionPointsStore } from "../cap-collection.store";
import type { CollectionPoint } from "../cap-collection.types";
import {
  CollectionPointsCreateForm,
  CollectionPointsEditForm,
  CollectionPointsDeleteDialog,
} from "../components/forms";
import "@/components/ui/resource-page.css";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);

export const CollectionPointsPage = () => {
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
    <div className="rp">
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
    </div>
  );
};

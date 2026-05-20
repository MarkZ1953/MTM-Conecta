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
import { evidenceAPI } from "./evidence.api";
import { useEvidenceStore } from "./evidence.store";
import type { Evidence } from "./evidence.types";
import {
  EvidenceBulkDeleteDialog,
  EvidenceCreateForm,
  EvidenceDeleteDialog,
  EvidenceEditForm,
} from "./components/forms";
import "@/components/ui/resource-page.css";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);
const truncate = (text: string, max = 60) =>
  !text ? "—" : text.length > max ? text.slice(0, max) + "…" : text;

export const EvidencesPage = () => {
  const {
    filters, setFilters, sorting, setSorting,
    pageIndex, setPageIndex, pageSize, setPageSize, refresh, setRefresh,
  } = useEvidenceStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const g = filters.global;
    return g && "value" in g ? ((g.value as string) ?? "") : "";
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters, setFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ["evidences", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
      const { data } = await evidenceAPI.getAll({ params });
      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar las evidencias.");
      return false;
    },
  });

  const evidenceList = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, s]) => s).map(([id]) => Number(id)).filter(Number.isFinite),
    [rowSelection],
  );

  const withFile = evidenceList.filter((e) => e.file).length;
  const withoutFile = evidenceList.length - withFile;

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = { ...filters };
    if (!next.global) next.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    if ("value" in next.global) next.global.value = value;
    setFilters(next); setGlobalFilterValue(value); setPageIndex(0);
  };

  const openEdit = (e: Evidence) => { setSelectedEvidence(e); setEditOpen(true); };
  const openDelete = (e: Evidence) => { setSelectedEvidence(e); setDeleteOpen(true); };
  const onBulkDeleteSuccess = () => { setRowSelection({}); setRefresh((p) => !p); };

  const columns: ColumnDef<Evidence>[] = [
    {
      id: "evidencia",
      header: "Evidencia",
      enableSorting: false,
      cell: ({ row: { original: e } }) => (
        <div className="rp-person">
          <div className={`rp-avatar rp-av-${Number(e.id) % 6}`}><i className="pi pi-image" /></div>
          <div>
            <div className="rp-person-name">Evidencia #{e.id}</div>
            <div className="rp-person-id">Archivo</div>
          </div>
        </div>
      ),
    },
    {
      id: "event",
      header: "Evento",
      enableSorting: false,
      cell: ({ row: { original: e } }) => <span className="rp-badge inactive"><span className="dot" /> Evento #{e.event}</span>,
    },
    {
      id: "description",
      header: "Descripción",
      enableSorting: false,
      cell: ({ row: { original: e } }) => truncate(e.description),
    },
    {
      id: "file",
      header: "Archivo",
      enableSorting: false,
      cell: ({ row: { original: e } }) =>
        e.file
          ? <a className="rp-badge active" href={e.file} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}><span className="dot" /> Ver archivo</a>
          : <span className="rp-badge pending"><span className="dot" /> Sin archivo</span>,
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
        placeholder="Buscar evidencia…" />
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
          <h1 className="rp-title">Evidencias <span className="count">{fmt(totalCount)} registradas</span></h1>
          <p className="rp-sub">Fotos y archivos que documentan las actividades.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nueva evidencia
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill teal"><i className="pi pi-images" /></div>
          <div className="rp-stat-label">Total evidencias</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Registradas</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill lime"><i className="pi pi-list" /></div>
          <div className="rp-stat-label">En esta página</div>
          <div className="rp-stat-value">{fmt(evidenceList.length)}</div>
          <div className="rp-stat-meta">de {fmt(totalCount)} en total</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill ink"><i className="pi pi-check-circle" /></div>
          <div className="rp-stat-label">Con archivo</div>
          <div className="rp-stat-value">{fmt(withFile)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill pink"><i className="pi pi-exclamation-circle" /></div>
          <div className="rp-stat-label">Sin archivo</div>
          <div className="rp-stat-value">{fmt(withoutFile)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
      </div>

      <DataTable
        data={evidenceList}
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
        emptyTitle="No se encontraron evidencias"
        emptyText={globalFilterValue ? "Prueba con otra búsqueda." : "Sube la primera evidencia para empezar."}
        emptyAction={!globalFilterValue && (
          <button className="rp-btn rp-btn-primary" style={{ margin: "0 auto" }} onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nueva evidencia
          </button>
        )}
      />

      <EvidenceCreateForm open={createOpen} setOpen={setCreateOpen} setRefresh={setRefresh} />
      <EvidenceEditForm open={editOpen} setOpen={setEditOpen} evidenceObj={selectedEvidence} setRefresh={setRefresh} />
      <EvidenceDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} evidenceObj={selectedEvidence} setRefresh={setRefresh} />
      <EvidenceBulkDeleteDialog open={bulkDeleteOpen} setOpen={setBulkDeleteOpen} ids={selectedIds} onSuccess={onBulkDeleteSuccess} />
    </div>
  );
};

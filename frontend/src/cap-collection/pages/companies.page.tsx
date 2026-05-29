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
import { companiesAPI } from "../cap-collection.api";
import { useCompaniesStore } from "../cap-collection.store";
import type { Company } from "../cap-collection.types";
import {
  CompaniesCreateForm,
  CompaniesEditForm,
  CompaniesDeleteDialog,
  CompaniesBulkDeleteDialog,
} from "../components/forms";
import "@/components/ui/resource-page.css";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);

export const CompaniesPage = () => {
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
    <div className="rp">
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
    </div>
  );
};

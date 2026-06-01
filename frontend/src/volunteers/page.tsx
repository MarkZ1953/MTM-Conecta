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
import { volunteersAPI } from "./volunteers.api";
import { useVolunteersStore } from "./volunteers.store";
import type { Volunteer } from "./volunteers.types";
import {
  VolunteersBulkDeleteDialog,
  VolunteersCreateForm,
  VolunteersDeleteDialog,
  VolunteersEditForm,
} from "./components/forms";
import "@/components/ui/resource-page.css";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Postulado", cls: "pending" },
  INTERVIEWED: { label: "Entrevistado", cls: "info" },
  APPROVED: { label: "Aprobado", cls: "active" },
  REJECTED: { label: "Rechazado", cls: "inactive" },
  INACTIVE: { label: "Inactivo", cls: "completed" },
};

const AREA_STYLES: Record<string, { label: string; cls: string }> = {
  TECHNICAL: { label: "Soporte Técnico", cls: "lime" },
  SOCIAL: { label: "Gestión Social", cls: "teal" },
};

const getVolunteerDisplayName = (v: Volunteer) =>
  `${v.first_name} ${v.last_name}`.trim();

const initials = (v: Volunteer) => {
  const displayName = getVolunteerDisplayName(v);
  return displayName.split(" ").map((word) => word[0]).slice(0, 2).join("").toUpperCase();
};

const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);

export const VolunteersPage = () => {
  const {
    filters, setFilters, sorting, setSorting,
    pageIndex, setPageIndex, pageSize, setPageSize, refresh, setRefresh,
  } = useVolunteersStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const g = filters.global;
    return g && "value" in g ? ((g.value as string) ?? "") : "";
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters, setFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ["volunteers", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
      const { data } = await volunteersAPI.getAll({ params });
      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los voluntarios.");
      return false;
    },
  });

  const volunteersList = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, s]) => s).map(([id]) => Number(id)).filter(Number.isFinite),
    [rowSelection],
  );

  // Dynamic statistics
  const pendingCount = volunteersList.filter((v) => v.status === "PENDING").length;
  const approvedCount = volunteersList.filter((v) => v.status === "APPROVED").length;
  const totalHours = volunteersList.reduce((acc, v) => acc + (Number(v.total_hours_spent) || 0), 0);

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = { ...filters };
    if (!next.global) next.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    if ("value" in next.global) next.global.value = value;
    setFilters(next); setGlobalFilterValue(value); setPageIndex(0);
  };

  const openEdit = (v: Volunteer) => { setSelectedVolunteer(v); setEditOpen(true); };
  const openDelete = (v: Volunteer) => { setSelectedVolunteer(v); setDeleteOpen(true); };
  const onBulkDeleteSuccess = () => { setRowSelection({}); setRefresh((p) => !p); };

  const columns: ColumnDef<Volunteer>[] = [
    {
      accessorKey: "first_name",
      header: "Voluntario",
      cell: ({ row: { original: v } }) => (
        <div className="rp-person">
          <div className={`rp-avatar rp-av-${Number(v.id) % 6}`}>{initials(v)}</div>
          <div>
            <div className="rp-person-name">{getVolunteerDisplayName(v)}</div>
            <div className="rp-person-id">ID #{v.id} · C.C. {v.identification_number}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "profession",
      header: "Profesión / Oficio",
      cell: ({ row: { original: v } }) => (
        <span style={{ fontWeight: 500, color: "var(--rp-ink)" }}>{v.profession}</span>
      ),
    },
    {
      accessorKey: "support_area",
      header: "Área de Interés",
      cell: ({ row: { original: v } }) => {
        const area = AREA_STYLES[v.support_area] ?? { label: v.support_area, cls: "info" };
        return (
          <span className={`rp-badge ${area.cls}`}>
            <span className="dot" /> {area.label}
          </span>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Contacto",
      cell: ({ row: { original: v } }) => (
        <div>
          <div style={{ fontWeight: 500 }}>{v.email}</div>
          <div className="rp-person-id">{v.phone}</div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row: { original: v } }) => {
        const stat = STATUS_STYLES[v.status] ?? { label: v.status, cls: "pending" };
        return (
          <span className={`rp-badge ${stat.cls}`}>
            <span className="dot" /> {stat.label}
          </span>
        );
      },
    },
    {
      accessorKey: "total_hours_spent",
      header: "Horas Dedicadas",
      cell: ({ row: { original: v } }) => (
        <span style={{ fontWeight: 600, color: "var(--primary-color, #3B82F6)" }}>
          {fmt(Number(v.total_hours_spent) || 0)} hs
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      align: "right",
      cell: ({ row: { original: v } }) => (
        <div className="rp-row-actions">
          <button className="rp-act" title="Editar" onClick={() => openEdit(v)}><i className="pi pi-pencil" /></button>
          <button className="rp-act danger" title="Eliminar" onClick={() => openDelete(v)}><i className="pi pi-trash" /></button>
        </div>
      ),
    },
  ];

  const toolbar = (
    <>
      <input className="rp-search" value={globalFilterValue} onChange={onGlobalFilterChange}
        placeholder="Buscar por nombre, correo, profesión…" />
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
          <h1 className="rp-title">Voluntarios <span className="count">{fmt(totalCount)} registrados</span></h1>
          <p className="rp-sub">Portal administrativo para la gestión de postulantes, disponibilidad horaria y tareas de voluntariado.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nuevo voluntario
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill pink"><i className="pi pi-users" /></div>
          <div className="rp-stat-label">Total registrados</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Voluntarios en base</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill lime"><i className="pi pi-clock" /></div>
          <div className="rp-stat-label">Horas acumuladas</div>
          <div className="rp-stat-value">{isLoading ? "—" : `${fmt(totalHours)} hs`}</div>
          <div className="rp-stat-meta">Dedicación total</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill teal"><i className="pi pi-user-plus" /></div>
          <div className="rp-stat-label">Postulados</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(pendingCount)}</div>
          <div className="rp-stat-meta">Pendientes de entrevista</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill ink"><i className="pi pi-check-circle" /></div>
          <div className="rp-stat-label">Aprobados</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(approvedCount)}</div>
          <div className="rp-stat-meta">Listos para tareas</div>
        </div>
      </div>

      <DataTable
        data={volunteersList}
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
        emptyTitle="No se encontraron voluntarios"
        emptyText={globalFilterValue ? "Prueba con otra búsqueda." : "Registra la primera postulación pública para empezar."}
        emptyAction={!globalFilterValue && (
          <button className="rp-btn rp-btn-primary" style={{ margin: "0 auto" }} onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nuevo voluntario
          </button>
        )}
      />

      <VolunteersCreateForm open={createOpen} setOpen={setCreateOpen} setRefresh={setRefresh} />
      <VolunteersEditForm open={editOpen} setOpen={setEditOpen} volunteerObj={selectedVolunteer} setRefresh={setRefresh} />
      <VolunteersDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} volunteerObj={selectedVolunteer} setRefresh={setRefresh} />
      <VolunteersBulkDeleteDialog open={bulkDeleteOpen} setOpen={setBulkDeleteOpen} ids={selectedIds} onSuccess={onBulkDeleteSuccess} />
    </div>
  );
};

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
import { attendanceAPI } from "./attendance.api";
import { useAttendanceStore } from "./attendance.store";
import type { Attendance } from "./attendance.types";
import {
  AttendanceBulkDeleteDialog,
  AttendanceCreateForm,
  AttendanceDeleteDialog,
  AttendanceEditForm,
} from "./components/forms";
import "@/components/ui/resource-page.css";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);

export const AttendancePage = () => {
  const {
    filters, setFilters, sorting, setSorting,
    pageIndex, setPageIndex, pageSize, setPageSize, refresh, setRefresh,
  } = useAttendanceStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const g = filters.global;
    return g && "value" in g ? ((g.value as string) ?? "") : "";
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters, setFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ["attendance", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
      const { data } = await attendanceAPI.getAll({ params });
      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudo cargar la asistencia.");
      return false;
    },
  });

  const attendanceList = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, s]) => s).map(([id]) => Number(id)).filter(Number.isFinite),
    [rowSelection],
  );

  const attendedCount = attendanceList.filter((a) => a.attended).length;
  const absentCount = attendanceList.length - attendedCount;

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = { ...filters };
    if (!next.global) next.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    if ("value" in next.global) next.global.value = value;
    setFilters(next); setGlobalFilterValue(value); setPageIndex(0);
  };

  const openEdit = (a: Attendance) => { setSelectedAttendance(a); setEditOpen(true); };
  const openDelete = (a: Attendance) => { setSelectedAttendance(a); setDeleteOpen(true); };
  const onBulkDeleteSuccess = () => { setRowSelection({}); setRefresh((p) => !p); };

  const columns: ColumnDef<Attendance>[] = [
    {
      id: "registro",
      header: "Registro",
      enableSorting: false,
      cell: ({ row: { original: a } }) => (
        <div className="rp-person">
          <div className={`rp-avatar rp-av-${Number(a.id) % 6}`}><i className="pi pi-check-square" /></div>
          <div>
            <div className="rp-person-name">Asistencia #{a.id}</div>
            <div className="rp-person-id">Registro</div>
          </div>
        </div>
      ),
    },
    {
      id: "beneficiary",
      header: "Beneficiario",
      enableSorting: false,
      cell: ({ row: { original: a } }) => <span className="rp-badge inactive"><span className="dot" /> Benef. #{a.beneficiary}</span>,
    },
    {
      id: "event",
      header: "Evento",
      enableSorting: false,
      cell: ({ row: { original: a } }) => <span className="rp-badge inactive"><span className="dot" /> Evento #{a.event}</span>,
    },
    {
      id: "attended",
      header: "Asistió",
      enableSorting: false,
      cell: ({ row: { original: a } }) =>
        a.attended
          ? <span className="rp-badge active"><span className="dot" /> Sí asistió</span>
          : <span className="rp-badge failed"><span className="dot" /> No asistió</span>,
    },
    {
      id: "notes",
      header: "Notas",
      enableSorting: false,
      cell: ({ row: { original: a } }) => a.notes || "—",
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
        placeholder="Buscar asistencia…" />
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
          <h1 className="rp-title">Asistencia a eventos <span className="count">{fmt(totalCount)} registros</span></h1>
          <p className="rp-sub">Control de asistencia de beneficiarios a las actividades.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Registrar asistencia
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill teal"><i className="pi pi-check-square" /></div>
          <div className="rp-stat-label">Total registros</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Asistencias registradas</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill lime"><i className="pi pi-list" /></div>
          <div className="rp-stat-label">En esta página</div>
          <div className="rp-stat-value">{fmt(attendanceList.length)}</div>
          <div className="rp-stat-meta">de {fmt(totalCount)} en total</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill ink"><i className="pi pi-check-circle" /></div>
          <div className="rp-stat-label">Asistieron</div>
          <div className="rp-stat-value">{fmt(attendedCount)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill pink"><i className="pi pi-times-circle" /></div>
          <div className="rp-stat-label">No asistieron</div>
          <div className="rp-stat-value">{fmt(absentCount)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
      </div>

      <DataTable
        data={attendanceList}
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
        emptyTitle="No se encontraron registros de asistencia"
        emptyText={globalFilterValue ? "Prueba con otra búsqueda." : "Registra la primera asistencia para empezar."}
        emptyAction={!globalFilterValue && (
          <button className="rp-btn rp-btn-primary" style={{ margin: "0 auto" }} onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Registrar asistencia
          </button>
        )}
      />

      <AttendanceCreateForm open={createOpen} setOpen={setCreateOpen} setRefresh={setRefresh} />
      <AttendanceEditForm open={editOpen} setOpen={setEditOpen} attendanceObj={selectedAttendance} setRefresh={setRefresh} />
      <AttendanceDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} attendanceObj={selectedAttendance} setRefresh={setRefresh} />
      <AttendanceBulkDeleteDialog open={bulkDeleteOpen} setOpen={setBulkDeleteOpen} ids={selectedIds} onSuccess={onBulkDeleteSuccess} />
    </div>
  );
};

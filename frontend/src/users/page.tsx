import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DataTable,
  FilterMatchMode,
  FilterOperator,
  toast,
  type ColumnDef,
  type DataTableFilterMeta,
} from "@/components";
import { buildQueryParams } from "@/utils";
import { usersAPI } from "./users.api";
import { useUsersStore } from "./users.store";
import type { User, UserGroup } from "./users.types";
import {
  UsersBulkDeleteDialog,
  UsersCreateForm,
  UsersDeleteDialog,
  UsersEditForm,
  UsersEditPasswordForm,
} from "./components/forms";
import "@/components/ui/resource-page.css";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  username: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  first_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  last_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
};

const initials = (u: User) =>
  `${u.first_name?.[0] ?? u.username?.[0] ?? ""}${u.last_name?.[0] ?? ""}`.toUpperCase();
const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);
const roleNames = (groups?: Array<string | UserGroup>) =>
  (groups ?? []).map((g) => (typeof g === "string" ? g : g.name));

export const UsersPage = () => {
  const {
    filters, setFilters, sorting, setSorting,
    pageIndex, setPageIndex, pageSize, setPageSize, refresh, setRefresh,
  } = useUsersStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const g = filters.global;
    return g && "value" in g ? ((g.value as string) ?? "") : "";
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters, setFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ["users", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
      const { data } = await usersAPI.getAll({ params });
      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los usuarios.");
      return false;
    },
  });

  const usersList = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, s]) => s).map(([id]) => Number(id)).filter(Number.isFinite),
    [rowSelection],
  );

  const activeCount = usersList.filter((u) => u.is_active !== false).length;
  const withRole = usersList.filter((u) => roleNames(u.groups).length > 0).length;

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = { ...filters };
    if (!next.global) next.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    if ("value" in next.global) next.global.value = value;
    setFilters(next); setGlobalFilterValue(value); setPageIndex(0);
  };

  const openEdit = (u: User) => { setSelectedUser(u); setEditOpen(true); };
  const openPassword = (u: User) => { setSelectedUser(u); setPasswordOpen(true); };
  const openDelete = (u: User) => { setSelectedUser(u); setDeleteOpen(true); };
  const onBulkDeleteSuccess = () => { setRowSelection({}); setRefresh((p) => !p); };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: "Usuario",
      cell: ({ row: { original: u } }) => (
        <div className="rp-person">
          <div className={`rp-avatar rp-av-${Number(u.id) % 6}`}>{initials(u)}</div>
          <div>
            <div className="rp-person-name">{u.first_name} {u.last_name}</div>
            <div className="rp-person-id">@{u.username}</div>
          </div>
        </div>
      ),
    },
    { accessorKey: "email", header: "Correo" },
    {
      id: "roles",
      header: "Roles",
      enableSorting: false,
      cell: ({ row: { original: u } }) => {
        const roles = roleNames(u.groups);
        if (roles.length === 0) return <span className="rp-badge inactive"><span className="dot" /> Sin rol</span>;
        return (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {roles.map((r) => <span key={r} className="rp-badge upcoming">{r}</span>)}
          </div>
        );
      },
    },
    {
      id: "estado",
      header: "Estado",
      enableSorting: false,
      cell: ({ row: { original: u } }) =>
        u.is_active !== false
          ? <span className="rp-badge active"><span className="dot" /> Activo</span>
          : <span className="rp-badge inactive"><span className="dot" /> Inactivo</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      align: "right",
      cell: ({ row: { original: u } }) => (
        <div className="rp-row-actions">
          <button className="rp-act" title="Editar" onClick={() => openEdit(u)}><i className="pi pi-pencil" /></button>
          <button className="rp-act" title="Cambiar contraseña" onClick={() => openPassword(u)}><i className="pi pi-key" /></button>
          <button className="rp-act danger" title="Eliminar" onClick={() => openDelete(u)}><i className="pi pi-trash" /></button>
        </div>
      ),
    },
  ];

  const toolbar = (
    <>
      <input className="rp-search" value={globalFilterValue} onChange={onGlobalFilterChange}
        placeholder="Buscar por usuario, nombre o correo…" />
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
          <h1 className="rp-title">Usuarios <span className="count">{fmt(totalCount)} registrados</span></h1>
          <p className="rp-sub">Cuentas de acceso al sistema y sus roles.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nuevo usuario
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill teal"><i className="pi pi-users" /></div>
          <div className="rp-stat-label">Total registrados</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Cuentas en el sistema</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill lime"><i className="pi pi-list" /></div>
          <div className="rp-stat-label">En esta página</div>
          <div className="rp-stat-value">{fmt(usersList.length)}</div>
          <div className="rp-stat-meta">de {fmt(totalCount)} en total</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill ink"><i className="pi pi-check-circle" /></div>
          <div className="rp-stat-label">Activos</div>
          <div className="rp-stat-value">{fmt(activeCount)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill pink"><i className="pi pi-shield" /></div>
          <div className="rp-stat-label">Con rol asignado</div>
          <div className="rp-stat-value">{fmt(withRole)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
      </div>

      <DataTable
        data={usersList}
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
        emptyTitle="No se encontraron usuarios"
        emptyText={globalFilterValue ? "Prueba con otra búsqueda." : "Crea el primer usuario para empezar."}
        emptyAction={!globalFilterValue && (
          <button className="rp-btn rp-btn-primary" style={{ margin: "0 auto" }} onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nuevo usuario
          </button>
        )}
      />

      <UsersCreateForm open={createOpen} setOpen={setCreateOpen} setRefresh={setRefresh} />
      <UsersEditForm open={editOpen} setOpen={setEditOpen} user={selectedUser} setRefresh={setRefresh} />
      <UsersEditPasswordForm open={passwordOpen} setOpen={setPasswordOpen} user={selectedUser} setRefresh={setRefresh} />
      <UsersDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} user={selectedUser} setRefresh={setRefresh} />
      <UsersBulkDeleteDialog open={bulkDeleteOpen} setOpen={setBulkDeleteOpen} ids={selectedIds} onSuccess={onBulkDeleteSuccess} />
    </div>
  );
};

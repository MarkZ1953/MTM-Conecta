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
import { blogAPI } from "./blog.api";
import { useBlogStore } from "./blog.store";
import type { BlogPost } from "./blog.types";
import {
  BlogBulkDeleteDialog,
  BlogCreateForm,
  BlogDeleteDialog,
  BlogEditForm,
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

const statusLabel = (post: BlogPost) =>
  post.status === "published"
    ? <span className="rp-badge active"><span className="dot" /> Publicado</span>
    : <span className="rp-badge pending"><span className="dot" /> Borrador</span>;

export const BlogAdminPage = () => {
  const {
    filters, setFilters, sorting, setSorting,
    pageIndex, setPageIndex, pageSize, setPageSize, refresh, setRefresh,
  } = useBlogStore();

  const [globalFilterValue, setGlobalFilterValue] = useState(() => {
    const g = filters.global;
    return g && "value" in g ? ((g.value as string) ?? "") : "";
  });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters, setFilters]);

  const { data, isLoading } = useQuery({
    queryKey: ["blog-posts", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
      const { data } = await blogAPI.getAll({ params });
      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar las publicaciones.");
      return false;
    },
  });

  const postsList = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, selected]) => selected).map(([id]) => Number(id)).filter(Number.isFinite),
    [rowSelection],
  );
  const publishedCount = postsList.filter((post) => post.status === "published").length;
  const draftCount = postsList.filter((post) => post.status === "draft").length;

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const next = { ...filters };
    if (!next.global) next.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    if ("value" in next.global) next.global.value = value;
    setFilters(next);
    setGlobalFilterValue(value);
    setPageIndex(0);
  };

  const openEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setEditOpen(true);
  };

  const openDelete = (post: BlogPost) => {
    setSelectedPost(post);
    setDeleteOpen(true);
  };

  const onBulkDeleteSuccess = () => {
    setRowSelection({});
    setRefresh((prev) => !prev);
  };

  const columns: ColumnDef<BlogPost>[] = [
    {
      accessorKey: "title",
      header: "Publicación",
      cell: ({ row: { original: post } }) => (
        <div className="rp-person">
          <div
            className={`rp-avatar rp-av-${Number(post.id) % 6}`}
            style={post.image_url ? { backgroundImage: `url(${post.image_url})`, backgroundSize: "cover" } : undefined}
          >
            {!post.image_url && <i className="pi pi-book" />}
          </div>
          <div>
            <div className="rp-person-name">{post.title}</div>
            <div className="rp-person-id">/{post.slug}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "published_at",
      header: "Fecha",
      cell: ({ row: { original: post } }) => formatDate(post.published_at),
    },
    {
      accessorKey: "summary",
      header: "Resumen",
      enableSorting: false,
      cell: ({ row: { original: post } }) => (
        <span style={{ color: "var(--rp-muted)", display: "block", maxWidth: 420 }}>
          {post.summary}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row: { original: post } }) => statusLabel(post),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      align: "right",
      cell: ({ row: { original: post } }) => (
        <div className="rp-row-actions">
          <button className="rp-act" title="Editar" onClick={() => openEdit(post)}><i className="pi pi-pencil" /></button>
          <button className="rp-act danger" title="Eliminar" onClick={() => openDelete(post)}><i className="pi pi-trash" /></button>
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
        placeholder="Buscar por título, resumen o contenido..."
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
          <h1 className="rp-title">Blog <span className="count">{fmt(totalCount)} publicaciones</span></h1>
          <p className="rp-sub">Historias, noticias institucionales y contenido editorial de la fundación.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nueva publicación
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill teal"><i className="pi pi-book" /></div>
          <div className="rp-stat-label">Total publicaciones</div>
          <div className="rp-stat-value">{isLoading ? "—" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Registradas</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill lime"><i className="pi pi-check-circle" /></div>
          <div className="rp-stat-label">Publicadas</div>
          <div className="rp-stat-value">{fmt(publishedCount)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill pink"><i className="pi pi-pencil" /></div>
          <div className="rp-stat-label">Borradores</div>
          <div className="rp-stat-value">{fmt(draftCount)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill ink"><i className="pi pi-list" /></div>
          <div className="rp-stat-label">En esta página</div>
          <div className="rp-stat-value">{fmt(postsList.length)}</div>
          <div className="rp-stat-meta">de {fmt(totalCount)} en total</div>
        </div>
      </div>

      <DataTable
        data={postsList}
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
        emptyTitle="No se encontraron publicaciones"
        emptyText={globalFilterValue ? "Prueba con otra búsqueda." : "Crea la primera publicación para empezar."}
        emptyAction={!globalFilterValue && (
          <button className="rp-btn rp-btn-primary" style={{ margin: "0 auto" }} onClick={() => setCreateOpen(true)}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nueva publicación
          </button>
        )}
      />

      <BlogCreateForm
        open={createOpen}
        setOpen={setCreateOpen}
        setRefresh={setRefresh}
        onSuccess={() => setPageIndex(0)}
      />
      <BlogEditForm open={editOpen} setOpen={setEditOpen} post={selectedPost} setRefresh={setRefresh} />
      <BlogDeleteDialog open={deleteOpen} setOpen={setDeleteOpen} post={selectedPost} setRefresh={setRefresh} />
      <BlogBulkDeleteDialog open={bulkDeleteOpen} setOpen={setBulkDeleteOpen} ids={selectedIds} onSuccess={onBulkDeleteSuccess} />
    </div>
  );
};

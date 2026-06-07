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
import { newsAPI } from "./news.api";
import type { InstagramPost } from "./news.types";
import "@/components/ui/resource-page.css";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
};

const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);

const formatDate = (value?: string | null) => {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return date.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
};

const postImage = (post: InstagramPost) => {
  const child = post.children?.find((item) => item.thumbnail_url || item.media_url);
  return post.thumbnail_url || post.media_url || child?.thumbnail_url || child?.media_url || "";
};

const postTitle = (post: InstagramPost) => {
  const firstLine = post.caption.split(/\r?\n/).find(Boolean)?.trim() || "Publicación de Instagram";
  return firstLine.length > 84 ? `${firstLine.slice(0, 81).trim()}...` : firstLine;
};

const mediaLabel = (type: InstagramPost["media_type"]) => {
  if (type === "VIDEO") return "Reel";
  if (type === "CAROUSEL_ALBUM") return "Carrusel";
  return "Imagen";
};

export const NewsAdminPage = () => {
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [sorting, setSorting] = useState<any[]>([{ id: "timestamp", desc: true }]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [refresh, setRefresh] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (Object.keys(filters).length === 0) setFilters(defaultFilters);
  }, [filters]);

  const { data, isLoading } = useQuery({
    queryKey: ["instagram-posts", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({ columnFilters: filters, sorting, pageIndex, pageSize });
      const { data } = await newsAPI.getAll({ params });
      return data;
    },
    throwOnError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar las noticias.");
      return false;
    },
  });

  const postsList = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const visibleCount = postsList.filter((post) => post.is_visible).length;
  const featuredCount = postsList.filter((post) => post.is_featured).length;

  const onGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilters({
      ...filters,
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue(value);
    setPageIndex(0);
  };

  const togglePost = async (post: InstagramPost, data: Partial<InstagramPost>) => {
    try {
      await newsAPI.update({ id: post.id, data });
      toast.success("Publicación actualizada.");
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar la publicación.");
    }
  };

  const syncInstagram = async () => {
    setSyncing(true);
    try {
      const result = await newsAPI.sync();
      toast.success(`${result.message} ${result.created} nuevas, ${result.updated} actualizadas.`);
      setPageIndex(0);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo sincronizar Instagram.");
    } finally {
      setSyncing(false);
    }
  };

  const columns: ColumnDef<InstagramPost>[] = [
    {
      accessorKey: "caption",
      header: "Publicación",
      cell: ({ row: { original: post } }) => (
        <div className="rp-person">
          <div
            className={`rp-avatar rp-av-${Number(post.id) % 6}`}
            style={postImage(post) ? { backgroundImage: `url(${postImage(post)})`, backgroundSize: "cover" } : undefined}
          >
            {!postImage(post) && <i className="pi pi-instagram" />}
          </div>
          <div>
            <div className="rp-person-name">{postTitle(post)}</div>
            <div className="rp-person-id">{post.instagram_id}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "media_type",
      header: "Formato",
      cell: ({ row: { original: post } }) => mediaLabel(post.media_type),
    },
    {
      accessorKey: "timestamp",
      header: "Fecha",
      cell: ({ row: { original: post } }) => formatDate(post.timestamp),
    },
    {
      accessorKey: "is_visible",
      header: "Estado",
      cell: ({ row: { original: post } }) =>
        post.is_visible
          ? <span className="rp-badge active"><span className="dot" /> Visible</span>
          : <span className="rp-badge pending"><span className="dot" /> Oculta</span>,
    },
    {
      accessorKey: "is_featured",
      header: "Destacada",
      cell: ({ row: { original: post } }) =>
        post.is_featured
          ? <span className="rp-badge active"><span className="dot" /> Sí</span>
          : <span className="rp-badge pending"><span className="dot" /> No</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      align: "right",
      cell: ({ row: { original: post } }) => (
        <div className="rp-row-actions">
          {post.permalink && (
            <a className="rp-act" title="Abrir en Instagram" href={post.permalink} target="_blank" rel="noreferrer">
              <i className="pi pi-external-link" />
            </a>
          )}
          <button
            className="rp-act"
            title={post.is_featured ? "Quitar destacada" : "Marcar destacada"}
            onClick={() => togglePost(post, { is_featured: !post.is_featured })}
          >
            <i className="pi pi-star" />
          </button>
          <button
            className={post.is_visible ? "rp-act danger" : "rp-act"}
            title={post.is_visible ? "Ocultar" : "Mostrar"}
            onClick={() => togglePost(post, { is_visible: !post.is_visible })}
          >
            <i className={post.is_visible ? "pi pi-eye-slash" : "pi pi-eye"} />
          </button>
        </div>
      ),
    },
  ];

  const toolbar = useMemo(() => (
    <>
      <input
        className="rp-search"
        value={globalFilterValue}
        onChange={onGlobalFilterChange}
        placeholder="Buscar por texto o identificador..."
      />
      {globalFilterValue && (
        <span className="rp-chip active" onClick={() => onGlobalFilterChange({ target: { value: "" } } as ChangeEvent<HTMLInputElement>)}>
          Búsqueda: "{globalFilterValue}" <span className="remove">×</span>
        </span>
      )}
    </>
  ), [globalFilterValue, filters]);

  return (
    <div className="rp">
      <div className="rp-header">
        <div>
          <h1 className="rp-title">Noticias <span className="count">{fmt(totalCount)} publicaciones</span></h1>
          <p className="rp-sub">Publicaciones sincronizadas desde Instagram para mostrarlas en la página pública.</p>
        </div>
        <div className="rp-actions">
          <button className="rp-btn rp-btn-primary" onClick={syncInstagram} disabled={syncing}>
            <i className={syncing ? "pi pi-spin pi-spinner" : "pi pi-refresh"} style={{ fontSize: 13 }} />
            {syncing ? "Sincronizando..." : "Sincronizar Instagram"}
          </button>
        </div>
      </div>

      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-pill teal"><i className="pi pi-instagram" /></div>
          <div className="rp-stat-label">Total sincronizadas</div>
          <div className="rp-stat-value">{isLoading ? "--" : fmt(totalCount)}</div>
          <div className="rp-stat-meta">Registradas</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill lime"><i className="pi pi-eye" /></div>
          <div className="rp-stat-label">Visibles</div>
          <div className="rp-stat-value">{fmt(visibleCount)}</div>
          <div className="rp-stat-meta">En esta página</div>
        </div>
        <div className="rp-stat">
          <div className="rp-stat-pill pink"><i className="pi pi-star" /></div>
          <div className="rp-stat-label">Destacadas</div>
          <div className="rp-stat-value">{fmt(featuredCount)}</div>
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
        isLoading={isLoading}
        header={toolbar}
        emptyTitle="No hay publicaciones sincronizadas"
        emptyText="Cuando configuremos Meta, usa el botón de sincronización para traer posts, carruseles y reels."
      />
    </div>
  );
};

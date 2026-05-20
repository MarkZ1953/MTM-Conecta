import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { dashboardAPI, type DashboardMetrics } from "../dashboard.api";
import { eventsAPI } from "@/events";
import type { Event } from "@/events";
import "./dashboard-page.css";

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const eventDateParts = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return { day: "—", month: "" };
  return { day: String(d.getDate()).padStart(2, "0"), month: MONTHS[d.getMonth()] };
};

const eventTimeMeta = (e: Event) => {
  const d = new Date(e.start_date);
  const time = Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  const parts = [time, e.location].filter(Boolean);
  if (e.attendees_count != null) parts.push(`${e.attendees_count} asistentes`);
  return parts.join(" · ");
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("es-CO").format(value || 0);

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
};

export const DashboardPage = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const { data } = await dashboardAPI.getMetrics();
      return data as DashboardMetrics;
    },
    staleTime: 60 * 1000,
  });

  // Próximos eventos: datos reales del endpoint /events/
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ["dashboard-events"],
    queryFn: async () => {
      const { data } = await eventsAPI.getAll({ params: { page: 1, page_size: 50, ordering: "start_date" } });
      return data.results as Event[];
    },
    staleTime: 60 * 1000,
  });

  const upcomingEvents = (eventsData ?? [])
    .filter((e) => {
      const d = new Date(e.start_date);
      return !Number.isNaN(d.getTime()) && d.getTime() >= Date.now();
    })
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, 4);

  const projectsTotal = data?.projects.total ?? 0;
  const inProgress = data?.projects.in_progress ?? 0;
  const finished = data?.projects.finished ?? 0;
  const planned = Math.max(projectsTotal - inProgress - finished, 0);

  const pct = (n: number) => (projectsTotal > 0 ? Math.round((n / projectsTotal) * 100) : 0);
  const inPct = pct(inProgress);
  const plPct = pct(planned);

  const donutGradient =
    projectsTotal > 0
      ? `conic-gradient(var(--d-teal) 0 ${inPct}%, var(--d-lime) ${inPct}% ${inPct + plPct}%, var(--d-pink) ${inPct + plPct}% 100%)`
      : `conic-gradient(#F0F3F5 0 100%)`;

  const kpis = [
    { label: "Beneficiarios activos", value: formatNumber(data?.beneficiaries ?? 0), delta: "Personas con apoyo activo", deltaClass: "flat", icon: "pi-users", tone: "teal" },
    { label: "Donaciones recibidas", value: formatCurrency(data?.donations.total_amount ?? 0), delta: `${formatNumber(data?.donations.count ?? 0)} registradas`, deltaClass: "up", icon: "pi-heart", tone: "pink" },
    { label: "Proyectos en ejecución", value: formatNumber(inProgress), delta: `${formatNumber(projectsTotal)} en total`, deltaClass: "flat", icon: "pi-briefcase", tone: "lime" },
    { label: "Donantes registrados", value: formatNumber(data?.donors ?? 0), delta: "Personas y empresas", deltaClass: "flat", icon: "pi-users", tone: "ink" },
  ];

  return (
    <div className="dash">
      {/* HEADER */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">{greeting()}</h1>
          <p className="dash-sub">Esto es lo que está pasando en la fundación hoy.</p>
        </div>
        <div className="dash-actions">
          <input className="dash-search" placeholder="Buscar beneficiario, donante, evento…" />
          <button className="dash-btn dash-btn-ghost" onClick={() => navigate("/beneficiaries")}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Nuevo
          </button>
          <button className="dash-btn dash-btn-primary" onClick={() => navigate("/reports")}>
            <i className="pi pi-chart-bar" style={{ fontSize: 13 }} /> Reportes
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="dash-kpis">
        {kpis.map((kpi) => (
          <div className="dash-kpi" key={kpi.label}>
            <div className={`dash-kpi-icon ${kpi.tone}`}>
              <i className={`pi ${kpi.icon}`} />
            </div>
            <div className="dash-kpi-label">{kpi.label}</div>
            {isLoading ? (
              <div className="dash-skeleton" style={{ height: 30, width: "60%", margin: "8px 0" }} />
            ) : (
              <div className="dash-kpi-value">{isError ? "—" : kpi.value}</div>
            )}
            {!isLoading && <div className={`dash-kpi-delta ${kpi.deltaClass}`}>{kpi.delta}</div>}
          </div>
        ))}
      </div>

      {/* ROW: CHART + EVENTS */}
      <div className="dash-grid-2">
        {/* Chart */}
        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <h3 className="dash-card-title">Donaciones recibidas</h3>
              <div className="dash-card-sub">Tendencia últimos 6 meses</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="dash-btn-mini">6M</button>
              <button className="dash-btn-mini">1A</button>
              <button className="dash-btn-mini active">Todo</button>
            </div>
          </div>

          <svg viewBox="0 0 600 220" className="dash-chart" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradTeal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2DBFA8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2DBFA8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g stroke="#E6EBEF" strokeDasharray="3,4">
              <line x1="0" y1="40" x2="600" y2="40" />
              <line x1="0" y1="90" x2="600" y2="90" />
              <line x1="0" y1="140" x2="600" y2="140" />
              <line x1="0" y1="190" x2="600" y2="190" />
            </g>
            <path d="M0,160 C60,140 100,90 160,100 C220,110 260,60 320,70 C380,80 420,50 480,40 C540,30 580,55 600,50 L600,220 L0,220 Z" fill="url(#gradTeal)" />
            <path d="M0,160 C60,140 100,90 160,100 C220,110 260,60 320,70 C380,80 420,50 480,40 C540,30 580,55 600,50" fill="none" stroke="#2DBFA8" strokeWidth="2.5" strokeLinecap="round" />
            <g fill="white" stroke="#2DBFA8" strokeWidth="2.5">
              <circle cx="0" cy="160" r="4" />
              <circle cx="120" cy="108" r="4" />
              <circle cx="240" cy="78" r="4" />
              <circle cx="360" cy="70" r="4" />
              <circle cx="480" cy="40" r="4" />
              <circle cx="600" cy="50" r="4" />
            </g>
            <g fill="#6B7C8A" fontSize="11">
              <text x="0" y="215">Dic</text>
              <text x="120" y="215">Ene</text>
              <text x="240" y="215">Feb</text>
              <text x="360" y="215">Mar</text>
              <text x="480" y="215">Abr</text>
              <text x="565" y="215">May</text>
            </g>
          </svg>
        </div>

        {/* Events */}
        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <h3 className="dash-card-title">Próximos eventos</h3>
              <div className="dash-card-sub">Calendario de actividades</div>
            </div>
          </div>
          {eventsLoading ? (
            <div className="dash-events">
              {Array.from({ length: 3 }).map((_, i) => (
                <div className="dash-event-row" key={i}>
                  <div className="dash-skeleton" style={{ width: 46, height: 46, borderRadius: 8 }} />
                  <div style={{ flex: 1 }}>
                    <div className="dash-skeleton" style={{ height: 14, width: "70%", marginBottom: 6 }} />
                    <div className="dash-skeleton" style={{ height: 11, width: "45%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="dash-events">
              {upcomingEvents.map((e) => {
                const { day, month } = eventDateParts(e.start_date);
                return (
                  <div className="dash-event-row" key={e.id}>
                    <div className="dash-event-date">
                      <div className="d">{day}</div>
                      <div className="m">{month}</div>
                    </div>
                    <div>
                      <h4 className="dash-event-title">{e.title}</h4>
                      <div className="dash-event-meta">{eventTimeMeta(e)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="dash-empty">
              <div className="dash-empty-icon"><i className="pi pi-calendar" /></div>
              <p style={{ margin: 0, fontWeight: 600, color: "var(--d-ink)" }}>No hay eventos próximos</p>
              <p style={{ margin: "4px 0 16px", fontSize: 13 }}>Crea un evento y aparecerá aquí.</p>
              <button className="dash-btn dash-btn-primary" style={{ margin: "0 auto" }} onClick={() => navigate("/events")}>
                <i className="pi pi-plus" style={{ fontSize: 13 }} /> Ir a eventos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ROW: ACTIVITY + DISTRIBUTION */}
      <div className="dash-card">
        <div className="dash-activity-grid">
          {/* Activity */}
          <div>
            <div className="dash-card-head" style={{ marginBottom: 10 }}>
              <div>
                <h3 className="dash-card-title">Actividad reciente</h3>
                <div className="dash-card-sub">Últimas acciones en el sistema</div>
              </div>
            </div>
            <div className="dash-empty">
              <div className="dash-empty-icon"><i className="pi pi-clock" /></div>
              <p style={{ margin: 0, fontWeight: 600, color: "var(--d-ink)" }}>Sin actividad reciente</p>
              <p style={{ margin: "4px 0 0", fontSize: 13 }}>
                El registro de acciones se mostrará aquí cuando se active la auditoría de cambios.
              </p>
            </div>
          </div>

          {/* Distribution donut — datos reales de proyectos */}
          <div>
            <div className="dash-card-head" style={{ marginBottom: 10 }}>
              <div>
                <h3 className="dash-card-title">Proyectos por estado</h3>
                <div className="dash-card-sub">Distribución actual</div>
              </div>
            </div>

            {projectsTotal === 0 && !isLoading ? (
              <div className="dash-empty">
                <div className="dash-empty-icon"><i className="pi pi-briefcase" /></div>
                <h4 className="dash-empty-title">Sin proyectos aún</h4>
                <p className="dash-empty-text">La distribución aparecerá cuando se registren proyectos.</p>
              </div>
            ) : (
              <div className="dash-ring-wrap">
                <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
                  <div style={{ width: 130, height: 130, borderRadius: "50%", background: donutGradient }} />
                  <div style={{ position: "absolute", inset: 16, background: "white", borderRadius: "50%", display: "grid", placeItems: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "var(--d-ink)" }}>{formatNumber(projectsTotal)}</div>
                      <div style={{ fontSize: 11, color: "var(--d-muted)" }}>proyectos</div>
                    </div>
                  </div>
                </div>
                <div className="dash-ring-list">
                  <div className="dash-ring-row">
                    <span className="dash-ring-swatch" style={{ background: "var(--d-teal)" }} />
                    <span className="dash-ring-label">En ejecución</span>
                    <span className="dash-ring-value">{formatNumber(inProgress)}</span>
                  </div>
                  <div className="dash-ring-row">
                    <span className="dash-ring-swatch" style={{ background: "var(--d-lime)" }} />
                    <span className="dash-ring-label">Planeados</span>
                    <span className="dash-ring-value">{formatNumber(planned)}</span>
                  </div>
                  <div className="dash-ring-row">
                    <span className="dash-ring-swatch" style={{ background: "var(--d-pink)" }} />
                    <span className="dash-ring-label">Finalizados</span>
                    <span className="dash-ring-value">{formatNumber(finished)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EMPTY STATE: reportes guardados */}
      <div className="dash-card" style={{ marginTop: 18 }}>
        <div className="dash-card-head">
          <div>
            <h3 className="dash-card-title">Reportes guardados</h3>
            <div className="dash-card-sub">Tus reportes recientes aparecerán aquí</div>
          </div>
        </div>
        <div className="dash-empty">
          <div className="dash-empty-icon"><i className="pi pi-file" /></div>
          <h4 className="dash-empty-title">Aún no tienes reportes guardados</h4>
          <p className="dash-empty-text">Genera tu primer reporte y se mostrará aquí para consultarlo después.</p>
          <button className="dash-btn dash-btn-primary" style={{ margin: "0 auto" }} onClick={() => navigate("/reports")}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} /> Crear reporte
          </button>
        </div>
      </div>

      {/* BANNER */}
      <div className="dash-note">
        <div>
          <h3>El sistema registra todo</h3>
          <p>Cada acción queda en el módulo de Auditoría — trazabilidad completa para tu equipo y la junta directiva.</p>
        </div>
        <button className="dash-btn dash-btn-ghost" style={{ background: "white" }} onClick={() => navigate("/audits")}>
          Ver auditoría →
        </button>
      </div>
    </div>
  );
};

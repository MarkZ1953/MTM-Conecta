import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  /** Label visible del breadcrumb */
  label: string;
  /** URL de navegación (opcional, el último elemento no lleva link) */
  href?: string;
  /** Callback al hacer click (alternativo a href) */
  onClick?: () => void;
}

export interface UIPageHeaderProps {
  /** Título principal del módulo / página */
  title: string;
  /** Breve descripción de lo que se hace en el módulo */
  description?: string;
  /**
   * Ícono del módulo. Acepta:
   * - className de PrimeIcons (e.g. "pi pi-users")
   * - Componente React (e.g. un SVG o ícono de Phosphor)
   */
  icon?: string | React.ElementType;
  /** Breadcrumbs de navegación para contexto de ubicación */
  breadcrumbs?: BreadcrumbItem[];
  /** Nodos de acción (botones, menús, etc.) que se renderizan a la derecha */
  actions?: React.ReactNode;
  /** Badge / etiqueta opcional (e.g. "Nuevo", "Beta", cantidad) */
  badge?: string;
  /** Variante de color del badge */
  badgeSeverity?: "primary" | "success" | "warning" | "danger" | "info";
  /** Contenido extra debajo del título (e.g. tabs, métricas) */
  children?: React.ReactNode;
  /** Clase CSS adicional para el contenedor raíz */
  className?: string;
  /** ID del contenedor raíz */
  id?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const badgeColorMap: Record<string, { bg: string; text: string; border: string }> = {
  primary: {
    bg: "var(--mtm-primary-soft)",
    text: "var(--mtm-primary)",
    border: "var(--mtm-primary-light)",
  },
  success: {
    bg: "var(--mtm-teal-soft)",
    text: "var(--mtm-teal-deep)",
    border: "var(--mtm-teal)",
  },
  warning: {
    bg: "var(--mtm-accent-soft)",
    text: "var(--mtm-accent-deep)",
    border: "var(--mtm-accent)",
  },
  danger: {
    bg: "#FFF0F0",
    text: "#C62828",
    border: "#EF9A9A",
  },
  info: {
    bg: "#E3F2FD",
    text: "#1565C0",
    border: "#90CAF9",
  },
};

// ─── Styles (CSS-in-JS con variables de tema) ─────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  root: {
    background: "linear-gradient(135deg, var(--mtm-primary-soft) 0%, var(--mtm-white) 60%)",
    borderBottom: "1px solid var(--mtm-border)",
    borderRadius: "0.75rem",
    padding: "1.5rem 2rem",
    marginBottom: "1.5rem",
    animation: "uiPageHeaderSlideIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
  },
  accentBar: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
    borderRadius: "0.75rem 0 0 0.75rem",
    background: "linear-gradient(180deg, var(--mtm-primary) 0%, var(--mtm-primary-light) 100%)",
  },
  iconWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "3rem",
    height: "3rem",
    borderRadius: "0.75rem",
    background: "var(--mtm-primary)",
    color: "var(--mtm-white)",
    fontSize: "1.25rem",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(106, 27, 154, 0.25)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "var(--mtm-dark)",
    lineHeight: 1.25,
    margin: 0,
  },
  description: {
    fontSize: "0.875rem",
    color: "#6b6b6b",
    lineHeight: 1.5,
    margin: 0,
    marginTop: "0.25rem",
    maxWidth: "600px",
  },
  breadcrumbSeparator: {
    fontSize: "0.65rem",
    color: "#b0b0b0",
    margin: "0 0.35rem",
  },
  breadcrumbLink: {
    fontSize: "0.8rem",
    color: "var(--mtm-primary-light)",
    textDecoration: "none",
    cursor: "pointer",
    transition: "color 0.15s ease",
    fontWeight: 500,
  },
  breadcrumbCurrent: {
    fontSize: "0.8rem",
    color: "var(--mtm-primary)",
    fontWeight: 600,
  },
};

// ─── Keyframes (inyectados una sola vez) ──────────────────────────────────────

const KEYFRAME_ID = "ui-page-header-keyframes";

const injectKeyframes = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById(KEYFRAME_ID)) return;

  const style = document.createElement("style");
  style.id = KEYFRAME_ID;
  style.textContent = `
    @keyframes uiPageHeaderSlideIn {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .ui-page-header__icon-wrapper:hover {
      transform: scale(1.08) !important;
      box-shadow: 0 6px 18px rgba(106, 27, 154, 0.35) !important;
    }
    .ui-page-header__breadcrumb-link:hover {
      color: var(--mtm-primary) !important;
    }
    @media (max-width: 768px) {
      .ui-page-header__root {
        padding: 1rem 1.25rem !important;
        border-radius: 0.5rem !important;
      }
      .ui-page-header__title {
        font-size: 1.2rem !important;
      }
      .ui-page-header__description {
        font-size: 0.8rem !important;
      }
      .ui-page-header__main-row {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 1rem !important;
      }
      .ui-page-header__actions {
        width: 100% !important;
        justify-content: flex-start !important;
        flex-wrap: wrap !important;
      }
    }
  `;
  document.head.appendChild(style);
};

// ─── Component ────────────────────────────────────────────────────────────────

export const UIPageHeader = ({
  title,
  description,
  icon,
  actions,
  badge,
  badgeSeverity = "primary",
  children,
  className,
  id,
}: UIPageHeaderProps) => {
  // Inyectar keyframes al primer render
  React.useEffect(() => {
    injectKeyframes();
  }, []);

  const IconComponent = typeof icon !== "string" ? icon : undefined;
  const iconClassName = typeof icon === "string" ? icon : undefined;

  const badgeColors = badgeColorMap[badgeSeverity] ?? badgeColorMap.primary;

  return (
    <div
      id={id ?? "ui-page-header"}
      className={`ui-page-header__root ${className ?? ""}`}
      style={{ ...styles.root, position: "relative", overflow: "hidden" }}
    >
      {/* Barra decorativa lateral */}
      <div style={styles.accentBar} aria-hidden="true" />

      {/* ── Main Row (icon + text + actions) ── */}
      <div
        className="ui-page-header__main-row flex align-items-center justify-content-between gap-3"
      >
        {/* Left side: icon + title + desc */}
        <div className="flex align-items-center gap-3" style={{ minWidth: 0 }}>
          {/* Ícono */}
          {icon && (
            <div
              className="ui-page-header__icon-wrapper"
              style={styles.iconWrapper}
              aria-hidden="true"
            >
              {IconComponent ? (
                <IconComponent size={22} weight="bold" />
              ) : (
                <i className={iconClassName} style={{ fontSize: "1.25rem" }} />
              )}
            </div>
          )}

          {/* Text block */}
          <div style={{ minWidth: 0 }}>
            <div className="flex align-items-center gap-2" style={{ flexWrap: "wrap" }}>
              <h1 className="ui-page-header__title" style={styles.title}>
                {title}
              </h1>
              {badge && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.15rem 0.6rem",
                    borderRadius: "999px",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.025em",
                    textTransform: "uppercase",
                    background: badgeColors.bg,
                    color: badgeColors.text,
                    border: `1px solid ${badgeColors.border}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="ui-page-header__description" style={styles.description}>
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right side: actions */}
        {actions && (
          <div
            className="ui-page-header__actions flex align-items-center gap-2"
            style={{ flexShrink: 0 }}
          >
            {actions}
          </div>
        )}
      </div>

      {/* ── Children (tabs, métricas, etc.) ── */}
      {children && (
        <div style={{ marginTop: "1rem" }}>
          {children}
        </div>
      )}
    </div>
  );
};

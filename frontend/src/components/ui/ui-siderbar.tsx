import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import "./ui-siderbar.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavPermission {
  module: string;
  codename: string;
}

export interface NavItem {
  title: string;
  url: string;
  /** Clase de ícono de PrimeReact (ej: "pi-home") o componente */
  icon?: React.ElementType | string;
  isActive?: boolean;
  permission?: NavPermission;
  items?: NavItem[];
  /** Etiqueta de sección que se muestra ANTES de este ítem */
  section?: string;
}

interface UISidebarProps {
  children?: React.ReactNode;
  navItems?: NavItem[];
  logoText?: string;
  /** Ruta de la imagen del logo (en /public). Si no carga, usa el texto. */
  logoSrc?: string;
  userName?: string;
  userRole?: string;
  onLogout?: () => Promise<void> | void;
}

// ─── Icon helper ────────────────────────────────────────────────────────────

const NavIcon = ({ icon }: { icon?: React.ElementType | string }) => {
  if (!icon) return null;
  if (typeof icon === "string") {
    return <i className={`pi ${icon} mtm-nav-icon`} />;
  }
  const Comp = icon;
  return (
    <span className="mtm-nav-icon">
      <Comp size={16} />
    </span>
  );
};

// ─── Recursive Nav Item ───────────────────────────────────────────────────────

const NavItemNode = ({ item }: { item: NavItem }) => {
  const location = useLocation();
  const hasChildren = item.items && item.items.length > 0;
  const childActive = hasChildren && item.items!.some((c) => c.url === location.pathname);
  const [open, setOpen] = useState<boolean>(item.isActive ?? childActive ?? false);
  const isActive = location.pathname === item.url;

  if (hasChildren) {
    return (
      <li>
        <button
          className={`mtm-nav-item ${childActive ? "active" : ""}`}
          onClick={() => setOpen((p) => !p)}
        >
          <NavIcon icon={item.icon} />
          <span style={{ flex: 1 }}>{item.title}</span>
          <i className={`pi ${open ? "pi-chevron-down" : "pi-chevron-right"} mtm-chev`} />
        </button>

        {open && (
          <ul className="mtm-nav-children">
            {item.items!.map((child, idx) => (
              <li key={child.title + child.url + idx}>
                <Link
                  to={child.url}
                  className={`mtm-nav-child ${location.pathname === child.url ? "active" : ""}`}
                >
                  {child.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link to={item.url} className={`mtm-nav-item ${isActive ? "active" : ""}`}>
        <NavIcon icon={item.icon} />
        <span>{item.title}</span>
      </Link>
    </li>
  );
};

// ─── Breadcrumb ─────────────────────────────────────────────────────────────

type Crumb = { label: string; url: string };

const useBreadcrumb = (navItems: NavItem[]): Crumb[] => {
  const location = useLocation();
  const path = location.pathname;
  const home: Crumb = { label: "Inicio", url: "/" };

  if (path === "/") return [home];

  for (const item of navItems) {
    if (item.url === path && item.url !== "/") return [home, { label: item.title, url: item.url }];
    if (item.items) {
      const child = item.items.find((c) => c.url === path);
      if (child) return [home, { label: item.title, url: item.url }, { label: child.title, url: child.url }];
    }
  }
  return [home];
};

// ─── Main Component ───────────────────────────────────────────────────────────

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export const UISidebar = ({
  children,
  navItems = [],
  logoText = "MTM Conecta",
  logoSrc = "/logo-mtm.png",
  userName = "Usuario",
  userRole = "Administrador",
  onLogout,
}: UISidebarProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<boolean>(false);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);
  const crumbs = useBreadcrumb(navItems);

  const handleLogout = async () => {
    if (!onLogout || loggingOut) return;

    setLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="mtm-shell">
      {/* ── Sidebar ── */}
      <aside className="mtm-sidebar" style={{ width: collapsed ? 0 : 264 }}>
        <div className="mtm-sidebar-inner">
          {/* Brand (clic → inicio) */}
          <Link to="/" className="mtm-brand" aria-label="Ir al inicio">
            {logoSrc && !logoError ? (
              <img
                className="mtm-brand-img"
                src={logoSrc}
                alt="Fundación MTM"
                onError={() => setLogoError(true)}
              />
            ) : (
              <>
                <div className="mtm-brand-mark">M</div>
                <div>
                  <div className="mtm-brand-name">{logoText}</div>
                  <div className="mtm-brand-sub">Mujeres Trabajando por una Meta</div>
                </div>
              </>
            )}
          </Link>

          {/* Nav */}
          <ul className="mtm-nav">
            {navItems.map((item, idx) => (
              <React.Fragment key={item.title + item.url + idx}>
                {item.section && <li className="mtm-nav-section">{item.section}</li>}
                <NavItemNode item={item} />
              </React.Fragment>
            ))}
          </ul>

          {/* User profile */}
          <div className="mtm-user-card">
            <div className="mtm-user-avatar">{initials(userName)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="mtm-user-name">{userName}</div>
              <div className="mtm-user-role">{userRole}</div>
            </div>
            {onLogout && (
              <button
                type="button"
                className="mtm-logout-btn"
                onClick={handleLogout}
                disabled={loggingOut}
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <i className={`pi ${loggingOut ? "pi-spin pi-spinner" : "pi-sign-out"}`} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="mtm-main">
        {/* Topbar with breadcrumb */}
        <div className="mtm-topbar">
          <button
            className="mtm-toggle"
            onClick={() => setCollapsed((p) => !p)}
            aria-label="Alternar menú"
          >
            <i className="pi pi-bars" />
          </button>
          <nav className="mtm-crumb">
            {crumbs.map((c, i) => (
              <React.Fragment key={c.url + i}>
                {i > 0 && <span className="sep">›</span>}
                {i === crumbs.length - 1 ? (
                  <span className="here">{c.label}</span>
                ) : (
                  <Link to={c.url} className="mtm-crumb-link">{c.label}</Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="mtm-content">
          <div className="mtm-content-inner">{children}</div>
        </div>
      </div>
    </div>
  );
};

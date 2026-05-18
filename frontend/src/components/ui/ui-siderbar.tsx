import { Link, useLocation } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { Ripple } from "primereact/ripple";
import { Button } from "primereact/button";
import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavPermission {
  module: string;
  codename: string;
}

export interface NavItem {
  title: string;
  url: string;
  /** Componente de ícono o clase de PrimeReact */
  icon?: React.ElementType | string;
  isActive?: boolean;
  permission?: NavPermission;
  items?: NavItem[];
}

interface UISidebarProps {
  children?: React.ReactNode;
  navItems?: NavItem[];
  logoText?: string;
  userAvatar?: string;
  userName?: string;
}

// ─── Recursive Nav Item ───────────────────────────────────────────────────────

interface NavItemNodeProps {
  item: NavItem;
  depth?: number;
}

const NavItemNode = ({ item, depth = 0 }: NavItemNodeProps) => {
  const location = useLocation();
  const [open, setOpen] = useState<boolean>(item.isActive ?? false);
  const hasChildren = item.items && item.items.length > 0;
  const IconComponent = item.icon;

  const paddingLeft = depth === 0 ? "0.75rem" : `${0.75 + depth * 0.75}rem`;
  const isActive = location.pathname === item.url;

  const itemClass = [
    "p-ripple flex align-items-center cursor-pointer p-3 border-round",
    "transition-duration-150 transition-colors w-full",
    isActive
      ? "surface-200 text-primary font-semibold"
      : "text-700 hover:surface-100",
  ].join(" ");

  if (hasChildren) {
    return (
      <li>
        {/* Trigger: no navega, solo despliega */}
        <div
          className={itemClass}
          style={{ paddingLeft }}
          onClick={() => setOpen((prev) => !prev)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setOpen((prev) => !prev)}
        >
          {item.icon && (
            <span className="mr-2 flex align-items-center">
              {typeof item.icon === 'string' ? (
                <i className={`pi ${item.icon}`} style={{ fontSize: '1rem' }} />
              ) : (
                <item.icon size={16} weight="regular" />
              )}
            </span>
          )}
          <span className="font-medium flex-1">{item.title}</span>
          <i
            className={`pi ${open ? "pi-chevron-down" : "pi-chevron-right"} ml-auto`}
            style={{ fontSize: "0.75rem" }}
          />
          <Ripple />
        </div>

        {/* Children */}
        {open && (
          <ul className="list-none p-0 m-0 overflow-hidden">
            {item.items!.map((child, idx) => (
              <NavItemNode key={child.title + child.url + idx} item={child} depth={depth + 1} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        to={item.url}
        className={itemClass}
        style={{ paddingLeft, textDecoration: "none", display: "flex" }}
      >
        {item.icon && (
          <span className="mr-2 flex align-items-center">
            {typeof item.icon === 'string' ? (
              <i className={`pi ${item.icon}`} style={{ fontSize: '1rem' }} />
            ) : (
              <item.icon size={16} weight="regular" />
            )}
          </span>
        )}
        <span className="font-medium">{item.title}</span>
        <Ripple />
      </Link>
    </li>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const UISidebar = ({
  children,
  navItems = [],
  logoText = "MTM Conecta",
  userAvatar = "https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png",
  userName = "Usuario",
}: UISidebarProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const sidebarWidth = collapsed ? "0px" : "280px";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar Panel ── */}
      <div
        id="app-sidebar"
        className="surface-section flex flex-column flex-shrink-0 transition-all transition-duration-300"
        style={{
          width: sidebarWidth,
          overflow: "hidden",
          borderRight: collapsed ? "none" : "1px solid var(--surface-border)",
        }}
      >
        <div className="flex flex-column h-full" style={{ width: "280px" }}>
          {/* Header */}
          <div className="flex align-items-center px-4 pt-3 pb-2 shrink-0">
            <span className="font-semibold text-xl text-primary">
              {logoText}
            </span>
          </div>

          {/* Nav Menu */}
          <div className="overflow-y-auto flex-1">
            <ul className="list-none pt-2 px-3 m-0">
              {navItems.map((item, idx) => (
                <NavItemNode key={item.title + item.url + idx} item={item} depth={0} />
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-auto">
            <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
            <a className="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
              <Avatar image={userAvatar} shape="circle" />
              <span className="font-bold">{userName}</span>
              <Ripple />
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="flex flex-column flex-1 overflow-hidden">
        {/* Top Bar con botón toggle */}
        <div
          className="flex align-items-center px-3 py-2 surface-0 shadow-1 shrink-0"
          style={{ borderBottom: "1px solid var(--surface-border)" }}
        >
          <Button
            id="sidebar-toggle-btn"
            type="button"
            icon={collapsed ? "pi pi-bars" : "pi pi-bars"}
            onClick={() => setCollapsed((prev) => !prev)}
            rounded
            text
            severity="secondary"
            aria-label={collapsed ? "Abrir sidebar" : "Cerrar sidebar"}
            className="mr-2"
          />
          <span className="font-semibold text-lg text-900">{logoText}</span>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-3 flex flex-column">{children}</div>
      </div>
    </div>
  );
};

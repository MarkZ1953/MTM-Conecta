import { UISidebar } from "@/components";
import type { NavItem } from "@/components";
import { AuthContext, getPrimaryRole, hasAnyPermission } from "@/auth";
import { useContext, useMemo } from "react";
import { Outlet } from "react-router-dom";

type PermissionNavItem = NavItem & {
  permissions?: string[];
  items?: PermissionNavItem[];
};

const navItems: PermissionNavItem[] = [
  {
    section: "Principal",
    title: "Inicio",
    url: "/",
    icon: "pi-home",
  },
  {
    title: "Beneficiarios",
    url: "/beneficiaries",
    icon: "pi-users",
    permissions: ["beneficiaries.view_beneficiary", "beneficiaries.view_guardian"],
    items: [
      {
        title: "Directorio",
        url: "/beneficiaries",
        icon: "pi-address-book",
        permissions: ["beneficiaries.view_beneficiary"],
      },
      {
        title: "Cuidadores",
        url: "/beneficiaries/guardians",
        icon: "pi-shield",
        permissions: ["beneficiaries.view_guardian"],
      },
    ],
  },
  {
    title: "Eventos",
    url: "/events",
    icon: "pi-calendar",
    permissions: [
      "events.view_event",
      "events.view_attendance",
      "events.view_eventact",
      "events.view_evidence",
    ],
    items: [
      { title: "Lista de Eventos", url: "/events", icon: "pi-list", permissions: ["events.view_event"] },
      {
        title: "Asistencia",
        url: "/events/attendance",
        icon: "pi-check-square",
        permissions: ["events.view_attendance"],
      },
      { title: "Actas", url: "/events/acts", icon: "pi-file", permissions: ["events.view_eventact"] },
      { title: "Evidencias", url: "/events/evidences", icon: "pi-images", permissions: ["events.view_evidence"] },
    ],
  },
  {
    title: "Donaciones",
    url: "/donations",
    icon: "pi-gift",
    permissions: ["donations.view_donation", "donations.view_donor"],
    items: [
      { title: "Historial", url: "/donations", icon: "pi-history", permissions: ["donations.view_donation"] },
      { title: "Donantes", url: "/donations/donors", icon: "pi-heart", permissions: ["donations.view_donor"] },
    ],
  },
  {
    section: "Comunicación",
    title: "Campañas",
    url: "/campaigns",
    icon: "pi-megaphone",
    permissions: ["campaigns.view_campaign"],
  },
  {
    title: "Suscriptores",
    url: "/subscribers",
    icon: "pi-envelope",
    permissions: ["subscribers.view_newslettersubscriber"],
  },
  {
    title: "Blog",
    url: "/blog-posts",
    icon: "pi-book",
    permissions: ["blog.view_blogpost"],
  },
  {
    title: "Voluntarios",
    url: "/volunteers",
    icon: "pi-id-card",
    permissions: ["volunteers.view_volunteer"],
  },
  {
    section: "Recolección de Tapas",
    title: "Recolección",
    url: "/cap-collection",
    icon: "pi-replay",
    permissions: [
      "cap_collection.view_company",
      "cap_collection.view_collectionpoint",
      "cap_collection.view_collectionrequest",
    ],
    items: [
      {
        title: "Empresas",
        url: "/cap-collection/companies",
        icon: "pi-building",
        permissions: ["cap_collection.view_company"],
      },
      {
        title: "Puntos de Recolección",
        url: "/cap-collection/points",
        icon: "pi-map-marker",
        permissions: ["cap_collection.view_collectionpoint"],
      },
      {
        title: "Solicitudes",
        url: "/cap-collection/requests",
        icon: "pi-truck",
        permissions: ["cap_collection.view_collectionrequest"],
      },
    ],
  },
  {
    section: "Administración",
    title: "Usuarios",
    url: "/users",
    icon: "pi-user",
    permissions: ["auth.view_user"],
  },
];

const filterNavItemsByPermission = (items: PermissionNavItem[], user: any): NavItem[] =>
  items.reduce<NavItem[]>((visibleItems, item) => {
    const visibleChildren = item.items ? filterNavItemsByPermission(item.items, user) : undefined;
    const canViewItem = hasAnyPermission(user, item.permissions) || Boolean(visibleChildren?.length);

    if (!canViewItem) return visibleItems;

    const { permissions, ...navItem } = item;
    visibleItems.push({
      ...navItem,
      items: visibleChildren,
    });
    return visibleItems;
  }, []);

export const PrivateLayout = () => {
  const { logout, user } = useContext(AuthContext);
  const roleName = getPrimaryRole(user);
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.username || "Usuario";
  const visibleNavItems = useMemo(() => filterNavItemsByPermission(navItems, user), [user]);

  return (
    <UISidebar
      navItems={visibleNavItems}
      logoText="MTM Conecta"
      userName={fullName}
      userRole={roleName}
      onLogout={logout}
    >
      <Outlet />
    </UISidebar>
  );
};

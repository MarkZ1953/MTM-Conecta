import { UISidebar } from "@/components";
import type { NavItem } from "@/components";
import { AuthContext, getPrimaryRole } from "@/auth";
import { useContext } from "react";
import { Outlet } from "react-router-dom";

const navItems: NavItem[] = [
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
    items: [
      { title: "Directorio", url: "/beneficiaries", icon: "pi-address-book" },
      {
        title: "Cuidadores",
        url: "/beneficiaries/guardians",
        icon: "pi-shield",
      },
    ],
  },
  {
    title: "Eventos",
    url: "/events",
    icon: "pi-calendar",
    items: [
      { title: "Lista de Eventos", url: "/events", icon: "pi-list" },
      {
        title: "Asistencia",
        url: "/events/attendance",
        icon: "pi-check-square",
      },
      { title: "Actas", url: "/events/acts", icon: "pi-file" },
      { title: "Evidencias", url: "/events/evidences", icon: "pi-images" },
    ],
  },
  {
    title: "Donaciones",
    url: "/donations",
    icon: "pi-gift",
    items: [
      { title: "Historial", url: "/donations", icon: "pi-history" },
      { title: "Donantes", url: "/donations/donors", icon: "pi-heart" },
    ],
  },
  {
    section: "Comunicación",
    title: "Campañas",
    url: "/campaigns",
    icon: "pi-megaphone",
  },
  {
    title: "Blog",
    url: "/blog-posts",
    icon: "pi-book",
  },
  {
    title: "Voluntarios",
    url: "/volunteers",
    icon: "pi-id-card",
  },
  {
    section: "Recolección de Tapas",
    title: "Recolección",
    url: "/cap-collection",
    icon: "pi-replay",
    items: [
      { title: "Empresas", url: "/cap-collection/companies", icon: "pi-building" },
      { title: "Puntos de Recolección", url: "/cap-collection/points", icon: "pi-map-marker" },
      { title: "Solicitudes", url: "/cap-collection/requests", icon: "pi-truck" },
    ],
  },
  {
    section: "Administración",
    title: "Usuarios",
    url: "/users",
    icon: "pi-user",
  },
];

export const PrivateLayout = () => {
  const { logout, user } = useContext(AuthContext);
  const roleName = getPrimaryRole(user);
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.username || "Usuario";

  return (
    <UISidebar
      navItems={navItems}
      logoText="MTM Conecta"
      userName={fullName}
      userRole={roleName}
      onLogout={logout}
    >
      <Outlet />
    </UISidebar>
  );
};

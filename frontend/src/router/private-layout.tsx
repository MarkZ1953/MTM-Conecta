import { UISidebar } from "@/components";
import type { NavItem } from "@/components";
import { Outlet } from "react-router-dom";


const navItems: NavItem[] = [
  {
    title: "Inicio",
    url: "/",
    icon: "pi-home",
  },
  {
    title: "Usuarios",
    url: "/users",
    icon: "pi-user",
  },
  {
    title: "Beneficiarios",
    url: "/beneficiaries",
    icon: "pi-users",
    items: [
      { title: "Directorio", url: "/beneficiaries" },
      { title: "Tutores", url: "/beneficiaries/guardians" },
    ]
  },
  {
    title: "Eventos",
    url: "/events",
    icon: "pi-calendar",
    items: [
      { title: "Lista de Eventos", url: "/events" },
      { title: "Asistencia", url: "/events/attendance" },
      { title: "Actas", url: "/events/acts" },
      { title: "Evidencias", url: "/events/evidences" },
    ]
  },
  {
    title: "Donaciones",
    url: "/donations",
    icon: "pi-gift",
    items: [
      { title: "Historial", url: "/donations" },
      { title: "Donantes", url: "/donations/donors" },
    ]
  },
];

export const PrivateLayout = () => {
  return (
    <UISidebar navItems={navItems} logoText="MTM Conecta">
      <Outlet />
    </UISidebar>
  );
};
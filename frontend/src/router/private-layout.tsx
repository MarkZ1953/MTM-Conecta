import { UISidebar } from "@/components";
import type { NavItem } from "@/components";
import { Outlet } from "react-router-dom";

// import {
//   HouseIcon,
//   FileTextIcon,
//   FilesIcon,
//   UploadSimpleIcon,
//   SignatureIcon,
//   HourglassIcon,
//   FileMagnifyingGlassIcon,
//   UsersIcon,
//   EnvelopeSimpleIcon,
//   CarIcon,
//   ScrollIcon,
//   TextTIcon,
//   RecycleIcon,
//   TrashIcon,
//   TagIcon,
//   CheckCircleIcon,
//   GearSixIcon,
//   BuildingsIcon,
//   TicketIcon,
//   KeyIcon,
//   UserIcon,
//   ShieldCheckIcon,
//   GearIcon,
// } from "@phosphor-icons/react";

const navItems: NavItem[] = [
  {
    title: "Inicio",
    url: "/",
    // icon: HouseIcon,
  },
  {
    title: "Actas",
    url: "#",
    // icon: FileTextIcon,
    isActive: true,
    items: [
      {
        title: "Actas registradas",
        url: "/reports",
        // icon: FilesIcon,
        permission: { module: "reports", codename: "view_reports" },
      },
      {
        title: "Importar Actas",
        url: "/reports-import",
        // icon: UploadSimpleIcon,
        permission: { module: "reports", codename: "add_reports" },
      },
      {
        title: "Firmas",
        url: "/signatures",
        // icon: SignatureIcon,
        permission: { module: "signatures", codename: "view_signatures" },
      },
      {
        title: "Actas pendientes",
        url: "/pending-reports",
        // icon: HourglassIcon,
        permission: { module: "reports", codename: "view_pendingreports" },
      },
      {
        title: "Auditorías",
        url: "/report-audits",
        // icon: FileMagnifyingGlassIcon,
        permission: { module: "audits", codename: "view_audits" },
      },
    ],
  },
  {
    title: "Clientes",
    url: "#",
    // icon: UsersIcon,
    items: [
      {
        title: "Clientes registrados",
        url: "/clients",
        // icon: UsersIcon,
        permission: { module: "clients", codename: "view_clients" },
      },
      {
        title: "Correos",
        url: "/client-emails",
        // icon: EnvelopeSimpleIcon,
        permission: { module: "clients", codename: "view_clientemails" },
      },
      {
        title: "Vehículos",
        url: "/vehicles",
        // icon: CarIcon,
        permission: { module: "vehicles", codename: "view_vehicles" },
      },
    ],
  },
  {
    title: "Membretes",
    url: "/letterheads",
    // icon: ScrollIcon,
    permission: { module: "letterheads", codename: "view_letterheads" },
  },
  {
    title: "Párrafos de texto",
    url: "/text-paragraphs",
    // icon: TextTIcon,
    permission: {
      module: "report_text_paragraphs",
      codename: "view_reporttextparagraphs",
    },
  },
  {
    title: "Gestión de Residuos",
    url: "#",
    // icon: RecycleIcon,
    items: [
      {
        title: "Registro de residuos",
        url: "/waste-management",
        // icon: TrashIcon,
        permission: { module: "waste_management", codename: "view_wastemanagement" },
      },
      {
        title: "Tipos de residuos",
        url: "/waste-types",
        // icon: TagIcon,
        permission: { module: "waste_types", codename: "view_wastetypes" },
      },
      {
        title: "Estados de residuos",
        url: "/waste-states",
        // icon: CheckCircleIcon,
        permission: { module: "waste_states", codename: "view_wastestates" },
      },
      {
        title: "Tratamientos",
        url: "/treatments",
        // icon: GearSixIcon,
        permission: { module: "treatments", codename: "view_treatments" },
      },
      {
        title: "Gestores",
        url: "/managers",
        // icon: BuildingsIcon,
        permission: { module: "managers", codename: "view_managers" },
      },
      {
        title: "Codigos",
        url: "/codes",
        // icon: TicketIcon,
        permission: { module: "codes", codename: "view_codes" },
      },
    ],
  },
  {
    title: "Control de Acceso",
    url: "#",
    // icon: KeyIcon,
    items: [
      {
        title: "Usuarios",
        url: "/users",
        // icon: UserIcon,
        permission: { module: "auth", codename: "view_user" },
      },
      {
        title: "Roles y permisos",
        url: "/access",
        // icon: KeyIcon,
        permission: { module: "auth", codename: "view_group" },
      },
      {
        title: "Auditorías de seguridad",
        url: "/security-audits",
        // icon: ShieldCheckIcon,
        permission: { module: "audits", codename: "view_audits" },
      },
    ],
  },
  {
    title: "Configuración",
    url: "/config",
    // icon: GearIcon,
  },
];

export const PrivateLayout = () => {
  return (
    <UISidebar navItems={navItems} logoText="MTM Conecta">
      <Outlet />
    </UISidebar>
  );
};
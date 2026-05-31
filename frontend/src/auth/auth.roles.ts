const INTERNAL_ROLE_NAMES = [
  "Administrador General",
  "Finanzas",
  "Gestión Informativa",
  "Diseñador",
];

export function getUserRoleNames(user: any): string[] {
  return (user?.groups ?? [])
    .map((group: any) => (typeof group === "string" ? group : group?.name))
    .filter(Boolean);
}

export function canAccessAdminPanel(user: any): boolean {
  if (!user) return false;
  if (user.is_superuser) return true;

  return getUserRoleNames(user).some((roleName) =>
    INTERNAL_ROLE_NAMES.includes(roleName),
  );
}

export function getPrimaryRole(user: any): string {
  const roleName = getUserRoleNames(user)[0];

  if (roleName) return roleName;
  if (user?.is_superuser) return "Administrador General";
  return "Usuario registrado";
}

export function getPanelLabel(user: any): string {
  const roleName = getPrimaryRole(user);

  if (roleName === "Administrador General") return "Panel admin";
  if (roleName === "Finanzas") return "Panel finanzas";
  if (roleName === "Gestión Informativa") return "Panel info";
  if (roleName === "Diseñador") return "Panel diseño";
  return "Panel";
}

export function getPostLoginPath(user: any): string {
  return canAccessAdminPanel(user) ? "/" : "/home";
}

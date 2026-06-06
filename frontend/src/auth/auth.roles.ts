const INTERNAL_ROLE_NAMES = [
  "Administrador General",
  "Líder Fundación",
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

export function getUserPermissionKeys(user: any): Set<string> {
  const permissions = user?.permissions;
  const keys = new Set<string>();

  if (!permissions || typeof permissions !== "object") return keys;

  Object.values(permissions).forEach((groupPermissions) => {
    if (!Array.isArray(groupPermissions)) return;

    groupPermissions.forEach((permission: any) => {
      const codename = permission?.codename;
      const appLabel = permission?.app_label;

      if (!codename) return;

      keys.add(codename);
      if (appLabel) keys.add(`${appLabel}.${codename}`);
    });
  });

  return keys;
}

export function hasAnyPermission(user: any, permissions: string[] = []): boolean {
  if (!permissions.length) return true;
  if (user?.is_superuser) return true;

  const userPermissions = getUserPermissionKeys(user);
  return permissions.some((permission) => userPermissions.has(permission));
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
  if (roleName === "Líder Fundación") return "Panel fundación";
  if (roleName === "Finanzas") return "Panel finanzas";
  if (roleName === "Gestión Informativa") return "Panel info";
  if (roleName === "Diseñador") return "Panel diseño";
  return "Panel";
}

export function getPostLoginPath(user: any): string {
  return canAccessAdminPanel(user) ? "/" : "/home";
}

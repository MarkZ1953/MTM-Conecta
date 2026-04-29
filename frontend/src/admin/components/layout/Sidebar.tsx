import { useAuth } from '../../context/AuthContext'
import type { AdminModule } from '../../types'

const NAV_ITEMS: { module: AdminModule; label: string; icon: string; group: string }[] = [
  { module: 'dashboard', label: 'Dashboard', icon: 'pi pi-home', group: 'Principal' },
  { module: 'beneficiarios', label: 'Beneficiarios', icon: 'pi pi-heart', group: 'Principal' },
  { module: 'donantes', label: 'Donantes', icon: 'pi pi-credit-card', group: 'Principal' },
  { module: 'donaciones', label: 'Donaciones', icon: 'pi pi-gift', group: 'Principal' },
  { module: 'proyectos', label: 'Proyectos', icon: 'pi pi-folder-open', group: 'Principal' },
  { module: 'reportes', label: 'Reportes', icon: 'pi pi-chart-bar', group: 'Administración' },
  { module: 'usuarios', label: 'Usuarios', icon: 'pi pi-users', group: 'Administración' },
  { module: 'roles', label: 'Roles', icon: 'pi pi-shield', group: 'Administración' },
  { module: 'auditoria', label: 'Auditoría', icon: 'pi pi-list', group: 'Administración' },
]

interface SidebarProps {
  active: AdminModule
  onNavigate: (m: AdminModule) => void
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ active, onNavigate, collapsed, onToggle }: SidebarProps) {
  const { canAccess } = useAuth()

  const groups = ['Principal', 'Administración']

  return (
    <aside
      className={`flex flex-col h-screen bg-primary-gradient text-white transition-all duration-300 shadow-2xl border-r border-primary ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <i className="pi pi-heart text-white text-base" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm font-bold truncate">Fundación MTM</p>
              <p className="text-white/60 text-xs truncate">Panel Administrativo</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-9 h-9 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center mx-auto">
            <i className="pi pi-heart text-white text-base" />
          </div>
        )}
        {!collapsed && (
          <button onClick={onToggle} className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded">
            <i className="pi pi-chevron-left text-base" />
          </button>
        )}
      </div>

      {collapsed && (
        <button onClick={onToggle} className="flex items-center justify-center py-3 text-white/60 hover:text-white transition-colors border-b border-white/10 hover:bg-white/10">
          <i className="pi pi-bars text-base" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {groups.map(group => {
          const items = NAV_ITEMS.filter(i => i.group === group && canAccess(i.module))
          if (!items.length) return null
          return (
            <div key={group} className="mb-4">
              {!collapsed && (
                <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
                  {group}
                </p>
              )}
              {items.map(item => {
                const isActive = active === item.module
                return (
                  <button
                    key={item.module}
                    onClick={() => onNavigate(item.module)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                      isActive
                        ? 'bg-white bg-opacity-20 backdrop-blur-sm text-white shadow-lg'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <i className={`${item.icon} text-base`} />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-3">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm">
          <i className="pi pi-sign-out text-base" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  )
}

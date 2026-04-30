import { useAuth } from '../../context/AuthContext'

interface TopbarProps {
  title: string
}

export default function Topbar({ title }: TopbarProps) {
  const { user } = useAuth()

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">Resumen general de la Fundación MTM</p>
        </div>

        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 w-64">
            <i className="pi pi-search text-base text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent outline-none text-sm flex-1 text-foreground placeholder-muted-foreground"
            />
          </div>

          {/* Icons */}
          <button className="relative p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors">
            <i className="pi pi-bell text-lg" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose rounded-full"></span>
          </button>

          <button className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors">
            <i className="pi pi-cog text-lg" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-6 border-l border-border">
            <div className="w-10 h-10 rounded-full bg-primary-gradient flex items-center justify-center text-white font-semibold">
              {user?.name.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
            <button className="p-1 hover:bg-secondary rounded transition-colors">
              <i className="pi pi-user text-base text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

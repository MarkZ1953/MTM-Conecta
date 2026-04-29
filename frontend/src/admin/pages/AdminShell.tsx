import { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import DashboardPage from './DashboardPage'
import BeneficiariesPage from './BeneficiariesPage'
import DonorsPage from './DonorsPage'
import DonationsPage from './DonationsPage'
import ProjectsPage from './ProjectsPage'
import ReportsPage from './ReportsPage'
import UsersPage from './UsersPage'
import RolesPage from './RolesPage'
import AuditPage from './AuditPage'
import type { AdminModule } from '../types'

const PAGE_TITLES: Record<AdminModule, string> = {
  dashboard: 'Dashboard',
  beneficiarios: 'Beneficiarios',
  donantes: 'Donantes',
  donaciones: 'Donaciones',
  proyectos: 'Proyectos',
  reportes: 'Reportes',
  usuarios: 'Usuarios',
  roles: 'Roles',
  auditoria: 'Auditoría',
}

export default function AdminShell() {
  const [activeModule, setActiveModule] = useState<AdminModule>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderPage = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardPage />
      case 'beneficiarios':
        return <BeneficiariesPage />
      case 'donantes':
        return <DonorsPage />
      case 'donaciones':
        return <DonationsPage />
      case 'proyectos':
        return <ProjectsPage />
      case 'reportes':
        return <ReportsPage />
      case 'usuarios':
        return <UsersPage />
      case 'roles':
        return <RolesPage />
      case 'auditoria':
        return <AuditPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        active={activeModule}
        onNavigate={setActiveModule}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar title={PAGE_TITLES[activeModule]} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="px-8 py-6">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { PrimeReactProvider } from 'primereact/api'
import Index from './pages/Index.tsx'
import AdminShell from './admin/pages/AdminShell.tsx'
import LoginPage from './admin/pages/LoginPage.tsx'
import { AuthProvider, useAuth } from './admin/context/AuthContext.tsx'
import { DataProvider, useData } from './admin/context/DataContext.tsx'

/**
 * AdminRouter — muestra el shell o el login según si hay sesión JWT activa.
 */
function AdminContent() {
  const { user, loading: authLoading } = useAuth()
  const { refreshMetrics } = useData()

  // Re-fetch metrics when user becomes available (after login)
  useEffect(() => {
    if (user) {
      refreshMetrics()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-primary-gradient flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return user ? <AdminShell /> : <LoginPage />
}

/**
 * App — punto de entrada de la aplicación.
 *
 * Navegación:
 *  - URL raíz (/):        Landing page pública (Fundación MTM)
 *  - URL con #admin:      Panel administrativo protegido por login JWT
 */
export default function App() {
  const [showAdmin, setShowAdmin] = useState(window.location.hash === '#admin')

  useEffect(() => {
    const handler = () => setShowAdmin(window.location.hash === '#admin')
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  if (showAdmin) {
    return (
      <PrimeReactProvider>
        <AuthProvider>
          <DataProvider>
            <AdminContent />
          </DataProvider>
        </AuthProvider>
      </PrimeReactProvider>
    )
  }

  return (
    <PrimeReactProvider>
      <Index />
    </PrimeReactProvider>
  )
}

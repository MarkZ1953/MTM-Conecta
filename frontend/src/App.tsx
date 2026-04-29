import { useState, useEffect } from 'react'
import { PrimeReactProvider } from 'primereact/api'
import Index from './pages/Index.tsx'
import AdminShell from './admin/pages/AdminShell.tsx'
import LoginPage from './admin/pages/LoginPage.tsx'
import { AuthProvider, useAuth } from './admin/context/AuthContext.tsx'
import { DataProvider } from './admin/context/DataContext.tsx'

/**
 * AdminRouter — muestra el shell o el login según si hay sesión activa.
 * TODO: cuando el backend JWT esté listo, conectar con el AuthContext real
 * (src/auth/context/) en vez del AuthContext local de admin/.
 */
function AdminRouter() {
  const { user } = useAuth()
  return user ? <AdminShell /> : <LoginPage />
}

/**
 * App — punto de entrada de la aplicación.
 *
 * Navegación:
 *  - URL raíz (/):        Landing page pública (Fundación MTM)
 *  - URL con #admin:      Panel administrativo protegido por login
 *
 * TODO (Fase 2): migrar a React Router real con rutas /login, /dashboard, etc.
 * cuando el AuthProvider de src/auth/context/ esté implementado.
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
            <AdminRouter />
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

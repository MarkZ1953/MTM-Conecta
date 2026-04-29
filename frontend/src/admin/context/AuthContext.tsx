import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, AdminModule } from '../types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => void
  logout: () => void
  canAccess: (module: AdminModule) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Administrador',
    email: 'admin@mtm.org',
    role: 'admin',
    permissions: ['dashboard', 'beneficiarios', 'donantes', 'donaciones', 'proyectos', 'reportes', 'usuarios', 'roles', 'auditoria'],
  })

  const login = (email: string, password: string) => {
    if (email === 'admin@mtm.org' && password === 'admin123') {
      setUser({
        id: '1',
        name: 'Administrador',
        email: 'admin@mtm.org',
        role: 'admin',
        permissions: ['dashboard', 'beneficiarios', 'donantes', 'donaciones', 'proyectos', 'reportes', 'usuarios', 'roles', 'auditoria'],
      })
    }
  }

  const logout = () => {
    setUser(null)
  }

  const canAccess = (module: AdminModule) => {
    return user?.permissions.includes(module) ?? false
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, canAccess }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

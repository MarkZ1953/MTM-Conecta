import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { User, AdminModule } from '../types'
import API_BASE_URL from '@/config/api.config'

/* ── Token helpers ──────────────────────────────────────── */

const TOKEN_KEY = 'mtm_access'
const REFRESH_KEY = 'mtm_refresh'

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY)
}

function saveTokens(access: string, refresh: string) {
  localStorage.setItem(TOKEN_KEY, access)
  localStorage.setItem(REFRESH_KEY, refresh)
}

function clearTokens() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

/* ── Context type ───────────────────────────────────────── */

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<string | null>
  logout: () => void
  canAccess: (module: AdminModule) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/* ── Helpers ────────────────────────────────────────────── */

/**
 * Decode JWT payload without a library.
 * Only reads the BASE64-encoded middle segment.
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64 = token.split('.')[1]
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

function buildUserFromToken(token: string, extra?: Record<string, any>): User {
  const payload = decodeJwtPayload(token)
  return {
    id: String(extra?.id ?? payload?.user_id ?? ''),
    name: extra?.nombre_completo ?? payload?.nombre_completo ?? 'Admin',
    email: extra?.email ?? payload?.email ?? '',
    role: (extra?.is_staff ?? payload?.is_staff) ? 'admin' : 'user',
    // Admin always gets all modules. Fine-grained RBAC can come later.
    permissions: [
      'dashboard', 'beneficiarios', 'donantes', 'donaciones',
      'proyectos', 'voluntarios', 'reportes', 'usuarios', 'roles', 'auditoria',
    ],
  }
}

/* ── Provider ───────────────────────────────────────────── */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) // true while checking existing tokens

  /* ── Bootstrap: check for existing session on mount ──── */
  useEffect(() => {
    const token = getAccessToken()
    if (token) {
      const payload = decodeJwtPayload(token)
      // Check expiration (exp is in seconds)
      if (payload?.exp && payload.exp * 1000 > Date.now()) {
        setUser(buildUserFromToken(token))
      } else {
        // Try refreshing
        refreshAccessToken().then((ok) => {
          if (!ok) clearTokens()
        })
      }
    }
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── Refresh helper ──────────────────────────────────── */
  async function refreshAccessToken(): Promise<boolean> {
    const refresh = getRefreshToken()
    if (!refresh) return false
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      })
      if (!res.ok) return false
      const data = await res.json()
      saveTokens(data.access, data.refresh ?? refresh)
      setUser(buildUserFromToken(data.access))
      return true
    } catch {
      return false
    }
  }

  /* ── Login ───────────────────────────────────────────── */
  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        return err.detail ?? 'Credenciales inválidas'
      }

      const data = await res.json()
      // data = { access, refresh, usuario: { id, email, nombre_completo, is_staff } }
      saveTokens(data.access, data.refresh)
      setUser(buildUserFromToken(data.access, data.usuario))
      return null // null = success
    } catch {
      return 'Error de conexión con el servidor'
    }
  }, [])

  /* ── Logout ──────────────────────────────────────────── */
  const logout = useCallback(() => {
    const refresh = getRefreshToken()
    const access = getAccessToken()
    // Best-effort server-side blacklist
    if (refresh && access) {
      fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ refresh }),
      }).catch(() => {})
    }
    clearTokens()
    setUser(null)
  }, [])

  /* ── canAccess ───────────────────────────────────────── */
  const canAccess = useCallback(
    (module: AdminModule) => user?.permissions.includes(module) ?? false,
    [user],
  )

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, canAccess }}>
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

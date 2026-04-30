import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { DashboardData } from '../types'
import API_BASE_URL from '@/config/api.config'
import { getAccessToken } from './AuthContext'

interface DataContextType {
  dashboardData: DashboardData
  updateDashboardData: (data: Partial<DashboardData>) => void
  loading: boolean
  refreshMetrics: () => Promise<void>
  apiFetch: (path: string) => Promise<Response>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const emptyData: DashboardData = {
  totalBeneficiarios: 0,
  totalDonaciones: 0,
  proyectosActivos: 0,
  donantesRegistrados: 0,
  totalVoluntarios: 0,
  donacionesMes: [],
  donacionesPorTipo: [],
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [dashboardData, setDashboardData] = useState<DashboardData>(emptyData)
  const [loading, setLoading] = useState(false)

  /** Hace fetch autenticado a cualquier ruta bajo API_BASE_URL */
  const apiFetch = useCallback((path: string) => {
    const token = getAccessToken()
    return fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  }, [])

  const refreshMetrics = useCallback(async () => {
    const token = getAccessToken()
    if (!token) return
    setLoading(true)
    try {
      const res = await apiFetch('/dashboard/metrics/')
      if (res.ok) {
        const data = await res.json()
        setDashboardData(data)
      }
    } catch (err) {
      console.error('Error fetching dashboard metrics', err)
    } finally {
      setLoading(false)
    }
  }, [apiFetch])

  const updateDashboardData = (data: Partial<DashboardData>) => {
    setDashboardData(prev => ({ ...prev, ...data }))
  }

  return (
    <DataContext.Provider value={{ dashboardData, updateDashboardData, loading, refreshMetrics, apiFetch }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData debe usarse dentro de DataProvider')
  }
  return context
}

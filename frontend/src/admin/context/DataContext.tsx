import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { DashboardData } from '../types'

interface DataContextType {
  dashboardData: DashboardData
  updateDashboardData: (data: Partial<DashboardData>) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const initialData: DashboardData = {
  totalBeneficiarios: 542,
  totalDonaciones: 187,
  proyectosActivos: 3,
  donantesRegistrados: 89,
  donacionesMes: [
    { mes: 'Ene', monto: 12000 },
    { mes: 'Feb', monto: 9000 },
    { mes: 'Mar', monto: 15000 },
    { mes: 'Abr', monto: 10000 },
    { mes: 'May', monto: 18000 },
    { mes: 'Jun', monto: 23000 },
  ],
  donacionesPorTipo: [
    { name: 'Dinero', cantidad: 45, color: '#3B82F6' },
    { name: 'Alimentos', cantidad: 32, color: '#06B6D4' },
    { name: 'Servicios', cantidad: 12, color: '#10B981' },
    { name: 'Otros', cantidad: 8, color: '#F97316' },
  ],
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialData)

  const updateDashboardData = (data: Partial<DashboardData>) => {
    setDashboardData(prev => ({ ...prev, ...data }))
  }

  return (
    <DataContext.Provider value={{ dashboardData, updateDashboardData }}>
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

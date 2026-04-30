export type AdminModule = 
  | 'dashboard'
  | 'beneficiarios'
  | 'donantes'
  | 'donaciones'
  | 'proyectos'
  | 'voluntarios'
  | 'reportes'
  | 'usuarios'
  | 'roles'
  | 'auditoria'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  permissions: string[]
}

export interface DashboardData {
  totalBeneficiarios: number
  totalDonaciones: number
  proyectosActivos: number
  donantesRegistrados: number
  totalVoluntarios: number
  donacionesMes: Array<{
    mes: string
    monto: number
  }>
  donacionesPorTipo: Array<{
    name: string
    cantidad: number
    color: string
  }>
}

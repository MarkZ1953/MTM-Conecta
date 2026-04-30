import { useState, useEffect } from 'react'
import CrudTable from '../components/shared/CrudTable'
import { useData } from '../context/DataContext'

interface DonacionRow {
  id: number
  donante: string
  monto: string
  tipo: string
  fecha: string
  estado: string
}

export default function DonationsPage() {
  const { apiFetch } = useData()
  const [data, setData] = useState<DonacionRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/donaciones/?page_size=100')
      .then(r => r.json())
      .then(json => {
        const results = json.results ?? []
        const rows: DonacionRow[] = results.map((d: any) => ({
          id: d.id,
          donante: d.donante_nombre ?? d.donante ?? '—',
          monto: d.monto != null ? `$${Number(d.monto).toLocaleString('es-CO')}` : '(especie)',
          tipo: d.tipo_donacion_display ?? d.tipo_donacion ?? '—',
          fecha: d.fecha_donacion ?? '—',
          estado: d.estado_display ?? d.estado ?? '—',
        }))
        setData(rows)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [apiFetch])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <CrudTable
        data={data}
        columns={[
          { field: 'donante', header: 'Donante' },
          { field: 'monto', header: 'Monto / Tipo especie' },
          { field: 'tipo', header: 'Tipo' },
          { field: 'fecha', header: 'Fecha' },
          { field: 'estado', header: 'Estado' },
        ]}
        title="Donaciones"
        onAdd={() => console.log('Agregar donación')}
      />
    </div>
  )
}

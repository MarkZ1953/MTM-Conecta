import { useState, useEffect } from 'react'
import CrudTable from '../components/shared/CrudTable'
import { useData } from '../context/DataContext'

interface VoluntarioRow {
  id: number
  nombre: string
  email: string
  telefono: string
  disponibilidad: string
  estado: string
  fecha_inicio: string
}

export default function VolunteersPage() {
  const { apiFetch } = useData()
  const [data, setData] = useState<VoluntarioRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/voluntarios/?page_size=100')
      .then(r => r.json())
      .then(json => {
        const results = json.results ?? []
        const rows: VoluntarioRow[] = results.map((v: any) => ({
          id: v.id,
          nombre: v.nombre_completo ?? '—',
          email: v.email ?? '—',
          telefono: v.telefono ?? '—',
          disponibilidad: v.disponibilidad_display ?? v.disponibilidad ?? '—',
          estado: v.estado_display ?? v.estado ?? '—',
          fecha_inicio: v.fecha_inicio ?? '—',
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
          { field: 'nombre', header: 'Nombre' },
          { field: 'email', header: 'Email' },
          { field: 'telefono', header: 'Teléfono' },
          { field: 'disponibilidad', header: 'Disponibilidad' },
          { field: 'estado', header: 'Estado' },
          { field: 'fecha_inicio', header: 'Fecha de Inicio' },
        ]}
        title="Voluntarios"
        onAdd={() => console.log('Agregar voluntario')}
      />
    </div>
  )
}

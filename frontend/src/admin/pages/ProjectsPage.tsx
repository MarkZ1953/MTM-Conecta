import { useState, useEffect } from 'react'
import CrudTable from '../components/shared/CrudTable'
import { useData } from '../context/DataContext'

interface ProyectoRow {
  id: number
  nombre: string
  descripcion: string
  presupuesto: string
  estado: string
}

export default function ProjectsPage() {
  const { apiFetch } = useData()
  const [data, setData] = useState<ProyectoRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/proyectos/?page_size=100')
      .then(r => r.json())
      .then(json => {
        const results = json.results ?? []
        const rows: ProyectoRow[] = results.map((p: any) => ({
          id: p.id,
          nombre: p.nombre ?? '—',
          descripcion: p.descripcion ? p.descripcion.substring(0, 70) + '…' : '—',
          presupuesto: p.presupuesto != null
            ? `$${Number(p.presupuesto).toLocaleString('es-CO')}`
            : '—',
          estado: p.estado_display ?? p.estado ?? '—',
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
          { field: 'descripcion', header: 'Descripción' },
          { field: 'presupuesto', header: 'Presupuesto' },
          { field: 'estado', header: 'Estado' },
        ]}
        title="Proyectos"
        onAdd={() => console.log('Agregar proyecto')}
      />
    </div>
  )
}

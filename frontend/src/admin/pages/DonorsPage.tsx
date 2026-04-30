import { useState, useEffect } from 'react'
import CrudTable from '../components/shared/CrudTable'
import { useData } from '../context/DataContext'

interface DonanteRow {
  id: number
  nombre: string
  email: string
  tipo: string
  ciudad: string
  estado: string
}

export default function DonorsPage() {
  const { apiFetch } = useData()
  const [data, setData] = useState<DonanteRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/donantes/?page_size=100')
      .then(r => r.json())
      .then(json => {
        const results = json.results ?? []
        const rows: DonanteRow[] = results.map((d: any) => ({
          id: d.id,
          nombre: d.nombre_display ?? '—',
          email: d.email ?? '—',
          tipo: d.tipo_donante === 'empresa' ? 'Empresa' : 'Persona natural',
          ciudad: d.ciudad ?? '—',
          estado: d.activo ? 'Activo' : 'Inactivo',
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
          { field: 'tipo', header: 'Tipo' },
          { field: 'ciudad', header: 'Ciudad' },
          { field: 'estado', header: 'Estado' },
        ]}
        title="Donantes"
        onAdd={() => console.log('Agregar donante')}
      />
    </div>
  )
}

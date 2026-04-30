import { useState, useEffect } from 'react'
import CrudTable from '../components/shared/CrudTable'
import { useData } from '../context/DataContext'

interface BeneficiarioRow {
  id: number
  nombre: string
  diagnostico: string
  estado: string
  registrado: string
}

export default function BeneficiariesPage() {
  const { apiFetch } = useData()
  const [data, setData] = useState<BeneficiarioRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/beneficiarios/?page_size=100')
      .then(r => r.json())
      .then(json => {
        const results = json.results ?? []
        const rows: BeneficiarioRow[] = results.map((b: any) => ({
          id: b.id,
          nombre: b.nombre_completo ?? b.persona_nombre ?? '—',
          diagnostico: b.diagnostico ? b.diagnostico.substring(0, 60) + '…' : '—',
          estado: b.activo ? 'Activo' : 'Inactivo',
          registrado: b.created_at ? b.created_at.substring(0, 10) : '—',
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
          { field: 'diagnostico', header: 'Diagnóstico' },
          { field: 'estado', header: 'Estado' },
          { field: 'registrado', header: 'Fecha de Registro' },
        ]}
        title="Beneficiarios"
        onAdd={() => console.log('Agregar beneficiario')}
      />
    </div>
  )
}

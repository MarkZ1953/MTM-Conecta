import CrudTable from '../components/shared/CrudTable'

export default function ReportsPage() {
  const mockData = [
    { id: 1, titulo: 'Reporte Mensual Enero', tipo: 'General', fecha: '2024-02-01', generadoPor: 'Admin' },
    { id: 2, titulo: 'Análisis de Donaciones', tipo: 'Financiero', fecha: '2024-02-05', generadoPor: 'Admin' },
    { id: 3, titulo: 'Impacto Social Q1', tipo: 'Social', fecha: '2024-02-10', generadoPor: 'Admin' },
  ]

  return (
    <div>
      <CrudTable
        data={mockData}
        columns={[
          { field: 'titulo', header: 'Título' },
          { field: 'tipo', header: 'Tipo' },
          { field: 'fecha', header: 'Fecha' },
          { field: 'generadoPor', header: 'Generado por' },
        ]}
        title="Reportes"
        onAdd={() => console.log('Generar nuevo reporte')}
      />
    </div>
  )
}

import CrudTable from '../components/shared/CrudTable'

export default function DonationsPage() {
  const mockData = [
    { id: 1, donante: 'Empresa A', monto: '€5,000', tipo: 'Dinero', fecha: '2024-01-15', estado: 'Completado' },
    { id: 2, donante: 'Persona B', monto: '€500', tipo: 'Dinero', fecha: '2024-01-20', estado: 'Completado' },
    { id: 3, donante: 'Fundación C', monto: '€2,500', tipo: 'Servicios', fecha: '2024-02-01', estado: 'Pendiente' },
  ]

  return (
    <div>
      <CrudTable
        data={mockData}
        columns={[
          { field: 'donante', header: 'Donante' },
          { field: 'monto', header: 'Monto' },
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

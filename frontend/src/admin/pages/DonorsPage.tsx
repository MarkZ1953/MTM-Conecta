import CrudTable from '../components/shared/CrudTable'

export default function DonorsPage() {
  const mockData = [
    { id: 1, nombre: 'Empresa A', email: 'contact@empresaa.com', monto: '€5,000', estado: 'Activo' },
    { id: 2, nombre: 'Persona B', email: 'person@example.com', monto: '€500', estado: 'Activo' },
    { id: 3, nombre: 'Fundación C', email: 'info@fundacionc.org', monto: '€2,500', estado: 'Inactivo' },
  ]

  return (
    <div>
      <CrudTable
        data={mockData}
        columns={[
          { field: 'nombre', header: 'Nombre' },
          { field: 'email', header: 'Email' },
          { field: 'monto', header: 'Monto Donado' },
          { field: 'estado', header: 'Estado' },
        ]}
        title="Donantes"
        onAdd={() => console.log('Agregar donante')}
      />
    </div>
  )
}

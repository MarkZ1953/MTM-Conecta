import CrudTable from '../components/shared/CrudTable'

export default function BeneficiariesPage() {
  const mockData = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', estado: 'Activo', registrado: '2024-01-15' },
    { id: 2, nombre: 'María González', email: 'maria@example.com', estado: 'Activo', registrado: '2024-01-20' },
    { id: 3, nombre: 'Carlos López', email: 'carlos@example.com', estado: 'Inactivo', registrado: '2024-02-01' },
  ]

  return (
    <div>
      <CrudTable
        data={mockData}
        columns={[
          { field: 'nombre', header: 'Nombre' },
          { field: 'email', header: 'Email' },
          { field: 'estado', header: 'Estado' },
          { field: 'registrado', header: 'Fecha de Registro' },
        ]}
        title="Beneficiarios"
        onAdd={() => console.log('Agregar beneficiario')}
      />
    </div>
  )
}

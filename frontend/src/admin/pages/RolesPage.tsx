import CrudTable from '../components/shared/CrudTable'

export default function RolesPage() {
  const mockData = [
    { id: 1, nombre: 'Admin', descripcion: 'Acceso total al sistema', permisos: 'Todos', estado: 'Activo' },
    { id: 2, nombre: 'Gerente', descripcion: 'Gestión de proyectos y donaciones', permisos: 'Lectura/Escritura', estado: 'Activo' },
    { id: 3, nombre: 'Usuario', descripcion: 'Acceso limitado', permisos: 'Lectura', estado: 'Activo' },
  ]

  return (
    <div>
      <CrudTable
        data={mockData}
        columns={[
          { field: 'nombre', header: 'Nombre' },
          { field: 'descripcion', header: 'Descripción' },
          { field: 'permisos', header: 'Permisos' },
          { field: 'estado', header: 'Estado' },
        ]}
        title="Roles"
        onAdd={() => console.log('Agregar rol')}
      />
    </div>
  )
}

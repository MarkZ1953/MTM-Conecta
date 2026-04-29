import CrudTable from '../components/shared/CrudTable'

export default function UsersPage() {
  const mockData = [
    { id: 1, nombre: 'Administrador', email: 'admin@mtm.org', rol: 'Admin', estado: 'Activo' },
    { id: 2, nombre: 'Gerente', email: 'gerente@mtm.org', rol: 'Gerente', estado: 'Activo' },
    { id: 3, nombre: 'Voluntario', email: 'voluntario@mtm.org', rol: 'Usuario', estado: 'Activo' },
  ]

  return (
    <div>
      <CrudTable
        data={mockData}
        columns={[
          { field: 'nombre', header: 'Nombre' },
          { field: 'email', header: 'Email' },
          { field: 'rol', header: 'Rol' },
          { field: 'estado', header: 'Estado' },
        ]}
        title="Usuarios"
        onAdd={() => console.log('Agregar usuario')}
      />
    </div>
  )
}

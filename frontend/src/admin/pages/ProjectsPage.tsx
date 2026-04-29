import CrudTable from '../components/shared/CrudTable'

export default function ProjectsPage() {
  const mockData = [
    { id: 1, nombre: 'Proyecto Educación', descripcion: 'Apoyo educativo a comunidades', presupuesto: '€10,000', estado: 'Activo' },
    { id: 2, nombre: 'Comedor Infantil', descripcion: 'Programa de alimentación', presupuesto: '€5,000', estado: 'Activo' },
    { id: 3, nombre: 'Capacitación Laboral', descripcion: 'Formación para empleo', presupuesto: '€8,000', estado: 'Completado' },
  ]

  return (
    <div>
      <CrudTable
        data={mockData}
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

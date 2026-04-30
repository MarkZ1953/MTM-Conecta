import CrudTable from '../components/shared/CrudTable'

export default function AuditPage() {
  const mockData = [
    { id: 1, usuario: 'admin@mtm.org', accion: 'Crear donación', modulo: 'Donaciones', fecha: '2024-02-15 10:30', detalles: 'Nueva donación €500' },
    { id: 2, usuario: 'gerente@mtm.org', accion: 'Actualizar beneficiario', modulo: 'Beneficiarios', fecha: '2024-02-15 09:15', detalles: 'Actualización de datos' },
    { id: 3, usuario: 'admin@mtm.org', accion: 'Exportar reporte', modulo: 'Reportes', fecha: '2024-02-14 16:45', detalles: 'Reporte mensual' },
  ]

  return (
    <div>
      <CrudTable
        data={mockData}
        columns={[
          { field: 'usuario', header: 'Usuario' },
          { field: 'accion', header: 'Acción' },
          { field: 'modulo', header: 'Módulo' },
          { field: 'fecha', header: 'Fecha' },
          { field: 'detalles', header: 'Detalles' },
        ]}
        title="Auditoría"
      />
    </div>
  )
}

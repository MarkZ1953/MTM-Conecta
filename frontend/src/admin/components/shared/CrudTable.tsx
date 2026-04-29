import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { useState } from 'react'

interface CrudTableProps {
  data: unknown[]
  columns: Array<{ field: string; header: string }>
  title: string
  onAdd?: () => void
  onEdit?: (row: unknown) => void
  onDelete?: (row: unknown) => void
}

export default function CrudTable({ data, columns, title, onAdd, onEdit, onDelete }: CrudTableProps) {
  const [globalFilter, setGlobalFilter] = useState('')

  const actionTemplate = (rowData: unknown) => {
    return (
      <div className="flex gap-2">
        {onEdit && (
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-warning p-button-sm"
            onClick={() => onEdit(rowData)}
          />
        )}
        {onDelete && (
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger p-button-sm"
            onClick={() => onDelete(rowData)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {onAdd && (
          <Button
            label="Agregar"
            icon="pi pi-plus"
            onClick={onAdd}
            className="p-button-success"
          />
        )}
      </div>

      <div className="mb-4">
        <InputText
          type="search"
          onInput={e => setGlobalFilter((e.target as HTMLInputElement).value)}
          placeholder="Buscar..."
          className="w-full"
        />
      </div>

      <DataTable
        value={data as Record<string, unknown>[]}
        globalFilter={globalFilter}
        paginator
        rows={10}
        dataKey="id"
        className="p-datatable-striped"
      >
        {columns.map(col => (
          <Column key={col.field} field={col.field} header={col.header} />
        ))}
        {(onEdit || onDelete) && (
          <Column
            body={actionTemplate}
            header="Acciones"
            style={{ width: '10%' }}
          />
        )}
      </DataTable>
    </div>
  )
}

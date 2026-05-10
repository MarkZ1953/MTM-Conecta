import React, { useEffect, useState } from "react";
import { DataTable, toast, type ColumnDef, type DataTableFilterMeta, FilterMatchMode, FilterOperator } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { useUsersStore } from "./users.store";
import { buildQueryParams } from "@/utils";
import { usersAPI } from "./users.api";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { UIPageHeader } from "@/components";


const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  username: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  first_name: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  last_name: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  email: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
  },
};

export const UsersPage = () => {
  const {
    filters,
    setFilters,
    sorting,
    setSorting,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    refresh,
    setRefresh,
  } = useUsersStore();

  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  // Inicializa los filtros si están vacíos
  useEffect(() => {
    if (Object.keys(filters).length === 0) {
      setFilters(defaultFilters);
    } else if (filters['global'] && 'value' in filters['global']) {
      setGlobalFilterValue(filters['global'].value as string || '');
    }
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["users", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({
        columnFilters: filters,
        sorting,
        pageIndex,
        pageSize,
      });

      const { data } = await usersAPI.getAll({ params });

      return data;
    },
    throwOnError: (error: any) => {
      toast.error(error.message);
      return false;
    },
  });

  const users = data?.results ?? [];
  const totalCount = data?.count ?? 0;

  const clearFilter = () => {
    setFilters(defaultFilters);
    setGlobalFilterValue('');
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };

    // @ts-ignore
    if (!_filters['global']) _filters['global'] = { matchMode: FilterMatchMode.CONTAINS };
    // @ts-ignore
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button type="button" icon="pi pi-filter-slash" label="Limpiar Filtros" outlined onClick={clearFilter} />
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda global..." />
        </IconField>
      </div>
    );
  };

  const userColumns: ColumnDef<any>[] = [
    {
      accessorKey: "username",
      header: "Usuario",
      enableSorting: true,
      filter: true,
      filterPlaceholder: "Buscar usuario",
    },
    {
      accessorKey: "first_name",
      header: "Nombre",
      enableSorting: true,
      filter: true,
      filterPlaceholder: "Buscar nombre",
    },
    {
      accessorKey: "last_name",
      header: "Apellido",
      enableSorting: true,
      filter: true,
      filterPlaceholder: "Buscar apellido",
    },
    {
      accessorKey: "email",
      header: "Correo Electronico",
      enableSorting: true,
      filter: true,
      filterPlaceholder: "Buscar correo",
    }
  ];

  return (
    <div className="w-full flex-1 flex flex-column">
      <UIPageHeader
        title="Usuarios"
        description="Administra las cuentas de usuario, permisos y roles del sistema."
        icon="pi pi-users"
        actions={
          <>
            <Button label="Nuevo Usuario" icon="pi pi-plus" />
          </>
        }
      />

      <DataTable
        data={users}
        columns={userColumns}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageSizeChange={setPageSize}
        sorting={sorting}
        onSortingChange={setSorting}
        onPageChange={setPageIndex}
        isLoading={isLoading}

        // Filtros nativos de PrimeReact
        filters={filters}
        onFilter={setFilters}
        globalFilterFields={['username', 'first_name', 'last_name', 'email']}
        header={renderHeader()}
      />
    </div>
  );
}
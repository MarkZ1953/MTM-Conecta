import React, { useEffect, useState } from "react";
import type { Beneficiary } from "./beneficiaries.types";
import { DataTable, toast, type ColumnDef, type DataTableFilterMeta, FilterMatchMode, FilterOperator } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { useBeneficiariesStore } from "./beneficiaries.store";
import { buildQueryParams } from "@/utils";
import { beneficiariesAPI } from "./beneficiaries.api";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  first_name: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  last_name: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  identification_number: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
  },
};

export const BeneficiariesPage = () => {
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
  } = useBeneficiariesStore();

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
    queryKey: ["beneficiaries", sorting, filters, pageIndex, pageSize, refresh],
    queryFn: async () => {
      const params = buildQueryParams({
        columnFilters: filters,
        sorting,
        pageIndex,
        pageSize,
      });

      const { data } = await beneficiariesAPI.getAll({ params });

      return data;
    },
    throwOnError: (error: any) => {
      toast.error(error.message);
      return false;
    },
  });

  const beneficiaries = data?.results ?? [];
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

const beneficiarieColumns: ColumnDef<Beneficiary>[] = [
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
    accessorKey: "identification_number",
    header: "Identificación",
    enableSorting: true,
    filter: true,
    filterPlaceholder: "Buscar identificación",
  },
  {
    accessorKey: "birth_date",
    header: "Fecha de nacimiento",
    enableSorting: true,
    filter: false,
  },
];
  return (
    <div className="w-full flex-1 flex flex-col">
      <DataTable
        data={beneficiaries}
        columns={beneficiarieColumns}
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
        globalFilterFields={['first_name', 'last_name', 'identification_number']}
        header={renderHeader()}
      />
    </div>
  );
}
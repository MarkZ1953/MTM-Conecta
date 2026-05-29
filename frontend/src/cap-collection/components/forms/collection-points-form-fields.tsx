import { useFormContext, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { companiesAPI } from "@/cap-collection/cap-collection.api";
import { ComboboxObject } from "@/components";
import API_BASE_URL from "@/config/api.config";

export const CollectionPointsFormFields = () => {
  const { control, watch, formState: { errors } } = useFormContext();

  const [searchCompany, setSearchCompany] = useState<string>("");
  const companyId = watch("company");

  // Query to fetch selected company
  const { data: selectedCompany, isFetching: isLoadingSelected } = useQuery({
    queryKey: ["company", companyId],
    queryFn: async () => {
      if (!companyId || typeof companyId !== "number") return null;
      const response = await fetch(`${API_BASE_URL}/companies/${companyId}/`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) return null;
      const data = await response.json();
      return {
        ...data,
        name: `${data.nit} - ${data.business_name}`,
      };
    },
    enabled: !!companyId && typeof companyId === "number",
    staleTime: 5 * 60 * 1000,
  });

  // Query to search companies
  const { data: companies = [] } = useQuery({
    queryKey: ["companies", searchCompany],
    queryFn: async () => {
      const response = await companiesAPI.getAll({
        params: { search: searchCompany },
      });
      return (response.data.results ?? []).map((c) => ({
        id: c.id,
        name: `${c.nit} - ${c.business_name}`,
      }));
    },
    enabled: !!searchCompany,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      <div className="field col-12 mb-2">
        <label htmlFor="company" className="block mb-2 font-medium text-700">
          <i className="pi pi-building mr-2 text-primary" />
          Empresa
        </label>
        <Controller
          name="company"
          control={control}
          render={({ field }) => {
            const comboboxValue = selectedCompany
              ? { id: selectedCompany.id, name: selectedCompany.name }
              : null;

            const comboboxItems = [...companies];
            if (comboboxValue) {
              const exists = comboboxItems.some((item) => String(item.id) === String(comboboxValue.id));
              if (!exists) {
                comboboxItems.push(comboboxValue);
              }
            }

            return (
              <ComboboxObject
                items={comboboxItems}
                value={comboboxValue}
                onValueChange={(val) => {
                  field.onChange(val ? val.id : null);
                }}
                onSearch={setSearchCompany}
                onHide={() => setSearchCompany("")}
                placeholder="Busca y selecciona una empresa..."
                emptyMessage="No se encontraron empresas"
                className={errors.company?.message ? "p-invalid w-full" : "w-full"}
                loading={isLoadingSelected}
              />
            );
          }}
        />
        {errors.company?.message && <small className="p-error">{errors.company.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="name" className="block mb-2 font-medium text-700">
          <i className="pi pi-map-marker mr-2 text-primary" />
          Nombre de la Sede
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              className={errors.name?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: Sede Principal"
            />
          )}
        />
        {errors.name?.message && <small className="p-error">{errors.name.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="address" className="block mb-2 font-medium text-700">
          <i className="pi pi-home mr-2 text-primary" />
          Dirección
        </label>
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              className={errors.address?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: Calle 10 #20-30"
            />
          )}
        />
        {errors.address?.message && <small className="p-error">{errors.address.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="municipality" className="block mb-2 font-medium text-700">
          <i className="pi pi-globe mr-2 text-primary" />
          Municipio
        </label>
        <Controller
          name="municipality"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              className={errors.municipality?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: Medellín"
            />
          )}
        />
        {errors.municipality?.message && <small className="p-error">{errors.municipality.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="department" className="block mb-2 font-medium text-700">
          <i className="pi pi-globe mr-2 text-primary" />
          Departamento
        </label>
        <Controller
          name="department"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              className={errors.department?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: Antioquia"
            />
          )}
        />
        {errors.department?.message && <small className="p-error">{errors.department.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="contact_name" className="block mb-2 font-medium text-700">
          <i className="pi pi-user mr-2 text-primary" />
          Contacto de la Sede (opcional)
        </label>
        <Controller
          name="contact_name"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              className="w-full"
              placeholder="Ej: María López"
            />
          )}
        />
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="contact_phone" className="block mb-2 font-medium text-700">
          <i className="pi pi-phone mr-2 text-primary" />
          Teléfono de la Sede (opcional)
        </label>
        <Controller
          name="contact_phone"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              className="w-full"
              placeholder="Ej: 3009876543"
            />
          )}
        />
      </div>
    </div>
  );
};

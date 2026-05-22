import { useFormContext, Controller } from "react-hook-form";
import { beneficiariesAPI } from "@/beneficiaries";
import { useQuery } from "@tanstack/react-query";
import { InputText } from "primereact/inputtext";
import API_BASE_URL from "@/config/api.config";
import { ComboboxObject } from "@/components";
import { useState } from "react";

export const GuardiansFormFields = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const [searchBeneficiary, setSearchBeneficiary] = useState<string>("");

  // Observa el ID del beneficiario seleccionado
  const beneficiaryId = watch("beneficiary");

  // Query para cargar el beneficiario seleccionado
  const { data: selectedBeneficiary, isFetching: isLoadingSelected } = useQuery(
    {
      queryKey: ["beneficiary", beneficiaryId],
      queryFn: async () => {
        if (!beneficiaryId || typeof beneficiaryId !== "number") return null;
        const response = await fetch(
          `${API_BASE_URL}/beneficiaries/${beneficiaryId}/`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) return null;
        const data = await response.json();
        return {
          ...data,
          fullName: `${data.first_name} ${data.last_name}`,
        };
      },
      enabled: !!beneficiaryId && typeof beneficiaryId === "number",
      staleTime: 5 * 60 * 1000,
    },
  );

  // Query para buscar sugerencias según el texto que ingresa el usuario
  const { data: beneficiaries = [] } = useQuery({
    queryKey: ["beneficiaries", searchBeneficiary],
    queryFn: async () => {
      const response = await beneficiariesAPI.getAll({
        params: { full_name: searchBeneficiary },
      });

      return (response.data.results ?? []).map((b) => ({
        id: b.id,
        name: `${b.first_name} ${b.last_name}`,
      }));
    },
    enabled: !!searchBeneficiary,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      <div className="field col-12 mb-2">
        <label
          htmlFor="beneficiary"
          className="block mb-2 font-medium text-700"
        >
          <i className="pi pi-users mr-2 text-primary" />
          Beneficiario
        </label>
        <Controller
          name="beneficiary"
          control={control}
          render={({ field }) => {
            const comboboxValue = selectedBeneficiary
              ? {
                  id: selectedBeneficiary.id,
                  name: selectedBeneficiary.fullName,
                }
              : null;

            // Asegurar que el beneficiario seleccionado siempre esté en la lista de opciones de PrimeReact Dropdown
            const comboboxItems = [...beneficiaries];
            if (comboboxValue) {
              const exists = comboboxItems.some(
                (item) => String(item.id) === String(comboboxValue.id),
              );
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
                onSearch={setSearchBeneficiary}
                onHide={() => setSearchBeneficiary("")}
                placeholder="Busca y selecciona un beneficiario..."
                emptyMessage="No se encontraron beneficiarios"
                className={
                  errors.beneficiary?.message ? "p-invalid w-full" : "w-full"
                }
                loading={isLoadingSelected}
              />
            );
          }}
        />
        {errors.beneficiary?.message && (
          <small className="p-error">
            {errors.beneficiary.message.toString()}
          </small>
        )}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="first_name" className="block mb-2 font-medium text-700">
          <i className="pi pi-id-card mr-2 text-primary" />
          Nombres
        </label>
        <Controller
          name="first_name"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={
                errors.first_name?.message ? "p-invalid w-full" : "w-full"
              }
              placeholder="Nombres del tutor"
            />
          )}
        />
        {errors.first_name?.message && (
          <small className="p-error">
            {errors.first_name.message.toString()}
          </small>
        )}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="last_name" className="block mb-2 font-medium text-700">
          <i className="pi pi-id-card mr-2 text-primary" />
          Apellidos
        </label>
        <Controller
          name="last_name"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={
                errors.last_name?.message ? "p-invalid w-full" : "w-full"
              }
              placeholder="Apellidos del tutor"
            />
          )}
        />
        {errors.last_name?.message && (
          <small className="p-error">
            {errors.last_name.message.toString()}
          </small>
        )}
      </div>

      <div className="field col-12 mb-2">
        <label
          htmlFor="identification_number"
          className="block mb-2 font-medium text-700"
        >
          <i className="pi pi-id-card mr-2 text-primary" />
          Número de Identificación
        </label>
        <Controller
          name="identification_number"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={
                errors.identification_number?.message
                  ? "p-invalid w-full"
                  : "w-full"
              }
              placeholder="Ej: 12345678"
            />
          )}
        />
        {errors.identification_number?.message && (
          <small className="p-error">
            {errors.identification_number.message.toString()}
          </small>
        )}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label
          htmlFor="phone_number"
          className="block mb-2 font-medium text-700"
        >
          <i className="pi pi-phone mr-2 text-primary" />
          Teléfono
        </label>
        <Controller
          name="phone_number"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={
                errors.phone_number?.message ? "p-invalid w-full" : "w-full"
              }
              placeholder="Ej: 555-1234"
            />
          )}
        />
        {errors.phone_number?.message && (
          <small className="p-error">
            {errors.phone_number.message.toString()}
          </small>
        )}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="email" className="block mb-2 font-medium text-700">
          <i className="pi pi-envelope mr-2 text-primary" />
          Correo Electrónico
        </label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              type="email"
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={errors.email?.message ? "p-invalid w-full" : "w-full"}
              placeholder="ejemplo@correo.com"
            />
          )}
        />
        {errors.email?.message && (
          <small className="p-error">{errors.email.message.toString()}</small>
        )}
      </div>
    </div>
  );
};

import { useFormContext, Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { donorsAPI } from "@/donors";
import { ComboboxObject } from "@/components";
import API_BASE_URL from "@/config/api.config";
import { donationStatusLabels, donationTypeLabels } from "@/donations/donations.types";

const statusOptions = Object.entries(donationStatusLabels).map(([value, label]) => ({
  value,
  label,
}));

const donationTypeOptions = Object.entries(donationTypeLabels).map(([value, label]) => ({
  value,
  label,
}));

export const DonationsFormFields = () => {
  const { control, watch, formState: { errors } } = useFormContext();

  const [searchDonor, setSearchDonor] = useState<string>("");
  const donorId = watch("donor");

  // Query to fetch selected donor
  const { data: selectedDonor, isFetching: isLoadingSelected } = useQuery({
    queryKey: ["donor", donorId],
    queryFn: async () => {
      if (!donorId || typeof donorId !== "number") return null;
      const response = await fetch(`${API_BASE_URL}/donors/${donorId}/`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) return null;
      const data = await response.json();
      return {
        ...data,
        fullName: `${data.first_name} ${data.last_name}`,
      };
    },
    enabled: !!donorId && typeof donorId === "number",
    staleTime: 5 * 60 * 1000,
  });

  // Query to search donors
  const { data: donors = [] } = useQuery({
    queryKey: ["donors", searchDonor],
    queryFn: async () => {
      const response = await donorsAPI.getAll({
        params: { search: searchDonor },
      });
      return (response.data.results ?? []).map((d) => ({
        id: d.id,
        name: `${d.first_name} ${d.last_name}`,
      }));
    },
    enabled: !!searchDonor,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="donor" className="block mb-2 font-medium text-700">
          <i className="pi pi-user mr-2 text-primary" />
          Donante
        </label>
        <Controller
          name="donor"
          control={control}
          render={({ field }) => {
            const comboboxValue = selectedDonor
              ? {
                  id: selectedDonor.id,
                  name: selectedDonor.fullName,
                }
              : null;

            const comboboxItems = [...donors];
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
                onSearch={setSearchDonor}
                onHide={() => setSearchDonor("")}
                placeholder="Busca y selecciona un donante..."
                emptyMessage="No se encontraron donantes"
                className={errors.donor?.message ? "p-invalid w-full" : "w-full"}
                loading={isLoadingSelected}
              />
            );
          }}
        />
        {errors.donor?.message && <small className="p-error">{errors.donor.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="donation_type" className="block mb-2 font-medium text-700">
          <i className="pi pi-tags mr-2 text-primary" />
          Tipo de donación
        </label>
        <Controller
          name="donation_type"
          control={control}
          render={({ field }) => (
            <Dropdown
              id={field.name}
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              options={donationTypeOptions}
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar tipo"
              className={errors.donation_type?.message ? "p-invalid w-full" : "w-full"}
            />
          )}
        />
        {errors.donation_type?.message && (
          <small className="p-error">{errors.donation_type.message.toString()}</small>
        )}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="amount" className="block mb-2 font-medium text-700">
          <i className="pi pi-dollar mr-2 text-primary" />
          Monto
        </label>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <InputNumber
              id={field.name}
              value={field.value}
              onValueChange={(e) => field.onChange(e.value)}
              mode="currency"
              currency="COP"
              locale="es-CO"
              className={errors.amount?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: 100.000"
            />
          )}
        />
        {errors.amount?.message && <small className="p-error">{errors.amount.message.toString()}</small>}
      </div>

      <div className="field col-12 mb-2">
        <label htmlFor="status" className="block mb-2 font-medium text-700">
          <i className="pi pi-info-circle mr-2 text-primary" />
          Estado
        </label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Dropdown
              id={field.name}
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              options={statusOptions}
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar Estado"
              className={errors.status?.message ? "p-invalid w-full" : "w-full"}
            />
          )}
        />
        {errors.status?.message && <small className="p-error">{errors.status.message.toString()}</small>}
      </div>
    </div>
  );
};

import { useFormContext, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";

const statusOptions = [
  { label: "Pendiente", value: "PENDING" },
  { label: "Completada", value: "COMPLETED" },
  { label: "Fallida", value: "FAILED" },
];

export const DonationsFormFields = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="donor" className="block mb-2 font-medium text-700">
          <i className="pi pi-user mr-2 text-primary" />
          ID del Donante
        </label>
        <Controller
          name="donor"
          control={control}
          render={({ field }) => (
            <InputNumber
              id={field.name}
              value={field.value}
              onValueChange={(e) => field.onChange(e.value)}
              className={errors.donor?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: 1"
              useGrouping={false}
            />
          )}
        />
        {errors.donor?.message && <small className="p-error">{errors.donor.message.toString()}</small>}
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
              currency="USD"
              locale="en-US"
              className={errors.amount?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: 100.00"
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

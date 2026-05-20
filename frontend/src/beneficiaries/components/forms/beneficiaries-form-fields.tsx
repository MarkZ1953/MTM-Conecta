import { useFormContext, useFormState } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

const fields = [
  {
    name: "first_name",
    label: "Nombre",
    icon: "pi pi-user",
    placeholder: "Ej: Juan",
  },
  {
    name: "last_name",
    label: "Apellido",
    icon: "pi pi-user",
    placeholder: "Ej: Perez",
  },
  {
    name: "identification_number",
    label: "Identificación",
    icon: "pi pi-id-card",
    placeholder: "Ej: 123456789",
  },
  {
    name: "birth_date",
    label: "Fecha de nacimiento",
    icon: "pi pi-calendar",
    placeholder: "YYYY-MM-DD",
    type: "date"
  },
];

export const BeneficiariesFormFields = () => {
  const { register } = useFormContext();
  const { errors } = useFormState();

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      {fields.map((field) => {
        const error = errors[field.name]?.message?.toString();

        return (
          <div key={field.name} className="field col-12 md:col-6 mb-2">
            <label htmlFor={field.name} className="block mb-2 font-medium text-700">
              <i className={`${field.icon} mr-2 text-primary`} />
              {field.label}
            </label>
            <InputText
              id={field.name}
              type={field.type || "text"}
              className={error ? "p-invalid w-full" : "w-full"}
              placeholder={field.placeholder}
              {...register(field.name)}
            />
            {error && <small className="p-error">{error}</small>}
          </div>
        );
      })}
      
      <div className="field col-12 mb-2">
        <label htmlFor="notes" className="block mb-2 font-medium text-700">
          <i className="pi pi-align-left mr-2 text-primary" />
          Notas
        </label>
        <InputTextarea
          id="notes"
          rows={3}
          className={errors.notes?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Notas adicionales..."
          {...register("notes")}
        />
        {errors.notes?.message && <small className="p-error">{errors.notes.message.toString()}</small>}
      </div>
    </div>
  );
};

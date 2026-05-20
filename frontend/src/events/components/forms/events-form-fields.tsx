import { useFormContext, useFormState } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

const fields = [
  {
    name: "title",
    label: "Título",
    icon: "pi pi-calendar-plus",
    placeholder: "Ej: Taller de Capacitación",
  },
  {
    name: "location",
    label: "Ubicación",
    icon: "pi pi-map-marker",
    placeholder: "Ej: Auditorio Principal",
  },
  {
    name: "start_date",
    label: "Fecha y Hora de Inicio",
    icon: "pi pi-clock",
    placeholder: "YYYY-MM-DDTHH:mm",
    type: "datetime-local",
  },
  {
    name: "end_date",
    label: "Fecha y Hora de Fin",
    icon: "pi pi-clock",
    placeholder: "YYYY-MM-DDTHH:mm",
    type: "datetime-local",
  },
];

export const EventsFormFields = () => {
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
        <label htmlFor="description" className="block mb-2 font-medium text-700">
          <i className="pi pi-align-left mr-2 text-primary" />
          Descripción
        </label>
        <InputTextarea
          id="description"
          rows={4}
          className={errors.description?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Descripción detallada del evento..."
          {...register("description")}
        />
        {errors.description?.message && <small className="p-error">{errors.description.message.toString()}</small>}
      </div>
    </div>
  );
};

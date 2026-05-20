import { useFormContext, Controller } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";

export const EvidenceFormFields = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="event" className="block mb-2 font-medium text-700">
          <i className="pi pi-calendar mr-2 text-primary" />
          ID del Evento
        </label>
        <Controller
          name="event"
          control={control}
          render={({ field }) => (
            <InputNumber
              id={field.name}
              value={field.value}
              onValueChange={(e) => field.onChange(e.value)}
              className={errors.event?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: 1"
              useGrouping={false}
            />
          )}
        />
        {errors.event?.message && <small className="p-error">{errors.event.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="file" className="block mb-2 font-medium text-700">
          <i className="pi pi-link mr-2 text-primary" />
          Archivo (URL de imagen/video)
        </label>
        <Controller
          name="file"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={errors.file?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: https://.../foto.jpg"
            />
          )}
        />
        {errors.file?.message && <small className="p-error">{errors.file.message.toString()}</small>}
      </div>

      <div className="field col-12 mb-2 mt-2">
        <label htmlFor="description" className="block mb-2 font-medium text-700">
          <i className="pi pi-align-left mr-2 text-primary" />
          Descripción
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <InputTextarea
              id={field.name}
              rows={3}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={errors.description?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Descripción de la evidencia..."
            />
          )}
        />
        {errors.description?.message && <small className="p-error">{errors.description.message.toString()}</small>}
      </div>
    </div>
  );
};

import { useFormContext, Controller } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";

export const EventActFormFields = () => {
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
        <label htmlFor="digital_signature_path" className="block mb-2 font-medium text-700">
          <i className="pi pi-link mr-2 text-primary" />
          Firma Digital (URL opcional)
        </label>
        <Controller
          name="digital_signature_path"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={errors.digital_signature_path?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: https://.../firma.png"
            />
          )}
        />
        {errors.digital_signature_path?.message && <small className="p-error">{errors.digital_signature_path.message.toString()}</small>}
      </div>

      <div className="field col-12 mb-2 mt-2">
        <label htmlFor="content" className="block mb-2 font-medium text-700">
          <i className="pi pi-file mr-2 text-primary" />
          Contenido del Acta
        </label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <InputTextarea
              id={field.name}
              rows={6}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={errors.content?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Relato de lo sucedido en el evento..."
            />
          )}
        />
        {errors.content?.message && <small className="p-error">{errors.content.message.toString()}</small>}
      </div>
    </div>
  );
};

import { useFormContext, Controller } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";

export const AttendanceFormFields = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="beneficiary" className="block mb-2 font-medium text-700">
          <i className="pi pi-user mr-2 text-primary" />
          ID del Beneficiario
        </label>
        <Controller
          name="beneficiary"
          control={control}
          render={({ field }) => (
            <InputNumber
              id={field.name}
              value={field.value}
              onValueChange={(e) => field.onChange(e.value)}
              className={errors.beneficiary?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: 1"
              useGrouping={false}
            />
          )}
        />
        {errors.beneficiary?.message && <small className="p-error">{errors.beneficiary.message.toString()}</small>}
      </div>

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

      <div className="field col-12 mb-2 flex align-items-center gap-2 mt-3">
        <Controller
          name="attended"
          control={control}
          render={({ field }) => (
            <Checkbox
              inputId={field.name}
              checked={field.value}
              onChange={(e) => field.onChange(e.checked)}
              className={errors.attended?.message ? "p-invalid" : ""}
            />
          )}
        />
        <label htmlFor="attended" className="font-medium text-700 cursor-pointer">
          ¿Asistió al evento?
        </label>
        {errors.attended?.message && <small className="p-error ml-2">{errors.attended.message.toString()}</small>}
      </div>

      <div className="field col-12 mb-2 mt-2">
        <label htmlFor="notes" className="block mb-2 font-medium text-700">
          <i className="pi pi-align-left mr-2 text-primary" />
          Notas (Opcional)
        </label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <InputTextarea
              id={field.name}
              rows={3}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={errors.notes?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Observaciones de la asistencia..."
            />
          )}
        />
        {errors.notes?.message && <small className="p-error">{errors.notes.message.toString()}</small>}
      </div>
    </div>
  );
};

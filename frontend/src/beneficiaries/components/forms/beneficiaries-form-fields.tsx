import { Controller, useFormContext, useFormState } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import {
    ORINOQUIA_MUNICIPALITIES_GROUPED,
    TREATMENT_STAGE_OPTIONS,
} from "@/beneficiaries/beneficiaries.constants";

const groupedMunicipalityTemplate = (option: { department: string }) => (
    <div className="flex align-items-center gap-2">
        <i className="pi pi-map text-primary" style={{ fontSize: 12 }} />
        <span className="font-bold text-sm">{option.department}</span>
    </div>
);

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
  {
    name: "treatment_status",
    label: "Estado del tratamiento",
    icon: "pi pi-heart",
    placeholder: "Ej: En tratamiento activo",
  },
];

export const BeneficiariesFormFields = () => {
  const { control, register } = useFormContext();
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

      {/* ── Municipio (Dropdown filtrado — Orinoquía) ── */}
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="municipality" className="block mb-2 font-medium text-700">
          <i className="pi pi-map-marker mr-2 text-primary" />
          Municipio de procedencia
        </label>
        <Controller
          name="municipality"
          control={control}
          render={({ field }) => (
            <Dropdown
              id={field.name}
              value={field.value}
              onChange={(event) => field.onChange(event.value)}
              options={ORINOQUIA_MUNICIPALITIES_GROUPED}
              optionLabel="label"
              optionValue="value"
              optionGroupLabel="department"
              optionGroupChildren="municipalities"
              optionGroupTemplate={groupedMunicipalityTemplate}
              placeholder="Selecciona un municipio de la Orinoquía"
              filter
              filterPlaceholder="Buscar municipio…"
              className={errors.municipality?.message ? "p-invalid w-full" : "w-full"}
              showClear
            />
          )}
        />
        {errors.municipality?.message && (
          <small className="p-error">{errors.municipality.message.toString()}</small>
        )}
      </div>

      {/* ── Etapa del tratamiento ── */}
      <div className="field col-12  mb-2">
        <label htmlFor="treatment_stage" className="block mb-2 font-medium text-700">
          <i className="pi pi-chart-line mr-2 text-primary" />
          Etapa del beneficiario
        </label>
        <Controller
          name="treatment_stage"
          control={control}
          render={({ field }) => (
            <Dropdown
              id={field.name}
              value={field.value}
              onChange={(event) => field.onChange(event.value)}
              options={TREATMENT_STAGE_OPTIONS}
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona una etapa"
              className={errors.treatment_stage?.message ? "p-invalid w-full" : "w-full"}
            />
          )}
        />
        {errors.treatment_stage?.message && (
          <small className="p-error">{errors.treatment_stage.message.toString()}</small>
        )}
      </div>

      <div className="field col-12 mb-2">
        <label htmlFor="received_aid" className="block mb-2 font-medium text-700">
          <i className="pi pi-gift mr-2 text-primary" />
          Ayudas recibidas
        </label>
        <InputTextarea
          id="received_aid"
          rows={3}
          className={errors.received_aid?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Describe ayudas entregadas, apoyos o beneficios recibidos..."
          {...register("received_aid")}
        />
        {errors.received_aid?.message && (
          <small className="p-error">{errors.received_aid.message.toString()}</small>
        )}
      </div>

      <div className="field col-12 mb-2">
        <label htmlFor="follow_up_notes" className="block mb-2 font-medium text-700">
          <i className="pi pi-comments mr-2 text-primary" />
          Seguimiento y observaciones
        </label>
        <InputTextarea
          id="follow_up_notes"
          rows={3}
          className={errors.follow_up_notes?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Registra avances, novedades o seguimiento del caso..."
          {...register("follow_up_notes")}
        />
        {errors.follow_up_notes?.message && (
          <small className="p-error">{errors.follow_up_notes.message.toString()}</small>
        )}
      </div>
      
      <div className="field col-12 mb-2">
        <label htmlFor="notes" className="block mb-2 font-medium text-700">
          <i className="pi pi-align-left mr-2 text-primary" />
          Notas administrativas
        </label>
        <InputTextarea
          id="notes"
          rows={3}
          className={errors.notes?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Notas internas adicionales..."
          {...register("notes")}
        />
        {errors.notes?.message && <small className="p-error">{errors.notes.message.toString()}</small>}
      </div>
    </div>
  );
};

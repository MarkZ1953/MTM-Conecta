import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { useState } from "react";
import { supportAreaLabels, volunteerStatusLabels } from "../../volunteers.types";

const supportAreaOptions = Object.entries(supportAreaLabels).map(([value, label]) => ({
  value,
  label,
}));

const statusOptions = Object.entries(volunteerStatusLabels).map(([value, label]) => ({
  value,
  label,
}));

const dayOptions = [
  { label: "Lunes", value: 1 },
  { label: "Martes", value: 2 },
  { label: "Miércoles", value: 3 },
  { label: "Jueves", value: 4 },
  { label: "Viernes", value: 5 },
  { label: "Sábado", value: 6 },
  { label: "Domingo", value: 7 },
];

export const getDayLabel = (day: number): string => {
  return dayOptions.find((d) => d.value === day)?.label || String(day);
};

type VolunteersFormFieldsProps = {
  isAdmin?: boolean;
};

export const VolunteersFormFields = ({ isAdmin = false }: VolunteersFormFieldsProps) => {
  const { control, register, formState: { errors } } = useFormContext();

  const { fields: availabilityFields, append, remove } = useFieldArray({
    control,
    name: "availabilities",
  });

  // Local state for adding a new availability block
  const [newDay, setNewDay] = useState<number | null>(null);
  const [newStart, setNewStart] = useState<string>("08:00");
  const [newEnd, setNewEnd] = useState<string>("12:00");
  const [availError, setAvailError] = useState<string>("");

  const handleAddAvailability = () => {
    if (!newDay) {
      setAvailError("Debes seleccionar un día de la semana.");
      return;
    }
    if (!newStart || !newEnd) {
      setAvailError("Debes especificar la hora de inicio y fin.");
      return;
    }
    
    // Check if duplicate day and time slot overlapping could be handled (optional, simple check for exact same is fine)
    const exists = availabilityFields.some(
      (item: any) =>
        Number(item.day_of_week) === Number(newDay) &&
        item.start_time === newStart &&
        item.end_time === newEnd
    );

    if (exists) {
      setAvailError("Este bloque de disponibilidad ya fue agregado.");
      return;
    }

    append({
      day_of_week: newDay,
      start_time: newStart,
      end_time: newEnd,
    });

    setNewDay(null);
    setAvailError("");
  };

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      {/* ── Nombre ── */}
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="first_name" className="block mb-2 font-medium text-700">
          <i className="pi pi-user mr-2 text-primary" />
          Nombre
        </label>
        <InputText
          id="first_name"
          className={errors.first_name?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Ej: Sofía"
          {...register("first_name")}
        />
        {errors.first_name?.message && <small className="p-error">{errors.first_name.message.toString()}</small>}
      </div>

      {/* ── Apellido ── */}
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="last_name" className="block mb-2 font-medium text-700">
          <i className="pi pi-user mr-2 text-primary" />
          Apellido
        </label>
        <InputText
          id="last_name"
          className={errors.last_name?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Ej: Gómez"
          {...register("last_name")}
        />
        {errors.last_name?.message && <small className="p-error">{errors.last_name.message.toString()}</small>}
      </div>

      {/* ── Identificación ── */}
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="identification_number" className="block mb-2 font-medium text-700">
          <i className="pi pi-id-card mr-2 text-primary" />
          Identificación (C.C / T.I / Pasaporte)
        </label>
        <InputText
          id="identification_number"
          className={errors.identification_number?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Ej: 10203040"
          {...register("identification_number")}
        />
        {errors.identification_number?.message && (
          <small className="p-error">{errors.identification_number.message.toString()}</small>
        )}
      </div>

      {/* ── Profesión / Oficio ── */}
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="profession" className="block mb-2 font-medium text-700">
          <i className="pi pi-briefcase mr-2 text-primary" />
          Profesión u Oficio
        </label>
        <InputText
          id="profession"
          className={errors.profession?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Ej: Estudiante, Ingeniero, Trabajador Social"
          {...register("profession")}
        />
        {errors.profession?.message && <small className="p-error">{errors.profession.message.toString()}</small>}
      </div>

      {/* ── Correo Electrónico ── */}
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="email" className="block mb-2 font-medium text-700">
          <i className="pi pi-envelope mr-2 text-primary" />
          Correo Electrónico
        </label>
        <InputText
          id="email"
          type="email"
          className={errors.email?.message ? "p-invalid w-full" : "w-full"}
          placeholder="ejemplo@correo.com"
          {...register("email")}
        />
        {errors.email?.message && <small className="p-error">{errors.email.message.toString()}</small>}
      </div>

      {/* ── Teléfono ── */}
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="phone" className="block mb-2 font-medium text-700">
          <i className="pi pi-phone mr-2 text-primary" />
          Teléfono / Celular
        </label>
        <InputText
          id="phone"
          className={errors.phone?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Ej: 3123456789"
          {...register("phone")}
        />
        {errors.phone?.message && <small className="p-error">{errors.phone.message.toString()}</small>}
      </div>

      {/* ── Área de Apoyo ── */}
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="support_area" className="block mb-2 font-medium text-700">
          <i className="pi pi-star mr-2 text-primary" />
          Área de Apoyo de Interés
        </label>
        <Controller
          name="support_area"
          control={control}
          render={({ field }) => (
            <Dropdown
              id={field.name}
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              options={supportAreaOptions}
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar área"
              className={errors.support_area?.message ? "p-invalid w-full" : "w-full"}
            />
          )}
        />
        {errors.support_area?.message && <small className="p-error">{errors.support_area.message.toString()}</small>}
      </div>

      {/* ── Estado (Solo Administradores) ── */}
      {isAdmin && (
        <div className="field col-12 md:col-6 mb-2">
          <label htmlFor="status" className="block mb-2 font-medium text-700">
            <i className="pi pi-info-circle mr-2 text-primary" />
            Estado del Postulante
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
                placeholder="Seleccionar estado"
                className={errors.status?.message ? "p-invalid w-full" : "w-full"}
              />
            )}
          />
          {errors.status?.message && <small className="p-error">{errors.status.message.toString()}</small>}
        </div>
      )}

      {/* ── Notas Administrativas / Entrevista (Solo Administradores) ── */}
      {isAdmin && (
        <div className="field col-12 mb-2">
          <label htmlFor="notes" className="block mb-2 font-medium text-700">
            <i className="pi pi-comment mr-2 text-primary" />
            Notas Internas / Seguimiento de Entrevista
          </label>
          <InputTextarea
            id="notes"
            rows={3}
            className={errors.notes?.message ? "p-invalid w-full" : "w-full"}
            placeholder="Registra comentarios de la entrevista, habilidades destacadas u observaciones internas..."
            {...register("notes")}
          />
          {errors.notes?.message && <small className="p-error">{errors.notes.message.toString()}</small>}
        </div>
      )}

      {/* ── DISPONIBILIDAD HORARIA (Interactive Sub-Form) ── */}
      <div className="field col-12 mb-2">
        <section className="volunteer-availability">
          <div className="volunteer-availability__header">
            <div>
              <span className="volunteer-availability__eyebrow">
                <i className="pi pi-calendar-plus" />
                Agenda del voluntario
              </span>
              <h3>Disponibilidad de horarios</h3>
              <p>Agrega los días y rangos de tiempo en los que la persona puede apoyar a la fundación.</p>
            </div>
          </div>

          <div className="volunteer-availability__builder">
            <div className="volunteer-availability__control">
              <label htmlFor="avail_day">Día</label>
              <Dropdown
                id="avail_day"
                value={newDay}
                onChange={(e) => setNewDay(e.value)}
                options={dayOptions}
                optionLabel="label"
                optionValue="value"
                placeholder="Selecciona día"
                className="w-full"
              />
            </div>

            <div className="volunteer-availability__control">
              <label htmlFor="avail_start">Hora inicio</label>
              <input
                id="avail_start"
                type="time"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
                className="p-inputtext p-component w-full"
              />
            </div>

            <div className="volunteer-availability__control">
              <label htmlFor="avail_end">Hora fin</label>
              <input
                id="avail_end"
                type="time"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                className="p-inputtext p-component w-full"
              />
            </div>

            <Button
              type="button"
              label="Agregar horario"
              icon="pi pi-plus"
              onClick={handleAddAvailability}
              className="volunteer-availability__add"
              outlined
            />
          </div>

          {availError && <small className="p-error volunteer-availability__error">{availError}</small>}

          <div className="volunteer-availability__list">
            {availabilityFields.length === 0 ? (
              <div className="volunteer-availability__empty">
                <i className="pi pi-clock" />
                <span>No se han agregado horarios todavía.</span>
              </div>
            ) : (
              availabilityFields.map((item: any, index) => (
                <article key={item.id || index} className="volunteer-availability__item">
                  <div className="volunteer-availability__day">
                    <i className="pi pi-calendar" />
                    <span>{getDayLabel(Number(item.day_of_week))}</span>
                  </div>
                  <div className="volunteer-availability__time">
                    <i className="pi pi-clock" />
                    <span>
                      {String(item.start_time).slice(0, 5)} - {String(item.end_time).slice(0, 5)}
                    </span>
                  </div>
                  <Button
                    type="button"
                    icon="pi pi-trash"
                    className="volunteer-availability__remove"
                    onClick={() => remove(index)}
                    tooltip="Eliminar disponibilidad"
                    tooltipOptions={{ position: "left" }}
                    aria-label="Eliminar disponibilidad"
                  />
                </article>
              ))
            )}
          </div>

          {errors.availabilities?.message && (
            <small className="p-error block mt-2">{errors.availabilities.message.toString()}</small>
          )}
        </section>
      </div>

      {/* ── Double Opt-in Habeas Data (Solo Public Registro) ── */}
      {!isAdmin && (
        <div className="field col-12 mb-2 flex align-items-start gap-3 mt-4 p-3 bg-primary-50 border-round border-1 border-primary-100">
          <Controller
            name="habeas_data_opt_in"
            control={control}
            render={({ field }) => (
              <InputSwitch
                id={field.name}
                checked={!!field.value}
                onChange={(e) => field.onChange(e.value)}
                className="mt-1"
              />
            )}
          />
          <div className="flex flex-column gap-1">
            <label htmlFor="habeas_data_opt_in" className="font-semibold text-900 cursor-pointer text-sm">
              Tratamiento de Datos Personales (Ley 1581 de 2012)
            </label>
            <span className="text-sm text-700 leading-normal">
              Autorizo de manera libre, voluntaria, previa y explícita a la Fundación MTM Conecta para recopilar, almacenar y procesar mis datos personales y de contacto con fines de postulación en la red de voluntariado, contacto administrativo e información de impacto social. Entiendo que puedo ejercer mis derechos de conocer, actualizar y rectificar mis datos en cualquier momento.
            </span>
            {errors.habeas_data_opt_in?.message && (
              <small className="p-error font-semibold mt-1">{errors.habeas_data_opt_in.message.toString()}</small>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

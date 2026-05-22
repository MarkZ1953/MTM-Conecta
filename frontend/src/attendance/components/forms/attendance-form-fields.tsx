import { useFormContext, Controller } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { beneficiariesAPI } from "@/beneficiaries";
import { eventsAPI } from "@/events";
import { ComboboxObject } from "@/components";
import API_BASE_URL from "@/config/api.config";

export const AttendanceFormFields = () => {
  const { control, watch, formState: { errors } } = useFormContext();

  const [searchBeneficiary, setSearchBeneficiary] = useState<string>("");
  const [searchEvent, setSearchEvent] = useState<string>("");

  const beneficiaryId = watch("beneficiary");
  const eventId = watch("event");

  // Query to fetch selected beneficiary
  const { data: selectedBeneficiary, isFetching: isLoadingSelectedBeneficiary } = useQuery({
    queryKey: ["beneficiary", beneficiaryId],
    queryFn: async () => {
      if (!beneficiaryId || typeof beneficiaryId !== "number") return null;
      const response = await fetch(`${API_BASE_URL}/beneficiaries/${beneficiaryId}/`, {
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
    enabled: !!beneficiaryId && typeof beneficiaryId === "number",
    staleTime: 5 * 60 * 1000,
  });

  // Query to fetch selected event
  const { data: selectedEvent, isFetching: isLoadingSelectedEvent } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId || typeof eventId !== "number") return null;
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data;
    },
    enabled: !!eventId && typeof eventId === "number",
    staleTime: 5 * 60 * 1000,
  });

  // Query to search beneficiaries
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

  // Query to search events
  const { data: events = [] } = useQuery({
    queryKey: ["events", searchEvent],
    queryFn: async () => {
      const response = await eventsAPI.getAll({
        params: { title: searchEvent },
      });
      return (response.data.results ?? []).map((e) => ({
        id: e.id,
        name: e.title,
      }));
    },
    enabled: !!searchEvent,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="beneficiary" className="block mb-2 font-medium text-700">
          <i className="pi pi-user mr-2 text-primary" />
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

            const comboboxItems = [...beneficiaries];
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
                onSearch={setSearchBeneficiary}
                onHide={() => setSearchBeneficiary("")}
                placeholder="Busca y selecciona un beneficiario..."
                emptyMessage="No se encontraron beneficiarios"
                className={errors.beneficiary?.message ? "p-invalid w-full" : "w-full"}
                loading={isLoadingSelectedBeneficiary}
              />
            );
          }}
        />
        {errors.beneficiary?.message && <small className="p-error">{errors.beneficiary.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="event" className="block mb-2 font-medium text-700">
          <i className="pi pi-calendar mr-2 text-primary" />
          Evento
        </label>
        <Controller
          name="event"
          control={control}
          render={({ field }) => {
            const comboboxValue = selectedEvent
              ? {
                  id: selectedEvent.id,
                  name: selectedEvent.title,
                }
              : null;

            const comboboxItems = [...events];
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
                onSearch={setSearchEvent}
                onHide={() => setSearchEvent("")}
                placeholder="Busca y selecciona un evento..."
                emptyMessage="No se encontraron eventos"
                className={errors.event?.message ? "p-invalid w-full" : "w-full"}
                loading={isLoadingSelectedEvent}
              />
            );
          }}
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

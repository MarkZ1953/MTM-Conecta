import { useFormContext, Controller } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { eventsAPI } from "@/events";
import { ComboboxObject } from "@/components";
import API_BASE_URL from "@/config/api.config";

export const EvidenceFormFields = () => {
  const { control, watch, formState: { errors } } = useFormContext();

  const [searchEvent, setSearchEvent] = useState<string>("");
  const eventId = watch("event");

  // Query to fetch selected event
  const { data: selectedEvent, isFetching: isLoadingSelected } = useQuery({
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
                loading={isLoadingSelected}
              />
            );
          }}
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

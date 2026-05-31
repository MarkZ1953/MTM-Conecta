import { useFormContext, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collectionPointsAPI } from "@/cap-collection/cap-collection.api";
import { ComboboxObject } from "@/components";
import API_BASE_URL from "@/config/api.config";

const statusOptions = [
  { label: "Pendiente", value: "PENDING" },
  { label: "Asignada", value: "ASSIGNED" },
  { label: "En Ruta", value: "IN_ROUTE" },
  { label: "Recolectada", value: "COLLECTED" },
  { label: "Procesada", value: "PROCESSED" },
  { label: "Cancelada", value: "CANCELLED" },
];

export const CollectionRequestsFormFields = () => {
  const { control, watch, formState: { errors } } = useFormContext();

  const [searchPoint, setSearchPoint] = useState<string>("");
  const pointId = watch("collection_point");

  // Query to fetch selected collection point
  const { data: selectedPoint, isFetching: isLoadingSelected } = useQuery({
    queryKey: ["collection-point", pointId],
    queryFn: async () => {
      if (!pointId || typeof pointId !== "number") return null;
      const response = await fetch(`${API_BASE_URL}/collection-points/${pointId}/`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) return null;
      const data = await response.json();
      return {
        ...data,
        name: `${data.name} — ${data.company_name}`,
      };
    },
    enabled: !!pointId && typeof pointId === "number",
    staleTime: 5 * 60 * 1000,
  });

  // Query to search collection points
  const { data: points = [] } = useQuery({
    queryKey: ["collection-points", searchPoint],
    queryFn: async () => {
      const response = await collectionPointsAPI.getAll({
        params: { search: searchPoint },
      });
      return (response.data.results ?? []).map((p) => ({
        id: p.id,
        name: `${p.name} — ${p.company_name}`,
      }));
    },
    enabled: !!searchPoint,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      <div className="field col-12 mb-2">
        <label htmlFor="collection_point" className="block mb-2 font-medium text-700">
          <i className="pi pi-map-marker mr-2 text-primary" />
          Punto de Recolección
        </label>
        <Controller
          name="collection_point"
          control={control}
          render={({ field }) => {
            const comboboxValue = selectedPoint
              ? { id: selectedPoint.id, name: selectedPoint.name }
              : null;

            const comboboxItems = [...points];
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
                onSearch={setSearchPoint}
                onHide={() => setSearchPoint("")}
                placeholder="Busca y selecciona un punto de recolección..."
                emptyMessage="No se encontraron puntos de recolección"
                className={errors.collection_point?.message ? "p-invalid w-full" : "w-full"}
                loading={isLoadingSelected}
              />
            );
          }}
        />
        {errors.collection_point?.message && <small className="p-error">{errors.collection_point.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="estimated_weight_kg" className="block mb-2 font-medium text-700">
          <i className="pi pi-box mr-2 text-primary" />
          Peso Estimado (kg)
        </label>
        <Controller
          name="estimated_weight_kg"
          control={control}
          render={({ field }) => (
            <InputNumber
              id={field.name}
              value={field.value}
              onValueChange={(e) => field.onChange(e.value)}
              mode="decimal"
              minFractionDigits={0}
              maxFractionDigits={2}
              suffix=" kg"
              className={errors.estimated_weight_kg?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: 50.00"
            />
          )}
        />
        {errors.estimated_weight_kg?.message && <small className="p-error">{errors.estimated_weight_kg.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="scheduled_date" className="block mb-2 font-medium text-700">
          <i className="pi pi-calendar mr-2 text-primary" />
          Fecha Programada
        </label>
        <Controller
          name="scheduled_date"
          control={control}
          render={({ field }) => (
            <Calendar
              id={field.name}
              value={field.value ? new Date(field.value + "T00:00:00") : null}
              onChange={(e) => {
                if (e.value instanceof Date) {
                  const yyyy = e.value.getFullYear();
                  const mm = String(e.value.getMonth() + 1).padStart(2, "0");
                  const dd = String(e.value.getDate()).padStart(2, "0");
                  field.onChange(`${yyyy}-${mm}-${dd}`);
                } else {
                  field.onChange(null);
                }
              }}
              dateFormat="dd/mm/yy"
              showIcon
              className={errors.scheduled_date?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Seleccionar fecha"
            />
          )}
        />
        {errors.scheduled_date?.message && <small className="p-error">{errors.scheduled_date.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
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

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="driver_name" className="block mb-2 font-medium text-700">
          <i className="pi pi-car mr-2 text-primary" />
          Conductor (opcional)
        </label>
        <Controller
          name="driver_name"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              className="w-full"
              placeholder="Ej: Carlos Rodríguez"
            />
          )}
        />
      </div>

      <div className="field col-12 mb-2">
        <label htmlFor="notes" className="block mb-2 font-medium text-700">
          <i className="pi pi-file mr-2 text-primary" />
          Notas (opcional)
        </label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <InputTextarea
              id={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              rows={3}
              autoResize
              className="w-full"
              placeholder="Observaciones adicionales..."
            />
          )}
        />
      </div>
    </div>
  );
};

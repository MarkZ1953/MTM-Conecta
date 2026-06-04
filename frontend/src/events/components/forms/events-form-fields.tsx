import { useEffect, useMemo } from "react";
import { useFormContext, useFormState } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import type { EventPayload } from "@/events/events.types";

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
] as const satisfies ReadonlyArray<{
  name: keyof Pick<EventPayload, "end_date" | "location" | "start_date" | "title">;
  label: string;
  icon: string;
  placeholder: string;
  type?: string;
}>;

type EventsFormFieldsProps = {
  existingImageUrls?: string[];
};

export const EventsFormFields = ({ existingImageUrls = [] }: EventsFormFieldsProps) => {
  const { register, setValue, watch } = useFormContext<EventPayload>();
  const { errors } = useFormState();
  const selectedImages = watch("image_uploads");
  const previewObjectUrls = useMemo(
    () => (selectedImages ?? []).map((image) => URL.createObjectURL(image)),
    [selectedImages],
  );
  const previewUrls = previewObjectUrls.length > 0 ? previewObjectUrls : existingImageUrls;

  useEffect(() => {
    return () => {
      previewObjectUrls.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
    };
  }, [previewObjectUrls]);

  const imageError = errors.image_uploads?.message?.toString();

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
              type={"type" in field ? field.type : "text"}
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

      <div className="field col-12 mb-2">
        <label htmlFor="image_uploads" className="block mb-2 font-medium text-700">
          <i className="pi pi-image mr-2 text-primary" />
          Imágenes del evento
        </label>
        <div className={imageError ? "event-image-uploader is-invalid" : "event-image-uploader"}>
          <input
            id="image_uploads"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              setValue("image_uploads", Array.from(event.target.files ?? []), {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
            }}
          />
          <label htmlFor="image_uploads" className="event-image-dropzone">
            <span>
              <i className="pi pi-cloud-upload" />
            </span>
            <strong>{previewUrls.length > 0 ? "Cambiar imágenes" : "Seleccionar imágenes"}</strong>
            <small>JPG, PNG o WebP. Se subirán a Cloudinary en la carpeta Eventos.</small>
          </label>

          {previewUrls.length > 0 && (
            <div className="event-image-preview">
              <div className="event-image-preview-grid">
                {previewUrls.map((previewUrl, index) => (
                  <img src={previewUrl} alt={`Previsualización del evento ${index + 1}`} key={previewUrl} />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setValue("image_uploads", [], {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
              >
                <i className="pi pi-times" />
                Quitar selección
              </button>
            </div>
          )}
        </div>
        {imageError && <small className="p-error">{imageError}</small>}
      </div>
    </div>
  );
};

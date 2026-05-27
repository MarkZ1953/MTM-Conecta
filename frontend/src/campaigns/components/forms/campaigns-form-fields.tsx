import { Controller, useFormContext, useFormState, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import type { CampaignContentType } from "@/campaigns/campaigns.types";

const contentTypeOptions = [
  { label: "Diseñar (editor HTML)", value: "BUILDER" },
  { label: "Subir imagen", value: "IMAGE" },
  { label: "Subir PDF", value: "PDF" },
];

const recipientOptions = [
  { label: "Donantes", value: "DONORS" },
  { label: "Cuidadores", value: "GUARDIANS" },
  { label: "Usuarios", value: "USERS" },
  { label: "Todos (donantes + cuidadores)", value: "ALL" },
];

type CampaignsFormFieldsProps = {
  /** En edición, indica si ya hay un archivo cargado (para no exigirlo de nuevo) */
  existingImage?: string | null;
  existingDocument?: string | null;
};

export const CampaignsFormFields = ({
  existingImage,
  existingDocument,
}: CampaignsFormFieldsProps) => {
  const { register, control, setValue } = useFormContext();
  const { errors } = useFormState();

  const contentType = useWatch({ control, name: "content_type" }) as CampaignContentType;

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      {/* Asunto */}
      <div className="field col-12 mb-2">
        <label htmlFor="subject" className="block mb-2 font-medium text-700">
          <i className="pi pi-envelope mr-2 text-primary" />
          Asunto del correo
        </label>
        <InputText
          id="subject"
          className={errors.subject ? "p-invalid w-full" : "w-full"}
          placeholder="Ej: ¡Conoce nuestra nueva campaña!"
          {...register("subject")}
        />
        {errors.subject?.message && (
          <small className="p-error">{errors.subject.message.toString()}</small>
        )}
      </div>

      {/* Tipo de contenido */}
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="content_type" className="block mb-2 font-medium text-700">
          <i className="pi pi-palette mr-2 text-primary" />
          Tipo de contenido
        </label>
        <Controller
          name="content_type"
          control={control}
          render={({ field }) => (
            <Dropdown
              id="content_type"
              value={field.value}
              options={contentTypeOptions}
              onChange={(e) => field.onChange(e.value)}
              placeholder="Elige cómo armar el correo"
              className={errors.content_type ? "p-invalid w-full" : "w-full"}
            />
          )}
        />
        {errors.content_type?.message && (
          <small className="p-error">{errors.content_type.message.toString()}</small>
        )}
      </div>

      {/* Destinatarios */}
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="recipient_group" className="block mb-2 font-medium text-700">
          <i className="pi pi-users mr-2 text-primary" />
          Destinatarios
        </label>
        <Controller
          name="recipient_group"
          control={control}
          render={({ field }) => (
            <Dropdown
              id="recipient_group"
              value={field.value}
              options={recipientOptions}
              onChange={(e) => field.onChange(e.value)}
              placeholder="¿A quién se envía?"
              className={errors.recipient_group ? "p-invalid w-full" : "w-full"}
            />
          )}
        />
        {errors.recipient_group?.message && (
          <small className="p-error">{errors.recipient_group.message.toString()}</small>
        )}
      </div>

      {/* Campo condicional según el tipo */}
      {contentType === "BUILDER" && (
        <div className="field col-12 mb-2">
          <label htmlFor="html_content" className="block mb-2 font-medium text-700">
            <i className="pi pi-code mr-2 text-primary" />
            Contenido HTML
          </label>
          <InputTextarea
            id="html_content"
            rows={6}
            className={errors.html_content ? "p-invalid w-full" : "w-full"}
            placeholder="<h1>Hola</h1><p>Tu mensaje...</p>"
            {...register("html_content")}
          />
          {errors.html_content?.message && (
            <small className="p-error">{errors.html_content.message.toString()}</small>
          )}
          <small className="text-500 block mt-1">
            Por ahora se pega HTML. Más adelante se reemplaza por el editor visual.
          </small>
        </div>
      )}

      {contentType === "IMAGE" && (
        <div className="field col-12 mb-2">
          <label htmlFor="image" className="block mb-2 font-medium text-700">
            <i className="pi pi-image mr-2 text-primary" />
            Imagen del correo
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="w-full"
            onChange={(e) => setValue("image", e.target.files?.[0] ?? null)}
          />
          {existingImage && (
            <small className="text-500 block mt-1">
              Ya hay una imagen cargada. Sube una nueva solo si quieres reemplazarla.
            </small>
          )}
        </div>
      )}

      {contentType === "PDF" && (
        <div className="field col-12 mb-2">
          <label htmlFor="document" className="block mb-2 font-medium text-700">
            <i className="pi pi-file-pdf mr-2 text-primary" />
            Documento PDF
          </label>
          <input
            id="document"
            type="file"
            accept="application/pdf"
            className="w-full"
            onChange={(e) => setValue("document", e.target.files?.[0] ?? null)}
          />
          {existingDocument && (
            <small className="text-500 block mt-1">
              Ya hay un PDF cargado. Sube uno nuevo solo si quieres reemplazarlo.
            </small>
          )}
        </div>
      )}

      {/* Botón opcional (CTA) */}
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="cta_text" className="block mb-2 font-medium text-700">
          <i className="pi pi-link mr-2 text-primary" />
          Texto del botón (opcional)
        </label>
        <InputText
          id="cta_text"
          className="w-full"
          placeholder="Ej: Donar ahora"
          {...register("cta_text")}
        />
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="cta_url" className="block mb-2 font-medium text-700">
          <i className="pi pi-external-link mr-2 text-primary" />
          Enlace del botón (opcional)
        </label>
        <InputText
          id="cta_url"
          className={errors.cta_url ? "p-invalid w-full" : "w-full"}
          placeholder="https://..."
          {...register("cta_url")}
        />
        {errors.cta_url?.message && (
          <small className="p-error">{errors.cta_url.message.toString()}</small>
        )}
      </div>
    </div>
  );
};

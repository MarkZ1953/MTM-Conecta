import { useEffect, useMemo } from "react";
import { useFormContext, useFormState } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import type { BlogPostPayload } from "@/blog/blog.types";

type BlogFormFieldsProps = {
  existingImageUrl?: string;
};

export const BlogFormFields = ({ existingImageUrl = "" }: BlogFormFieldsProps) => {
  const { register, setValue, watch } = useFormContext<BlogPostPayload>();
  const { errors } = useFormState<BlogPostPayload>();
  const selectedImage = watch("image_upload");
  const previewObjectUrl = useMemo(
    () => (selectedImage ? URL.createObjectURL(selectedImage) : ""),
    [selectedImage],
  );
  const previewUrl = previewObjectUrl || existingImageUrl;
  const imageError = errors.image_upload?.message?.toString();

  useEffect(() => {
    return () => {
      if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
    };
  }, [previewObjectUrl]);

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="title" className="block mb-2 font-medium text-700">
          <i className="pi pi-book mr-2 text-primary" />
          Título
        </label>
        <InputText
          id="title"
          className={errors.title?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Ej: Jornada de salud integral"
          {...register("title")}
        />
        {errors.title?.message && <small className="p-error">{errors.title.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="slug" className="block mb-2 font-medium text-700">
          <i className="pi pi-link mr-2 text-primary" />
          Slug
        </label>
        <InputText
          id="slug"
          className={errors.slug?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Se genera automáticamente si lo dejas vacío"
          {...register("slug")}
        />
        {errors.slug?.message && <small className="p-error">{errors.slug.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="status" className="block mb-2 font-medium text-700">
          <i className="pi pi-check-circle mr-2 text-primary" />
          Estado
        </label>
        <select id="status" className="p-inputtext p-component w-full" {...register("status")}>
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
        </select>
        {errors.status?.message && <small className="p-error">{errors.status.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="published_at" className="block mb-2 font-medium text-700">
          <i className="pi pi-calendar mr-2 text-primary" />
          Fecha de publicación
        </label>
        <InputText
          id="published_at"
          type="datetime-local"
          className={errors.published_at?.message ? "p-invalid w-full" : "w-full"}
          {...register("published_at")}
        />
        {errors.published_at?.message && <small className="p-error">{errors.published_at.message.toString()}</small>}
      </div>

      <div className="field col-12 mb-2">
        <label htmlFor="summary" className="block mb-2 font-medium text-700">
          <i className="pi pi-align-left mr-2 text-primary" />
          Resumen corto
        </label>
        <InputTextarea
          id="summary"
          rows={3}
          className={errors.summary?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Resumen que se mostrará en las tarjetas del Blog..."
          {...register("summary")}
        />
        {errors.summary?.message && <small className="p-error">{errors.summary.message.toString()}</small>}
      </div>

      <div className="field col-12 mb-2">
        <label htmlFor="content" className="block mb-2 font-medium text-700">
          <i className="pi pi-file-edit mr-2 text-primary" />
          Contenido completo
        </label>
        <InputTextarea
          id="content"
          rows={8}
          className={errors.content?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Escribe el artículo completo..."
          {...register("content")}
        />
        {errors.content?.message && <small className="p-error">{errors.content.message.toString()}</small>}
      </div>

      <div className="field col-12 mb-2">
        <label htmlFor="image_alt" className="block mb-2 font-medium text-700">
          <i className="pi pi-info-circle mr-2 text-primary" />
          Texto alternativo de la imagen
        </label>
        <InputText
          id="image_alt"
          className={errors.image_alt?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Ej: Voluntarias de Fundación MTM en jornada comunitaria"
          {...register("image_alt")}
        />
        {errors.image_alt?.message && <small className="p-error">{errors.image_alt.message.toString()}</small>}
      </div>

      <div className="field col-12 mb-2">
        <label htmlFor="image_upload" className="block mb-2 font-medium text-700">
          <i className="pi pi-image mr-2 text-primary" />
          Imagen principal
        </label>
        <div className={imageError ? "event-image-uploader is-invalid" : "event-image-uploader"}>
          <input
            id="image_upload"
            type="file"
            accept="image/*"
            onChange={(event) => {
              setValue("image_upload", event.target.files?.[0] ?? null, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
            }}
          />
          <label htmlFor="image_upload" className="event-image-dropzone">
            <span>
              <i className="pi pi-cloud-upload" />
            </span>
            <strong>{previewUrl ? "Cambiar imagen" : "Seleccionar imagen"}</strong>
            <small>JPG, PNG o WebP. Se subirá a Cloudinary en la carpeta Blog.</small>
          </label>

          {previewUrl && (
            <div className="event-image-preview">
              <div className="event-image-preview-grid">
                <img src={previewUrl} alt="Previsualización de la publicación" />
              </div>
              <button
                type="button"
                onClick={() => {
                  setValue("image_upload", null, {
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


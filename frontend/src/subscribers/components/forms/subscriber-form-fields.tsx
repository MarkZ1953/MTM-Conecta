import { useFormContext, useFormState } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import type { NewsletterSubscriberPayload } from "@/subscribers/subscribers.types";

export const SubscriberFormFields = () => {
  const { register } = useFormContext<NewsletterSubscriberPayload>();
  const { errors } = useFormState<NewsletterSubscriberPayload>();

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="email" className="block mb-2 font-medium text-700">
          <i className="pi pi-envelope mr-2 text-primary" />
          Correo electrónico
        </label>
        <InputText
          id="email"
          className={errors.email?.message ? "p-invalid w-full" : "w-full"}
          placeholder="nombre@correo.com"
          {...register("email")}
        />
        {errors.email?.message && <small className="p-error">{errors.email.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="name" className="block mb-2 font-medium text-700">
          <i className="pi pi-user mr-2 text-primary" />
          Nombre
        </label>
        <InputText
          id="name"
          className={errors.name?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Opcional"
          {...register("name")}
        />
        {errors.name?.message && <small className="p-error">{errors.name.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-4 mb-2">
        <label htmlFor="status" className="block mb-2 font-medium text-700">
          <i className="pi pi-check-circle mr-2 text-primary" />
          Estado
        </label>
        <select id="status" className="p-inputtext p-component w-full" {...register("status")}>
          <option value="ACTIVE">Activo</option>
          <option value="UNSUBSCRIBED">Desuscrito</option>
        </select>
        {errors.status?.message && <small className="p-error">{errors.status.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-4 mb-2">
        <label htmlFor="origin" className="block mb-2 font-medium text-700">
          <i className="pi pi-map-marker mr-2 text-primary" />
          Origen
        </label>
        <select id="origin" className="p-inputtext p-component w-full" {...register("origin")}>
          <option value="BLOG">Blog</option>
          <option value="HOME">Sitio web</option>
          <option value="CAMPAIGN">Campaña</option>
          <option value="ADMIN">Panel administrativo</option>
          <option value="OTHER">Otro</option>
        </select>
        {errors.origin?.message && <small className="p-error">{errors.origin.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-4 mb-2">
        <label htmlFor="consent" className="block mb-2 font-medium text-700">
          <i className="pi pi-shield mr-2 text-primary" />
          Consentimiento
        </label>
        <select id="consent" className="p-inputtext p-component w-full" {...register("consent")}>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
        {errors.consent?.message && <small className="p-error">{errors.consent.message.toString()}</small>}
      </div>

      <div className="field col-12 mb-2">
        <label htmlFor="notes" className="block mb-2 font-medium text-700">
          <i className="pi pi-file-edit mr-2 text-primary" />
          Notas internas
        </label>
        <InputTextarea
          id="notes"
          rows={4}
          className={errors.notes?.message ? "p-invalid w-full" : "w-full"}
          placeholder="Observaciones opcionales para el equipo..."
          {...register("notes")}
        />
        {errors.notes?.message && <small className="p-error">{errors.notes.message.toString()}</small>}
      </div>
    </div>
  );
};

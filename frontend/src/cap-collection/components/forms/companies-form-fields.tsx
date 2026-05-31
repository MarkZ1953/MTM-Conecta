import { useFormContext, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

const ECONOMIC_SECTOR_OPTIONS = [
  { label: "Industrial", value: "INDUSTRIAL" },
  { label: "Comercial", value: "COMERCIAL" },
  { label: "Servicios", value: "SERVICIOS" },
  { label: "Tecnología", value: "TECNOLOGIA" },
  { label: "Financiero", value: "FINANCIERO" },
  { label: "Educación", value: "EDUCACION" },
  { label: "Construcción", value: "CONSTRUCCION" },
  { label: "Salud", value: "SALUD" },
  { label: "Otro", value: "OTRO" },
];

const COMPANY_SIZE_OPTIONS = [
  { label: "Micro", value: "MICRO" },
  { label: "Pequeña", value: "PEQUENA" },
  { label: "Mediana", value: "MEDIANA" },
  { label: "Grande", value: "GRANDE" },
];

export const CompaniesFormFields = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="nit" className="block mb-2 font-medium text-700">
          <i className="pi pi-id-card mr-2 text-primary" />
          NIT
        </label>
        <Controller
          name="nit"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              className={errors.nit?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: 900123456-1"
            />
          )}
        />
        {errors.nit?.message && <small className="p-error">{errors.nit.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="business_name" className="block mb-2 font-medium text-700">
          <i className="pi pi-building mr-2 text-primary" />
          Razón Social
        </label>
        <Controller
          name="business_name"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              className={errors.business_name?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: Empresa Recicladora S.A.S."
            />
          )}
        />
        {errors.business_name?.message && <small className="p-error">{errors.business_name.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-4 mb-2">
        <label htmlFor="contact_name" className="block mb-2 font-medium text-700">
          <i className="pi pi-user mr-2 text-primary" />
          Nombre de Contacto
        </label>
        <Controller
          name="contact_name"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              className={errors.contact_name?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: Juan Pérez"
            />
          )}
        />
        {errors.contact_name?.message && <small className="p-error">{errors.contact_name.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-4 mb-2">
        <label htmlFor="contact_email" className="block mb-2 font-medium text-700">
          <i className="pi pi-envelope mr-2 text-primary" />
          Correo Electrónico
        </label>
        <Controller
          name="contact_email"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              className={errors.contact_email?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: contacto@empresa.com"
            />
          )}
        />
        {errors.contact_email?.message && <small className="p-error">{errors.contact_email.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-4 mb-2">
        <label htmlFor="contact_phone" className="block mb-2 font-medium text-700">
          <i className="pi pi-phone mr-2 text-primary" />
          Teléfono
        </label>
        <Controller
          name="contact_phone"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              className={errors.contact_phone?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: 3001234567"
            />
          )}
        />
        {errors.contact_phone?.message && <small className="p-error">{errors.contact_phone.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="economic_sector" className="block mb-2 font-medium text-700">
          <i className="pi pi-briefcase mr-2 text-primary" />
          Sector Económico
        </label>
        <Controller
          name="economic_sector"
          control={control}
          render={({ field }) => (
            <Dropdown
              id={field.name}
              value={field.value}
              options={ECONOMIC_SECTOR_OPTIONS}
              onChange={(e) => field.onChange(e.value)}
              className={errors.economic_sector?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Selecciona un sector..."
            />
          )}
        />
        {errors.economic_sector?.message && <small className="p-error">{errors.economic_sector.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="company_size" className="block mb-2 font-medium text-700">
          <i className="pi pi-users mr-2 text-primary" />
          Tamaño de la Empresa
        </label>
        <Controller
          name="company_size"
          control={control}
          render={({ field }) => (
            <Dropdown
              id={field.name}
              value={field.value}
              options={COMPANY_SIZE_OPTIONS}
              onChange={(e) => field.onChange(e.value)}
              className={errors.company_size?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Selecciona el tamaño..."
            />
          )}
        />
        {errors.company_size?.message && <small className="p-error">{errors.company_size.message.toString()}</small>}
      </div>
    </div>
  );
};

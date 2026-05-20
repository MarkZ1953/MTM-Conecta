import { useFormContext, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

export const GuardiansFormFields = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      <div className="field col-12 mb-2">
        <label htmlFor="beneficiary" className="block mb-2 font-medium text-700">
          <i className="pi pi-users mr-2 text-primary" />
          ID de Beneficiario
        </label>
        <Controller
          name="beneficiary"
          control={control}
          render={({ field }) => (
            <InputNumber
              id={field.name}
              value={field.value}
              onValueChange={(e) => field.onChange(e.value)}
              className={errors.beneficiary?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: 1"
              useGrouping={false}
            />
          )}
        />
        {errors.beneficiary?.message && <small className="p-error">{errors.beneficiary.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="first_name" className="block mb-2 font-medium text-700">
          <i className="pi pi-id-card mr-2 text-primary" />
          Nombres
        </label>
        <Controller
          name="first_name"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={errors.first_name?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Nombres del tutor"
            />
          )}
        />
        {errors.first_name?.message && <small className="p-error">{errors.first_name.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="last_name" className="block mb-2 font-medium text-700">
          <i className="pi pi-id-card mr-2 text-primary" />
          Apellidos
        </label>
        <Controller
          name="last_name"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={errors.last_name?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Apellidos del tutor"
            />
          )}
        />
        {errors.last_name?.message && <small className="p-error">{errors.last_name.message.toString()}</small>}
      </div>

      <div className="field col-12 mb-2">
        <label htmlFor="identification_number" className="block mb-2 font-medium text-700">
          <i className="pi pi-id-card mr-2 text-primary" />
          Número de Identificación
        </label>
        <Controller
          name="identification_number"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={errors.identification_number?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: 12345678"
            />
          )}
        />
        {errors.identification_number?.message && <small className="p-error">{errors.identification_number.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="phone_number" className="block mb-2 font-medium text-700">
          <i className="pi pi-phone mr-2 text-primary" />
          Teléfono
        </label>
        <Controller
          name="phone_number"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={errors.phone_number?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: 555-1234"
            />
          )}
        />
        {errors.phone_number?.message && <small className="p-error">{errors.phone_number.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="email" className="block mb-2 font-medium text-700">
          <i className="pi pi-envelope mr-2 text-primary" />
          Correo Electrónico
        </label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              type="email"
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={errors.email?.message ? "p-invalid w-full" : "w-full"}
              placeholder="ejemplo@correo.com"
            />
          )}
        />
        {errors.email?.message && <small className="p-error">{errors.email.message.toString()}</small>}
      </div>
    </div>
  );
};

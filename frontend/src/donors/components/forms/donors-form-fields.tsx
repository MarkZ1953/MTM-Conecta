import { useFormContext, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

export const DonorsFormFields = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      <div className="field col-12 mb-2">
        <label htmlFor="user" className="block mb-2 font-medium text-700">
          <i className="pi pi-user mr-2 text-primary" />
          ID de Usuario
        </label>
        <Controller
          name="user"
          control={control}
          render={({ field }) => (
            <InputNumber
              id={field.name}
              value={field.value}
              onValueChange={(e) => field.onChange(e.value)}
              className={errors.user?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Ej: 1"
              useGrouping={false}
            />
          )}
        />
        {errors.user?.message && <small className="p-error">{errors.user.message.toString()}</small>}
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
              placeholder="Nombres del donante"
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
              placeholder="Apellidos del donante"
            />
          )}
        />
        {errors.last_name?.message && <small className="p-error">{errors.last_name.message.toString()}</small>}
      </div>

      <div className="field col-12 mb-2 mt-2">
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

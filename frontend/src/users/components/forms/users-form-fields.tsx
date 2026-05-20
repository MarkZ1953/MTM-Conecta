import { useFormContext, useFormState } from "react-hook-form";
import { InputText } from "primereact/inputtext";

const fields = [
  {
    name: "username",
    label: "Usuario",
    icon: "pi pi-user",
    placeholder: "Ej: usuario123",
  },
  {
    name: "first_name",
    label: "Nombre",
    icon: "pi pi-id-card",
    placeholder: "Ej: Juan",
  },
  {
    name: "last_name",
    label: "Apellido",
    icon: "pi pi-id-card",
    placeholder: "Ej: Perez",
  },
  {
    name: "email",
    label: "Correo electronico",
    icon: "pi pi-envelope",
    placeholder: "Ej: usuario@ejemplo.com",
  },
];

export const UsersFormFields = () => {
  const { register } = useFormContext();
  const { errors } = useFormState();

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
              className={error ? "p-invalid w-full" : "w-full"}
              placeholder={field.placeholder}
              {...register(field.name)}
            />
            {error && <small className="p-error">{error}</small>}
          </div>
        );
      })}
    </div>
  );
};

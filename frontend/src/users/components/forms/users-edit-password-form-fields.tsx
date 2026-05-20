import { Controller, useFormContext, useFormState } from "react-hook-form";
import { Password } from "primereact/password";

export const UsersEditPasswordFormFields = () => {
  const { control } = useFormContext();
  const { errors } = useFormState();

  const fields = [
    {
      name: "new_password",
      label: "Nueva contrasena",
      placeholder: "Ingresa la nueva contrasena",
    },
    {
      name: "confirm_password",
      label: "Confirmar contrasena",
      placeholder: "Confirma la nueva contrasena",
    },
  ];

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      {fields.map((item) => {
        const error = errors[item.name]?.message?.toString();

        return (
          <div key={item.name} className="field col-12 md:col-6 mb-2">
            <label htmlFor={item.name} className="block mb-2 font-medium text-700">
              <i className="pi pi-lock mr-2 text-primary" />
              {item.label}
            </label>
            <Controller
              name={item.name}
              control={control}
              render={({ field }) => (
                <Password
                  id={item.name}
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value)}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  placeholder={item.placeholder}
                  toggleMask
                  feedback={false}
                  className={error ? "p-invalid w-full" : "w-full"}
                  inputClassName="w-full"
                />
              )}
            />
            {error && <small className="p-error">{error}</small>}
          </div>
        );
      })}
    </div>
  );
};

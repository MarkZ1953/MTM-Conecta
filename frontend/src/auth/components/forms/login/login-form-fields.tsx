import { useFormContext, Controller } from "react-hook-form";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

export interface LoginFormValues {
  username: string;
  password: string;
}

export function LoginFormFields() {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="login-fields">
      {/* Usuario */}
      <div className="login-field-wrapper">
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <FloatLabel>
              <InputText
                id="login-username"
                className={`login-input${errors.username ? " p-invalid" : ""}`}
                {...field}
                autoComplete="username"
                type="text"
              />
              <label htmlFor="login-username">Nombre de usuario</label>
            </FloatLabel>
          )}
        />
        {errors.username && (
          <small className="login-field-error">
            {errors?.username?.message?.toString()}
          </small>
        )}
      </div>

      {/* Contraseña */}
      <div className="login-field-wrapper">
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <FloatLabel>
              <Password
                inputId="password"
                className={`login-input${errors.password ? " p-invalid" : ""}`}
                toggleMask
                feedback={false}
                autoComplete="current-password"
                {...field}
                pt={{
                  input: { style: { width: "100%" } },
                }}
              />
              <label htmlFor="password">Contraseña</label>
            </FloatLabel>
          )}
        />
        {errors.password && (
          <small className="login-field-error">
            {errors?.password?.message?.toString()}
          </small>
        )}
      </div>
    </div>
  );
}

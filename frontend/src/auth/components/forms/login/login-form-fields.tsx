import { useFormContext, Controller } from "react-hook-form";
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
      <div className="login-field-wrapper">
        <label htmlFor="login-username" className="login-label">
          Usuario
        </label>
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <span className="login-control">
              <i className="pi pi-user" aria-hidden="true" />
              <InputText
                id="login-username"
                className={`login-input${errors.username ? " p-invalid" : ""}`}
                {...field}
                autoComplete="username"
                placeholder="tu.usuario"
                type="text"
                autoFocus
              />
            </span>
          )}
        />
        {errors.username && (
          <small className="login-field-error">
            {errors?.username?.message?.toString()}
          </small>
        )}
      </div>

      <div className="login-field-wrapper">
        <label htmlFor="login-password" className="login-label">
          Contraseña
        </label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <span className="login-control login-control--password">
              <i className="pi pi-lock" aria-hidden="true" />
              <Password
                inputId="login-password"
                className={`login-input${errors.password ? " p-invalid" : ""}`}
                toggleMask
                feedback={false}
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                {...field}
                pt={{
                  input: { style: { width: "100%" } },
                }}
              />
            </span>
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

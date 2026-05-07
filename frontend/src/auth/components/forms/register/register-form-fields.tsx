import { useFormContext, Controller } from "react-hook-form";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

export interface RegisterFormValues {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const passwordHeader = (
  <p className="register-pwd-header">Elige una contraseña segura</p>
);
const passwordFooter = (
  <div className="register-pwd-footer">
    <p>Requisitos:</p>
    <ul>
      <li>Al menos 8 caracteres</li>
      <li>Una letra mayúscula</li>
      <li>Un número</li>
    </ul>
  </div>
);

export function RegisterFormFields() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="register-fields">
      {/* Nombres */}
      <div className="register-field-wrapper">
        <Controller
          name="first_name"
          control={control}
          render={({ field }) => (
            <FloatLabel>
              <InputText
                id="register-first-name"
                className={`register-input${errors.first_name ? " p-invalid" : ""}`}
                {...field}
                autoComplete="given-name"
              />
              <label htmlFor="register-first-name">Nombres</label>
            </FloatLabel>
          )}
        />
        {errors.first_name && (
          <small className="register-field-error">
            {errors?.first_name?.message?.toString()}
          </small>
        )}
      </div>

      {/* Apellidos */}
      <div className="register-field-wrapper">
        <Controller
          name="last_name"
          control={control}
          render={({ field }) => (
            <FloatLabel>
              <InputText
                id="register-last-name"
                className={`register-input${errors.last_name ? " p-invalid" : ""}`}
                {...field}
                autoComplete="family-name"
              />
              <label htmlFor="register-last-name">Apellidos</label>
            </FloatLabel>
          )}
        />
        {errors.last_name && (
          <small className="register-field-error">
            {errors?.last_name?.message?.toString()}
          </small>
        )}
      </div>

      {/* Usuario */}
      <div className="register-field-wrapper">
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <FloatLabel>
              <InputText
                id="register-username"
                className={`register-input${errors.username ? " p-invalid" : ""}`}
                {...field}
                autoComplete="username"
                type="text"
              />
              <label htmlFor="register-username">Nombre de usuario</label>
            </FloatLabel>
          )}
        />
        {errors.username && (
          <small className="register-field-error">
            {errors?.username?.message?.toString()}
          </small>
        )}
      </div>

      {/* Contraseña */}
      <div className="register-field-wrapper">
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <FloatLabel>
              <Password
                inputId="register-password"
                className={`register-input${errors.password ? " p-invalid" : ""}`}
                toggleMask
                header={passwordHeader}
                footer={passwordFooter}
                autoComplete="new-password"
                {...field}
                pt={{ input: { style: { width: "100%" } } }}
              />
              <label htmlFor="register-password">Contraseña</label>
            </FloatLabel>
          )}
        />
        {errors.password && (
          <small className="register-field-error">
            {errors?.password?.message?.toString()}
          </small>
        )}
      </div>

      {/* Confirmar contraseña */}
      <div className="register-field-wrapper">
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <FloatLabel>
              <Password
                inputId="register-confirm-password"
                className={`register-input${errors.confirmPassword ? " p-invalid" : ""}`}
                toggleMask
                feedback={false}
                autoComplete="new-password"
                {...field}
                pt={{ input: { style: { width: "100%" } } }}
              />
              <label htmlFor="register-confirm-password">
                Confirmar contraseña
              </label>
            </FloatLabel>
          )}
        />
        {errors.confirmPassword && (
          <small className="register-field-error">
            {errors?.confirmPassword?.message?.toString()}
          </small>
        )}
      </div>
    </div>
  );
}

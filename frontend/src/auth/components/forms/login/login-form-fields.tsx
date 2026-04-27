import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormFieldsProps {
  values: LoginFormValues;
  onChange: (field: keyof LoginFormValues, value: string) => void;
  errors: Partial<Record<keyof LoginFormValues, string>>;
  loading?: boolean;
}

export function LoginFormFields({
  values,
  onChange,
  errors,
  loading,
}: LoginFormFieldsProps) {
  return (
    <div className="login-fields">
      {/* Email */}
      <div className="login-field-wrapper">
        <FloatLabel>
          <InputText
            id="login-email"
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={`login-input${errors.email ? " p-invalid" : ""}`}
            disabled={loading}
            autoComplete="email"
            type="email"
          />
          <label htmlFor="login-email">Correo electrónico</label>
        </FloatLabel>
        {errors.email && (
          <small className="login-field-error">{errors.email}</small>
        )}
      </div>

      {/* Contraseña */}
      <div className="login-field-wrapper">
        <FloatLabel>
          <Password
            inputId="login-password"
            value={values.password}
            onChange={(e) => onChange("password", e.target.value)}
            className={`login-input${errors.password ? " p-invalid" : ""}`}
            toggleMask
            feedback={false}
            disabled={loading}
            autoComplete="current-password"
            pt={{
              input: { style: { width: "100%" } },
            }}
          />
          <label htmlFor="login-password">Contraseña</label>
        </FloatLabel>
        {errors.password && (
          <small className="login-field-error">{errors.password}</small>
        )}
      </div>
    </div>
  );
}

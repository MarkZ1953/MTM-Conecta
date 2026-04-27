import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { FloatLabel } from "primereact/floatlabel";

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormFieldsProps {
  values: RegisterFormValues;
  onChange: (field: keyof RegisterFormValues, value: string) => void;
  errors: Partial<Record<keyof RegisterFormValues, string>>;
  loading?: boolean;
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

export function RegisterFormFields({
  values,
  onChange,
  errors,
  loading,
}: RegisterFormFieldsProps) {
  return (
    <div className="register-fields">
      {/* Nombre completo */}
      <div className="register-field-wrapper">
        <FloatLabel>
          <InputText
            id="register-name"
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
            className={`register-input${errors.name ? " p-invalid" : ""}`}
            disabled={loading}
            autoComplete="name"
          />
          <label htmlFor="register-name">Nombre completo</label>
        </FloatLabel>
        {errors.name && (
          <small className="register-field-error">{errors.name}</small>
        )}
      </div>

      {/* Email */}
      <div className="register-field-wrapper">
        <FloatLabel>
          <InputText
            id="register-email"
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={`register-input${errors.email ? " p-invalid" : ""}`}
            disabled={loading}
            autoComplete="email"
            type="email"
          />
          <label htmlFor="register-email">Correo electrónico</label>
        </FloatLabel>
        {errors.email && (
          <small className="register-field-error">{errors.email}</small>
        )}
      </div>

      {/* Contraseña */}
      <div className="register-field-wrapper">
        <FloatLabel>
          <Password
            inputId="register-password"
            value={values.password}
            onChange={(e) => onChange("password", e.target.value)}
            className={`register-input${errors.password ? " p-invalid" : ""}`}
            toggleMask
            header={passwordHeader}
            footer={passwordFooter}
            disabled={loading}
            autoComplete="new-password"
            pt={{ input: { style: { width: "100%" } } }}
          />
          <label htmlFor="register-password">Contraseña</label>
        </FloatLabel>
        {errors.password && (
          <small className="register-field-error">{errors.password}</small>
        )}
      </div>

      {/* Confirmar contraseña */}
      <div className="register-field-wrapper">
        <FloatLabel>
          <Password
            inputId="register-confirm-password"
            value={values.confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            className={`register-input${errors.confirmPassword ? " p-invalid" : ""}`}
            toggleMask
            feedback={false}
            disabled={loading}
            autoComplete="new-password"
            pt={{ input: { style: { width: "100%" } } }}
          />
          <label htmlFor="register-confirm-password">Confirmar contraseña</label>
        </FloatLabel>
        {errors.confirmPassword && (
          <small className="register-field-error">
            {errors.confirmPassword}
          </small>
        )}
      </div>
    </div>
  );
}

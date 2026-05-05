import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { FloatLabel } from "primereact/floatlabel";

export interface RegisterFormValues {
  first_name: string;
  last_name: string;
  username: string;
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
      {/* Nombres */}
      <div className="register-field-wrapper">
        <FloatLabel>
          <InputText
            id="register-first-name"
            value={values.first_name}
            onChange={(e) => onChange("first_name", e.target.value)}
            className={`register-input${errors.first_name ? " p-invalid" : ""}`}
            disabled={loading}
            autoComplete="given-name"
          />
          <label htmlFor="register-first-name">Nombres</label>
        </FloatLabel>
        {errors.first_name && (
          <small className="register-field-error">{errors.first_name}</small>
        )}
      </div>

      {/* Apellidos */}
      <div className="register-field-wrapper">
        <FloatLabel>
          <InputText
            id="register-last-name"
            value={values.last_name}
            onChange={(e) => onChange("last_name", e.target.value)}
            className={`register-input${errors.last_name ? " p-invalid" : ""}`}
            disabled={loading}
            autoComplete="family-name"
          />
          <label htmlFor="register-last-name">Apellidos</label>
        </FloatLabel>
        {errors.last_name && (
          <small className="register-field-error">{errors.last_name}</small>
        )}
      </div>

      {/* Usuario */}
      <div className="register-field-wrapper">
        <FloatLabel>
          <InputText
            id="register-username"
            value={values.username}
            onChange={(e) => onChange("username", e.target.value)}
            className={`register-input${errors.username ? " p-invalid" : ""}`}
            disabled={loading}
            autoComplete="username"
            type="text"
          />
          <label htmlFor="register-username">Nombre de usuario</label>
        </FloatLabel>
        {errors.username && (
          <small className="register-field-error">{errors.username}</small>
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

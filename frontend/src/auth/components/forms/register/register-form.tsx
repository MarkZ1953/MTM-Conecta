import { useState } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Checkbox } from "primereact/checkbox";
import {
  RegisterFormFields,
  type RegisterFormValues,
} from "./register-form-fields";

function validate(values: RegisterFormValues) {
  const errors: Partial<Record<keyof RegisterFormValues, string>> = {};
  if (!values.name.trim()) {
    errors.name = "El nombre es obligatorio.";
  } else if (values.name.trim().length < 3) {
    errors.name = "Mínimo 3 caracteres.";
  }
  if (!values.email.trim()) {
    errors.email = "El correo es obligatorio.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Ingresa un correo válido.";
  }
  if (!values.password) {
    errors.password = "La contraseña es obligatoria.";
  } else if (values.password.length < 8) {
    errors.password = "Mínimo 8 caracteres.";
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirma tu contraseña.";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
  }
  return errors;
}

interface RegisterFormProps {
  onSuccess?: () => void;
  onNavigateLogin?: () => void;
}

export function RegisterForm({ onSuccess, onNavigateLogin }: RegisterFormProps) {
  const [values, setValues] = useState<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormValues, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);

  function handleChange(field: keyof RegisterFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate(values);
    if (!acceptTerms) setTermsError(true);
    if (Object.keys(validation).length > 0 || !acceptTerms) {
      setErrors(validation);
      return;
    }
    setLoading(true);
    try {
      // TODO: conectar con auth context / API
      await new Promise((r) => setTimeout(r, 1200));
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <div className="register-form-header">
        <h1 className="register-form-title">Crea tu cuenta</h1>
        <p className="register-form-subtitle">
          Únete a la red de voluntarias de la Fundación MTM y ayuda a niños
          con cáncer a tener una mejor vida
        </p>
      </div>

      <RegisterFormFields
        values={values}
        onChange={handleChange}
        errors={errors}
        loading={loading}
      />

      {/* Términos */}
      <div className="register-terms">
        <Checkbox
          inputId="register-terms"
          checked={acceptTerms}
          onChange={(e) => {
            setAcceptTerms(e.checked ?? false);
            if (e.checked) setTermsError(false);
          }}
          disabled={loading}
        />
        <label htmlFor="register-terms" className="register-terms-label">
          Acepto los&nbsp;
          <a href="#" className="register-terms-link">
            Términos de uso
          </a>
          &nbsp;y la&nbsp;
          <a href="#" className="register-terms-link">
            Política de privacidad
          </a>
          &nbsp;de la Fundación MTM
        </label>
      </div>
      {termsError && (
        <small className="register-field-error register-terms-error">
          Debes aceptar los términos para continuar.
        </small>
      )}

      <Button
        type="submit"
        label={loading ? "Creando cuenta..." : "Crear cuenta"}
        className="register-submit-btn"
        loading={loading}
        disabled={loading}
        icon="pi pi-user-plus"
        iconPos="right"
      />

      <Divider />

      <p className="register-login-prompt">
        ¿Ya eres parte de la fundación?&nbsp;
        <button
          type="button"
          className="register-login-link"
          onClick={onNavigateLogin}
        >
          Inicia sesión
        </button>
      </p>
    </form>
  );
}

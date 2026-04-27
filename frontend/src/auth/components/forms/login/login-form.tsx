import { useState } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { LoginFormFields, type LoginFormValues } from "./login-form-fields";

function validate(values: LoginFormValues) {
  const errors: Partial<Record<keyof LoginFormValues, string>> = {};
  if (!values.email.trim()) {
    errors.email = "El correo es obligatorio.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Ingresa un correo válido.";
  }
  if (!values.password) {
    errors.password = "La contraseña es obligatoria.";
  } else if (values.password.length < 6) {
    errors.password = "Mínimo 6 caracteres.";
  }
  return errors;
}

interface LoginFormProps {
  onSuccess?: () => void;
  onNavigateRegister?: () => void;
}

export function LoginForm({ onSuccess, onNavigateRegister }: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormValues, string>>
  >({});
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof LoginFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate(values);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setLoading(true);
    try {
      // TODO: conectar con auth context / API
      await new Promise((r) => setTimeout(r, 1000));
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-form-header">
        <h1 className="login-form-title">Bienvenida de nuevo</h1>
        <p className="login-form-subtitle">
          Accede a tu cuenta de la Fundación MTM y sigue haciendo la diferencia
        </p>
      </div>

      <LoginFormFields
        values={values}
        onChange={handleChange}
        errors={errors}
        loading={loading}
      />

      <div className="login-forgot">
        <a href="#" className="login-forgot-link">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <Button
        type="submit"
        label={loading ? "Ingresando..." : "Iniciar sesión"}
        className="login-submit-btn"
        loading={loading}
        disabled={loading}
        icon="pi pi-sign-in"
        iconPos="right"
      />

      <Divider />

      <p className="login-register-prompt">
        ¿Eres nueva en la fundación?&nbsp;
        <button
          type="button"
          className="login-register-link"
          onClick={onNavigateRegister}
        >
          Crea tu cuenta aquí
        </button>
      </p>
    </form>
  );
}

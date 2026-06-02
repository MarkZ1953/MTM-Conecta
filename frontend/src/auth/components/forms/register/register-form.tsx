import { FormProvider, useForm } from "react-hook-form";
import { RegisterFormFields } from "./register-form-fields";
import { yupResolver } from "@hookform/resolvers/yup";
import { authRegisterSchema } from "@/auth/auth.schemas";
import { useNavigate } from "react-router-dom";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { authAPI } from "@/auth/auth.api";
import { toast } from "@/components";
import { useState } from "react";
import { GoogleAuthButton } from "../../google-auth-button";

export function RegisterForm() {
  const form = useForm({
    resolver: yupResolver(authRegisterSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const { isSubmitting } = form.formState;

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const getErrorMessage = (responseData: any) => {
    if (!responseData) return "Error al crear la cuenta";
    if (responseData.message) return responseData.message;

    const firstError = Object.values(responseData).flat().find(Boolean);
    if (typeof firstError === "string") return firstError;

    return JSON.stringify(responseData);
  };

  const onSubmit = async (data: any) => {
    if (!acceptTerms) {
      setTermsError(true);
      return;
    }

    try {
      const { status, data: responseData } = await authAPI.register({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          username: data.username,
          password: data.password,
          confirm_password: data.confirmPassword,
        },
      });
      if (status >= 200 && status < 300) {
        toast.success("Cuenta creada exitosamente");
        navigate("/login");
        return;
      }

      throw new Error(getErrorMessage(responseData));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear la cuenta");
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className="register-form"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="register-form-header">
          <span className="register-form-kicker">Registro</span>
          <h1 className="register-form-title">Crea tu cuenta</h1>
          <p className="register-form-subtitle">
            Registra un usuario para acceder a la plataforma administrativa de
            la Fundación MTM.
          </p>
        </div>

        <GoogleAuthButton mode="register" variant="brand" label="Registrarse con Google" />

        <Divider align="center">
          <span className="auth-divider-label">o crea tu cuenta manualmente</span>
        </Divider>

        <RegisterFormFields />

        {/* Términos */}
        <div className="register-terms">
          <Checkbox
            inputId="register-terms"
            checked={acceptTerms}
            onChange={(e) => {
              setAcceptTerms(e.checked ?? false);
              if (e.checked) setTermsError(false);
            }}
            disabled={isSubmitting}
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
          label={isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          className="register-submit-btn"
          loading={isSubmitting}
          disabled={isSubmitting}
          icon="pi pi-user-plus"
          iconPos="right"
        />

        <Divider />

        <p className="register-login-prompt">
          ¿Ya tienes un usuario?&nbsp;
          <button
            type="button"
            className="register-login-link"
            onClick={() => navigate("/login")}
          >
            Inicia sesión
          </button>
        </p>
      </form>
    </FormProvider>
  );
}

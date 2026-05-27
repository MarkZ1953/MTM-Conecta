import { FormProvider, useForm } from "react-hook-form";
import { LoginFormFields } from "./login-form-fields";
import { yupResolver } from "@hookform/resolvers/yup";
import { authLoginSchema } from "@/auth/auth.schemas";
import { useNavigate } from "react-router-dom";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { authAPI } from "@/auth/auth.api";
import { toast } from "@/components";

export function LoginForm() {
  const form = useForm({
    resolver: yupResolver(authLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const navigate = useNavigate();
 
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: any) => {
    try {
      const { status } = await authAPI.login({
        username: data.username,
        password: data.password,
      });
      if (status >= 200 && status < 300) {
        navigate("/");
        toast.success("Inicio de sesión exitoso");
      }
    } catch (error) {
      toast.error("Error al iniciar sesión");
    }
  };

  return (
    <>
      <FormProvider {...form}>
        <form
          className="login-form"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div className="login-form-header">
            <span className="login-form-kicker">Inicio de sesión</span>
            <h1 className="login-form-title">Bienvenida de nuevo</h1>
            <p className="login-form-subtitle">
              Ingresa tus credenciales para continuar con la gestión de MTM
              Conecta.
            </p>
          </div>

          <LoginFormFields />

          <div className="login-forgot">
            <a href="#" className="login-forgot-link">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <Button
            type="submit"
            label={isSubmitting ? "Ingresando..." : "Iniciar sesión"}
            className="login-submit-btn"
            loading={isSubmitting}
            disabled={isSubmitting}
            icon="pi pi-arrow-right"
            iconPos="right"
          />

          <Divider />

          <p className="login-register-prompt">
            ¿Eres nueva en la fundación?&nbsp;
            <button
              type="button"
              className="login-register-link"
              onClick={() => navigate("/register")}
            >
              Crea tu cuenta aquí
            </button>
          </p>
        </form>
      </FormProvider>
    </>
  );
}

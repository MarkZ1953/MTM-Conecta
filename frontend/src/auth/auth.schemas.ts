import * as yup from "yup";

export const authLoginSchema = yup.object({
  username: yup
    .string()
    .required("El usuario es obligatorio."),
  password: yup
    .string()
    .required("La contraseña es obligatoria.")
});

export const authRegisterSchema = yup.object({
  first_name: yup
    .string()
    .required("El nombre es obligatorio.")
    .min(2, "Mínimo 2 caracteres."),
  last_name: yup
    .string()
    .required("El apellido es obligatorio.")
    .min(2, "Mínimo 2 caracteres."),
  username: yup
    .string()
    .required("El usuario es obligatorio.")
    .min(3, "Mínimo 3 caracteres.")
    .max(20, "Máximo 20 caracteres."),
  password: yup
    .string()
    .required("La contraseña es obligatoria."),
  confirmPassword: yup
    .string()
    .required("La contraseña es obligatoria.")
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden."),
});


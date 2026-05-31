import * as yup from "yup";

export const userBaseSchema = yup.object({
  first_name: yup.string().trim().required("El nombre es obligatorio"),
  last_name: yup.string().trim().required("El apellido es obligatorio"),
  username: yup.string().trim().required("El usuario es obligatorio"),
  email: yup
    .string()
    .trim()
    .email("El correo electronico no es valido")
    .required("El correo electronico es obligatorio"),
  role_ids: yup.array().of(yup.number().required()).default([]).defined(),
});

export const userPasswordEditSchema = yup.object({
  current_password: yup.string().nullable().defined(),
  new_password: yup
    .string()
    .required("La nueva contrasena es obligatoria")
    .min(8, "La contrasena debe tener al menos 8 caracteres"),
  confirm_password: yup
    .string()
    .required("La confirmacion de contrasena es obligatoria")
    .oneOf([yup.ref("new_password")], "Las contrasenas deben coincidir"),
});

export const userCreateSchema = userBaseSchema;
export const userEditSchema = userBaseSchema;

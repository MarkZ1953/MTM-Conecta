import * as yup from "yup";

export const subscriberBaseSchema = yup.object({
  email: yup.string().trim().email("Ingresa un correo válido").required("El correo es obligatorio"),
  name: yup.string().trim().default("").defined(),
  status: yup
    .mixed<"ACTIVE" | "UNSUBSCRIBED">()
    .oneOf(["ACTIVE", "UNSUBSCRIBED"], "Selecciona un estado válido")
    .required("El estado es obligatorio"),
  origin: yup
    .mixed<"BLOG" | "HOME" | "CAMPAIGN" | "ADMIN" | "OTHER">()
    .oneOf(["BLOG", "HOME", "CAMPAIGN", "ADMIN", "OTHER"], "Selecciona un origen válido")
    .required("El origen es obligatorio"),
  consent: yup.boolean().default(true).defined(),
  notes: yup.string().trim().default("").defined(),
});

export const subscriberCreateSchema = subscriberBaseSchema;
export const subscriberEditSchema = subscriberBaseSchema;

import * as yup from "yup";

/**
 * Validación de campaña. Los archivos (image/document) NO se validan aquí
 * porque yup no maneja bien objetos File; su presencia se valida en el
 * formulario según el content_type. Aquí validamos los campos de texto y
 * las reglas condicionales (ej: el editor requiere html_content).
 */
export const campaignSchema = yup.object({
  subject: yup.string().trim().required("El asunto es obligatorio"),

  content_type: yup
    .string()
    .oneOf(["BUILDER", "IMAGE", "PDF"], "Tipo de contenido inválido")
    .required("El tipo de contenido es obligatorio"),

  recipient_group: yup
    .string()
    .oneOf(["DONORS", "GUARDIANS", "USERS", "ALL"], "Grupo de destinatarios inválido")
    .required("Debes elegir los destinatarios"),

  cta_text: yup.string().trim().optional(),

  cta_url: yup
    .string()
    .trim()
    .url("Debe ser una URL válida (https://...)")
    .optional(),

  html_content: yup.string().when("content_type", {
    is: "BUILDER",
    then: (schema) => schema.trim().required("El contenido del editor es obligatorio"),
    otherwise: (schema) => schema.optional(),
  }),

  // Los archivos se conservan en el form pero su presencia se valida en el submit
  image: yup.mixed().nullable().optional(),
  document: yup.mixed().nullable().optional(),
});

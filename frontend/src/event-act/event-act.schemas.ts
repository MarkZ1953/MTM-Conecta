import * as yup from "yup";

export const eventActBaseSchema = yup.object({
    event: yup.number().typeError("Debe ser un número válido").required("El evento es obligatorio"),
    content: yup.string().trim().required("El contenido del acta es obligatorio"),
    digital_signature_path: yup.mixed().nullable().optional(), // Puede ajustarse para archivos reales
});

export const eventActCreateSchema = eventActBaseSchema;
export const eventActEditSchema = eventActBaseSchema;

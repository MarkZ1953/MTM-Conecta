import * as yup from "yup";

export const evidenceBaseSchema = yup.object({
    event: yup.number().typeError("Debe ser un número válido").required("El evento es obligatorio"),
    description: yup.string().trim().optional(),
    file: yup.mixed().nullable().optional(), // Similar a digital_signature
});

export const evidenceCreateSchema = evidenceBaseSchema;
export const evidenceEditSchema = evidenceBaseSchema;

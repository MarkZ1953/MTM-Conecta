import * as yup from "yup";

export const beneficiaryBaseSchema = yup.object({
    first_name: yup.string().trim().required("El nombre es obligatorio"),
    last_name: yup.string().trim().required("El apellido es obligatorio"),
    birth_date: yup.string().required("La fecha de nacimiento es obligatoria"),
    identification_number: yup.string().trim().required("La identificación es obligatoria"),
    notes: yup.string().trim().nullable().optional(),
});

export const beneficiaryCreateSchema = beneficiaryBaseSchema;
export const beneficiaryEditSchema = beneficiaryBaseSchema;
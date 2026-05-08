import * as yup from "yup";

export const beneficiarySchema = yup.object({
    first_name: yup.string().required("El nombre es obligatorio"),
    last_name: yup.string().required("El apellido es obligatorio"),
    birth_date: yup.string().required("La fecha de nacimiento es obligatoria"),
    identification_number: yup.string().required("El número de identificación es obligatorio"),
    notes: yup.string().optional(),
});
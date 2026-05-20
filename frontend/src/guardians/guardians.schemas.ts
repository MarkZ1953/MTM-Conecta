import * as yup from "yup";

export const guardianBaseSchema = yup.object({
    beneficiary: yup.number().typeError("Debe ser un número válido").required("El beneficiario es obligatorio"),
    first_name: yup.string().trim().max(64, "Máximo 64 caracteres").required("Los nombres son obligatorios"),
    last_name: yup.string().trim().max(64, "Máximo 64 caracteres").required("Los apellidos son obligatorios"),
    identification_number: yup.string().trim().max(32, "Máximo 32 caracteres").required("El documento de identidad es obligatorio"),
    phone_number: yup.string().trim().max(32, "Máximo 32 caracteres").required("El teléfono es obligatorio"),
    email: yup.string().email("Debe ser un email válido").max(32, "Máximo 32 caracteres").required("El email es obligatorio"),
});

export const guardianCreateSchema = guardianBaseSchema;
export const guardianEditSchema = guardianBaseSchema;

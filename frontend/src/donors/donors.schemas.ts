import * as yup from "yup";
import type { DonorType } from "./donors.types";

const donorTypes: DonorType[] = ["PERSON", "FAMILY", "COMPANY"];

export const donorBaseSchema = yup.object({
    user: yup.number().typeError("Debe ser un ID de usuario válido").required("El usuario es obligatorio"),
    donor_type: yup
        .mixed<DonorType>()
        .oneOf(donorTypes, "Selecciona un tipo de donante válido")
        .required("El tipo de donante es obligatorio"),
    organization_name: yup.string().trim().max(128, "Máximo 128 caracteres").defined(),
    first_name: yup.string().trim().max(64, "Máximo 64 caracteres").required("El nombre es obligatorio"),
    last_name: yup.string().trim().max(64, "Máximo 64 caracteres").required("El apellido es obligatorio"),
    email: yup.string().email("Debe ser un email válido").max(32, "Máximo 32 caracteres").required("El email es obligatorio"),
});

export const donorCreateSchema = donorBaseSchema;
export const donorEditSchema = donorBaseSchema;

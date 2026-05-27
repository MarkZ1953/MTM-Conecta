import * as yup from "yup";
import type { DonationStatus, DonationType } from "./donations.types";

const donationTypes: DonationType[] = ["ECOAPORTE", "PERMANENT_SPONSOR"];
const donationStatuses: DonationStatus[] = ["PENDING", "COMPLETED", "FAILED"];

export const donationBaseSchema = yup.object({
    donor: yup.number().typeError("El donante debe ser un número").required("El donante es obligatorio"),
    amount: yup.number().typeError("El monto debe ser un número").positive("El monto debe ser positivo").required("El monto es obligatorio"),
    donation_type: yup
        .mixed<DonationType>()
        .oneOf(donationTypes, "Selecciona un tipo de donación válido")
        .required("El tipo de donación es obligatorio"),
    status: yup
        .mixed<DonationStatus>()
        .oneOf(donationStatuses, "Estado inválido")
        .required("El estado es obligatorio"),
});

export const donationCreateSchema = donationBaseSchema;
export const donationEditSchema = donationBaseSchema;

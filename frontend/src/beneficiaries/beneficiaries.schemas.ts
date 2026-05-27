import * as yup from "yup";
import type { BeneficiaryTreatmentStage } from "./beneficiaries.types";

const treatmentStages: BeneficiaryTreatmentStage[] = [
    "INITIAL_SUPPORT",
    "MID_TREATMENT",
    "SURVIVOR",
];

export const beneficiaryBaseSchema = yup.object({
    first_name: yup.string().trim().required("El nombre es obligatorio"),
    last_name: yup.string().trim().required("El apellido es obligatorio"),
    birth_date: yup.string().required("La fecha de nacimiento es obligatoria"),
    identification_number: yup.string().trim().required("La identificación es obligatoria"),
    municipality: yup.string().trim().defined(),
    treatment_stage: yup
        .mixed<BeneficiaryTreatmentStage>()
        .oneOf(treatmentStages, "Selecciona una etapa válida")
        .required("La etapa del tratamiento es obligatoria"),
    treatment_status: yup.string().trim().defined(),
    received_aid: yup.string().trim().defined(),
    follow_up_notes: yup.string().trim().defined(),
    notes: yup.string().trim().nullable().defined(),
});

export const beneficiaryCreateSchema = beneficiaryBaseSchema;
export const beneficiaryEditSchema = beneficiaryBaseSchema;

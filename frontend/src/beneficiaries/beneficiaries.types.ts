export type BeneficiaryTreatmentStage =
    | "INITIAL_SUPPORT"
    | "MID_TREATMENT"
    | "SURVIVOR";

export const beneficiaryTreatmentStageLabels: Record<BeneficiaryTreatmentStage, string> = {
    INITIAL_SUPPORT: "Apoyo integral inicial",
    MID_TREATMENT: "Mitad de tratamiento",
    SURVIVOR: "Sobreviviente",
};

export interface Beneficiary {
    id: number;
    first_name: string;
    last_name: string;
    birth_date: string;
    identification_number: string;
    municipality: string;
    treatment_stage: BeneficiaryTreatmentStage;
    treatment_status: string;
    received_aid: string;
    follow_up_notes: string;
    photo: string | null;
    authorization_doc: string | null;
    registration_date: string;
    notes: string | null;
    is_active: boolean;
}

export interface BeneficiaryPayload {
    first_name: string;
    last_name: string;
    birth_date: string;
    identification_number: string;
    municipality: string;
    treatment_stage: BeneficiaryTreatmentStage;
    treatment_status: string;
    received_aid: string;
    follow_up_notes: string;
    notes: string | null;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

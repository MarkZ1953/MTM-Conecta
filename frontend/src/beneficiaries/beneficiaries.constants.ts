import { beneficiaryTreatmentStageLabels, type BeneficiaryTreatmentStage } from "./beneficiaries.types";

// ────────────────────────────────────────────────────────────────────────────
// Municipios de la región Orinoquía — fuente de verdad para el selector
// ────────────────────────────────────────────────────────────────────────────

export interface MunicipalityOption {
    value: string;
    label: string;
    department: string;
}

export interface MunicipalityGroup {
    department: string;
    municipalities: MunicipalityOption[];
}

const arauca: MunicipalityOption[] = [
    { value: "Arauca", label: "Arauca", department: "Arauca" },
    { value: "Arauquita", label: "Arauquita", department: "Arauca" },
    { value: "Cravo Norte", label: "Cravo Norte", department: "Arauca" },
    { value: "Fortul", label: "Fortul", department: "Arauca" },
    { value: "Puerto Rondón", label: "Puerto Rondón", department: "Arauca" },
    { value: "Saravena", label: "Saravena", department: "Arauca" },
    { value: "Tame", label: "Tame", department: "Arauca" },
];

const casanare: MunicipalityOption[] = [
    { value: "Aguazul", label: "Aguazul", department: "Casanare" },
    { value: "Chámeza", label: "Chámeza", department: "Casanare" },
    { value: "Hato Corozal", label: "Hato Corozal", department: "Casanare" },
    { value: "La Salina", label: "La Salina", department: "Casanare" },
    { value: "Maní", label: "Maní", department: "Casanare" },
    { value: "Monterrey", label: "Monterrey", department: "Casanare" },
    { value: "Nunchía", label: "Nunchía", department: "Casanare" },
    { value: "Orocué", label: "Orocué", department: "Casanare" },
    { value: "Paz de Ariporo", label: "Paz de Ariporo", department: "Casanare" },
    { value: "Pore", label: "Pore", department: "Casanare" },
    { value: "Recetor", label: "Recetor", department: "Casanare" },
    { value: "Sabanalarga", label: "Sabanalarga", department: "Casanare" },
    { value: "Sácama", label: "Sácama", department: "Casanare" },
    { value: "San Luis de Palenque", label: "San Luis de Palenque", department: "Casanare" },
    { value: "Támara", label: "Támara", department: "Casanare" },
    { value: "Tauramena", label: "Tauramena", department: "Casanare" },
    { value: "Trinidad", label: "Trinidad", department: "Casanare" },
    { value: "Villanueva", label: "Villanueva", department: "Casanare" },
    { value: "Yopal", label: "Yopal", department: "Casanare" },
];

const meta: MunicipalityOption[] = [
    { value: "Acacías", label: "Acacías", department: "Meta" },
    { value: "Barranca de Upía", label: "Barranca de Upía", department: "Meta" },
    { value: "Cabuyaro", label: "Cabuyaro", department: "Meta" },
    { value: "Castilla la Nueva", label: "Castilla la Nueva", department: "Meta" },
    { value: "Cubarral", label: "Cubarral", department: "Meta" },
    { value: "Cumaral", label: "Cumaral", department: "Meta" },
    { value: "El Calvario", label: "El Calvario", department: "Meta" },
    { value: "El Castillo", label: "El Castillo", department: "Meta" },
    { value: "El Dorado", label: "El Dorado", department: "Meta" },
    { value: "Fuente de Oro", label: "Fuente de Oro", department: "Meta" },
    { value: "Granada", label: "Granada", department: "Meta" },
    { value: "Guamal", label: "Guamal", department: "Meta" },
    { value: "La Macarena", label: "La Macarena", department: "Meta" },
    { value: "Lejanías", label: "Lejanías", department: "Meta" },
    { value: "Mapiripán", label: "Mapiripán", department: "Meta" },
    { value: "Mesetas", label: "Mesetas", department: "Meta" },
    { value: "Puerto Concordia", label: "Puerto Concordia", department: "Meta" },
    { value: "Puerto Gaitán", label: "Puerto Gaitán", department: "Meta" },
    { value: "Puerto Lleras", label: "Puerto Lleras", department: "Meta" },
    { value: "Puerto López", label: "Puerto López", department: "Meta" },
    { value: "Puerto Rico", label: "Puerto Rico", department: "Meta" },
    { value: "Restrepo", label: "Restrepo", department: "Meta" },
    { value: "San Carlos de Guaroa", label: "San Carlos de Guaroa", department: "Meta" },
    { value: "San Juan de Arama", label: "San Juan de Arama", department: "Meta" },
    { value: "San Juanito", label: "San Juanito", department: "Meta" },
    { value: "San Martín", label: "San Martín", department: "Meta" },
    { value: "Uribe", label: "Uribe", department: "Meta" },
    { value: "Villavicencio", label: "Villavicencio", department: "Meta" },
    { value: "Vista Hermosa", label: "Vista Hermosa", department: "Meta" },
];

const vichada: MunicipalityOption[] = [
    { value: "Cumaribo", label: "Cumaribo", department: "Vichada" },
    { value: "La Primavera", label: "La Primavera", department: "Vichada" },
    { value: "Puerto Carreño", label: "Puerto Carreño", department: "Vichada" },
    { value: "Santa Rosalía", label: "Santa Rosalía", department: "Vichada" },
];

/** Todos los municipios en una sola lista plana */
export const ORINOQUIA_MUNICIPALITIES: MunicipalityOption[] = [
    ...arauca,
    ...casanare,
    ...meta,
    ...vichada,
];

/** Municipios agrupados por departamento — para Dropdown con optionGroup */
export const ORINOQUIA_MUNICIPALITIES_GROUPED: MunicipalityGroup[] = [
    { department: "Arauca", municipalities: arauca },
    { department: "Casanare", municipalities: casanare },
    { department: "Meta", municipalities: meta },
    { department: "Vichada", municipalities: vichada },
];

/** Set para validación rápida O(1) */
export const ORINOQUIA_MUNICIPALITY_VALUES = new Set(
    ORINOQUIA_MUNICIPALITIES.map((m) => m.value),
);

// ────────────────────────────────────────────────────────────────────────────
// Opciones de etapa del tratamiento (derivadas del enum existente)
// ────────────────────────────────────────────────────────────────────────────

export const TREATMENT_STAGE_OPTIONS = Object.entries(beneficiaryTreatmentStageLabels).map(
    ([value, label]) => ({ value: value as BeneficiaryTreatmentStage, label }),
);

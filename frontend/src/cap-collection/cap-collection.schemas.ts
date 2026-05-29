import * as yup from "yup";

// ── Company ────────────────────────────────────────────────

export const companyBaseSchema = yup.object({
    nit: yup.string().required("El NIT es obligatorio"),
    business_name: yup.string().required("La razón social es obligatoria"),
    contact_name: yup.string().required("El nombre de contacto es obligatorio"),
    contact_email: yup.string().email("Correo inválido").required("El correo es obligatorio"),
    contact_phone: yup.string().required("El teléfono es obligatorio"),
});

export const companyCreateSchema = companyBaseSchema;
export const companyEditSchema = companyBaseSchema;

// ── Collection Point ───────────────────────────────────────

export const collectionPointBaseSchema = yup.object({
    company: yup.number().typeError("La empresa debe ser un número").required("La empresa es obligatoria"),
    name: yup.string().required("El nombre de la sede es obligatorio"),
    address: yup.string().required("La dirección es obligatoria"),
    municipality: yup.string().required("El municipio es obligatorio"),
    department: yup.string().required("El departamento es obligatorio"),
    contact_name: yup.string().nullable(),
    contact_phone: yup.string().nullable(),
});

export const collectionPointCreateSchema = collectionPointBaseSchema;
export const collectionPointEditSchema = collectionPointBaseSchema;

// ── Collection Request ─────────────────────────────────────

export const collectionRequestBaseSchema = yup.object({
    collection_point: yup.number().typeError("El punto de recolección debe ser un número").required("El punto de recolección es obligatorio"),
    status: yup
        .string()
        .oneOf(["PENDING", "ASSIGNED", "IN_ROUTE", "COLLECTED", "CANCELLED"], "Estado inválido")
        .required("El estado es obligatorio"),
    estimated_weight_kg: yup
        .number()
        .typeError("El peso debe ser un número")
        .positive("El peso debe ser positivo")
        .required("El peso estimado es obligatorio"),
    scheduled_date: yup.string().required("La fecha programada es obligatoria"),
    driver_name: yup.string().nullable(),
    notes: yup.string().nullable(),
});

export const collectionRequestCreateSchema = collectionRequestBaseSchema;
export const collectionRequestEditSchema = collectionRequestBaseSchema;

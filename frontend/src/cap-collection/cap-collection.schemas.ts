import * as yup from "yup";

// ── Company ────────────────────────────────────────────────

export const companyBaseSchema = yup.object({
    nit: yup
        .string()
        .required("El NIT es obligatorio")
        .matches(
            /^\d+-\d$/,
            "El NIT debe incluir el dígito de verificación separado por un guion (Ej: 900123456-1)"
        ),
    business_name: yup.string().required("La razón social es obligatoria"),
    contact_name: yup.string().required("El nombre de contacto es obligatorio"),
    contact_email: yup
        .string()
        .email("Correo inválido")
        .required("El correo es obligatorio")
        .test(
            "corporate-email",
            "Se requiere un correo institucional corporativo. Los dominios de correo público (gmail, hotmail, yahoo, etc.) no están autorizados.",
            (val) => {
                if (!val) return false;
                const domain = val.toLowerCase().split("@")[1];
                const forbidden = [
                    "gmail.com", "hotmail.com", "yahoo.com", "outlook.com",
                    "live.com", "msn.com", "icloud.com", "aol.com", "zoho.com", "mail.com"
                ];
                return !forbidden.includes(domain);
            }
        ),
    contact_phone: yup.string().required("El teléfono es obligatorio"),
    economic_sector: yup.string().required("El sector económico es obligatorio"),
    company_size: yup.string().required("El tamaño de la empresa es obligatorio"),
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
    latitude: yup
        .number()
        .transform((value, originalValue) => originalValue === "" ? null : value)
        .typeError("La latitud debe ser un número")
        .min(-90, "La latitud debe estar entre -90 y 90")
        .max(90, "La latitud debe estar entre -90 y 90")
        .nullable()
        .optional(),
    longitude: yup
        .number()
        .transform((value, originalValue) => originalValue === "" ? null : value)
        .typeError("La longitud debe ser un número")
        .min(-180, "La longitud debe estar entre -180 y 180")
        .max(180, "La longitud debe estar entre -180 y 180")
        .nullable()
        .optional(),
});

export const collectionPointCreateSchema = collectionPointBaseSchema;
export const collectionPointEditSchema = collectionPointBaseSchema;

// ── Collection Request ─────────────────────────────────────

export const collectionRequestBaseSchema = yup.object({
    collection_point: yup.number().typeError("El punto de recolección debe ser un número").required("El punto de recolección es obligatorio"),
    status: yup
        .string()
        .oneOf(["PENDING", "ASSIGNED", "IN_ROUTE", "COLLECTED", "PROCESSED", "CANCELLED"], "Estado inválido")
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

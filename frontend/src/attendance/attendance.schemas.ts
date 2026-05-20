import * as yup from "yup";

export const attendanceBaseSchema = yup.object({
    beneficiary: yup.number().typeError("Debe ser un número válido").required("El beneficiario es obligatorio"),
    event: yup.number().typeError("Debe ser un número válido").required("El evento es obligatorio"),
    attended: yup.boolean().required("La asistencia es obligatoria"),
    notes: yup.string().trim().nullable().optional(),
});

export const attendanceCreateSchema = attendanceBaseSchema;
export const attendanceEditSchema = attendanceBaseSchema;

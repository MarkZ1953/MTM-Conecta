import * as yup from "yup";

export const eventBaseSchema = yup.object({
    title: yup.string().trim().required("El título es obligatorio"),
    description: yup.string().trim().required("La descripción es obligatoria"),
    start_date: yup.string().required("La fecha de inicio es obligatoria"),
    end_date: yup.string().required("La fecha de finalización es obligatoria"),
    location: yup.string().trim().required("La ubicación es obligatoria"),
});

export const eventCreateSchema = eventBaseSchema;
export const eventEditSchema = eventBaseSchema;

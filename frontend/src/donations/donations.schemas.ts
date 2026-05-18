import * as yup from "yup";

export const donationBaseSchema = yup.object({
    donor: yup.number().typeError("El donante debe ser un número").required("El donante es obligatorio"),
    amount: yup.number().typeError("El monto debe ser un número").positive("El monto debe ser positivo").required("El monto es obligatorio"),
    status: yup.string().oneOf(["PENDING", "COMPLETED", "FAILED"], "Estado inválido").required("El estado es obligatorio"),
});

export const donationCreateSchema = donationBaseSchema;
export const donationEditSchema = donationBaseSchema;

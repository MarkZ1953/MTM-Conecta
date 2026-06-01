import * as yup from "yup";
import type { VolunteerStatus, SupportArea } from "./volunteers.types";

const volunteerStatuses: VolunteerStatus[] = ["PENDING", "INTERVIEWED", "APPROVED", "REJECTED", "INACTIVE"];
const supportAreas: SupportArea[] = ["TECHNICAL", "SOCIAL"];

export const volunteerAvailabilitySchema = yup.object({
  day_of_week: yup
    .number()
    .typeError("El día debe ser un número")
    .integer("Debe ser un número entero")
    .min(1, "El día debe estar entre Lunes (1) y Domingo (7)")
    .max(7, "El día debe estar entre Lunes (1) y Domingo (7)")
    .required("El día de la semana es obligatorio"),
  start_time: yup
    .string()
    .trim()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, "Formato de hora inválido (HH:MM)")
    .required("La hora de inicio es obligatoria"),
  end_time: yup
    .string()
    .trim()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, "Formato de hora inválido (HH:MM)")
    .required("La hora de fin es obligatoria"),
});

export const volunteerBaseSchema = yup.object({
  first_name: yup.string().trim().max(64, "Máximo 64 caracteres").required("El nombre es obligatorio"),
  last_name: yup.string().trim().max(64, "Máximo 64 caracteres").required("El apellido es obligatorio"),
  identification_number: yup.string().trim().max(32, "Máximo 32 caracteres").required("La identificación es obligatoria"),
  email: yup.string().email("Debe ser un email válido").max(128, "Máximo 128 caracteres").required("El email es obligatorio"),
  phone: yup.string().trim().max(32, "Máximo 32 caracteres").required("El teléfono es obligatorio"),
  profession: yup.string().trim().max(128, "Máximo 128 caracteres").required("La profesión/oficio es obligatoria"),
  support_area: yup
    .mixed<SupportArea>()
    .oneOf(supportAreas, "Selecciona un área de apoyo válida")
    .required("El área de apoyo es obligatoria"),
  status: yup
    .mixed<VolunteerStatus>()
    .oneOf(volunteerStatuses, "Selecciona un estado válido")
    .required("El estado es obligatorio"),
  notes: yup.string().trim().nullable(),
  availabilities: yup.array().of(volunteerAvailabilitySchema).default([]),
});

export const volunteerPublicRegisterSchema = yup.object({
  first_name: yup.string().trim().max(64, "Máximo 64 caracteres").required("El nombre es obligatorio"),
  last_name: yup.string().trim().max(64, "Máximo 64 caracteres").required("El apellido es obligatorio"),
  identification_number: yup.string().trim().max(32, "Máximo 32 caracteres").required("La identificación es obligatoria"),
  email: yup.string().email("Debe ser un email válido").max(128, "Máximo 128 caracteres").required("El email es obligatorio"),
  phone: yup.string().trim().max(32, "Máximo 32 caracteres").required("El teléfono es obligatorio"),
  profession: yup.string().trim().max(128, "Máximo 128 caracteres").required("La profesión/oficio es obligatoria"),
  support_area: yup
    .mixed<SupportArea>()
    .oneOf(supportAreas, "Selecciona un área de apoyo válida")
    .required("El área de apoyo es obligatoria"),
  notes: yup.string().trim().nullable(),
  availabilities: yup.array().of(volunteerAvailabilitySchema).min(1, "Debes agregar al menos un bloque de disponibilidad").required("La disponibilidad es obligatoria"),
  habeas_data_opt_in: yup
    .boolean()
    .oneOf([true], "Debes aceptar los términos y condiciones de tratamiento de datos personales (Ley 1581) para continuar")
    .required("Debes aceptar los términos de tratamiento de datos"),
});

export const volunteerTaskSchema = yup.object({
  title: yup.string().trim().max(128, "Máximo 128 caracteres").required("El título es obligatorio"),
  description: yup.string().trim().nullable(),
  hours_spent: yup
    .number()
    .typeError("Las horas deben ser un número")
    .positive("Debe ser mayor a 0")
    .max(24, "Máximo 24 horas por día/tarea")
    .required("Las horas dedicadas son obligatorias"),
  date: yup.string().trim().required("La fecha es obligatoria"),
  project: yup.number().nullable().typeError("Selecciona un proyecto válido"),
});

export const volunteerCreateSchema = volunteerBaseSchema;
export const volunteerEditSchema = volunteerBaseSchema;

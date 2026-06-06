import * as yup from "yup";
import { getImageValidationMessage } from "@/utils/upload-validation";

export const blogPostBaseSchema = yup.object({
  title: yup.string().trim().required("El título es obligatorio"),
  slug: yup.string().trim().default("").defined(),
  summary: yup
    .string()
    .trim()
    .max(520, "El resumen no debe superar 520 caracteres")
    .required("El resumen es obligatorio"),
  content: yup.string().trim().required("El contenido completo es obligatorio"),
  image_alt: yup.string().trim().default("").defined(),
  published_at: yup.string().default("").defined(),
  status: yup
    .mixed<"draft" | "published">()
    .oneOf(["draft", "published"], "Selecciona un estado válido")
    .required("El estado es obligatorio"),
  image_upload: yup
    .mixed<File>()
    .nullable()
    .default(null)
    .defined()
    .test("valid-image-upload", "Selecciona una imagen válida.", function (value) {
      if (!value) return true;
      if (!(value instanceof File)) return false;
      const message = getImageValidationMessage(value);
      return message ? this.createError({ message }) : true;
    }),
});

export const blogPostCreateSchema = blogPostBaseSchema;
export const blogPostEditSchema = blogPostBaseSchema;

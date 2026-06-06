const MB = 1024 * 1024;

export const uploadLimits = {
  imageMaxMb: Number(import.meta.env.VITE_UPLOAD_MAX_IMAGE_MB ?? 10),
  documentMaxMb: Number(import.meta.env.VITE_UPLOAD_MAX_DOCUMENT_MB ?? 10),
};

const imageTypes = ["image/jpeg", "image/png", "image/webp"];
const pdfTypes = ["application/pdf"];

export function isAllowedImage(file: File) {
  return imageTypes.includes(file.type);
}

export function isAllowedPdf(file: File) {
  return pdfTypes.includes(file.type) || file.name.toLowerCase().endsWith(".pdf");
}

export function isWithinMb(file: File, maxMb: number) {
  return file.size <= maxMb * MB;
}

export function getImageValidationMessage(file: File | null | undefined) {
  if (!file) return "";
  if (!isAllowedImage(file)) return "Selecciona una imagen JPG, PNG o WebP.";
  if (!isWithinMb(file, uploadLimits.imageMaxMb)) {
    return `La imagen no debe superar ${uploadLimits.imageMaxMb} MB.`;
  }
  return "";
}

export function getPdfValidationMessage(file: File | null | undefined) {
  if (!file) return "";
  if (!isAllowedPdf(file)) return "Selecciona un documento PDF válido.";
  if (!isWithinMb(file, uploadLimits.documentMaxMb)) {
    return `El PDF no debe superar ${uploadLimits.documentMaxMb} MB.`;
  }
  return "";
}

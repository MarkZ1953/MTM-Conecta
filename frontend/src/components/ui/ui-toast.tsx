import { Toast, type ToastMessage } from "primereact/toast";
import React from "react";

export const toastRef = React.createRef<Toast>();

export function UIToast() {
  return <Toast ref={toastRef} position="bottom-right" />;
}

type ToastOptions = Omit<ToastMessage, "severity" | "detail" | "summary">;

export const toast = {
  success: (detail: string, options?: ToastOptions) => {
    toastRef.current?.show({
      severity: "success",
      summary: "Éxito",
      detail,
      life: 3000,
      ...options,
    });
  },
  error: (detail: string, options?: ToastOptions) => {
    toastRef.current?.show({
      severity: "error",
      summary: "Error",
      detail,
      life: 3000,
      ...options,
    });
  },
  info: (detail: string, options?: ToastOptions) => {
    toastRef.current?.show({
      severity: "info",
      summary: "Información",
      detail,
      life: 3000,
      ...options,
    });
  },
  warn: (detail: string, options?: ToastOptions) => {
    toastRef.current?.show({
      severity: "warn",
      summary: "Advertencia",
      detail,
      life: 3000,
      ...options,
    });
  },
};

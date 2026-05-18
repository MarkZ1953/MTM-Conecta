import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { attendanceCreateSchema } from "@/attendance/attendance.schemas";
import { attendanceAPI } from "@/attendance/attendance.api";
import { toast } from "@/components";
import type { AttendancePayload } from "@/attendance/attendance.types";
import { AttendanceFormFields } from "./attendance-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type AttendanceCreateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

const defaultValues: AttendancePayload = {
  beneficiary: 0,
  event: 0,
  attended: false,
  notes: "",
};

export const AttendanceCreateForm = ({
  open,
  setOpen,
  setRefresh,
}: AttendanceCreateFormProps) => {
  const form = useForm<AttendancePayload>({
    resolver: yupResolver(attendanceCreateSchema) as any,
    defaultValues,
  });

  const closeDialog = () => {
    setOpen(false);
    form.reset(defaultValues);
  };

  const onSubmit = async (data: AttendancePayload) => {
    try {
      const { status, data: responseData } = await attendanceAPI.create({ data });

      if (status >= 200 && status < 300) {
        toast.success("Asistencia registrada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo registrar la asistencia.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo registrar la asistencia.");
    }
  };

  const footer = (
    <div className="flex justify-content-end gap-2 pt-2">
      <Button
        type="button"
        label="Cancelar"
        icon="pi pi-times"
        severity="secondary"
        outlined
        onClick={closeDialog}
        disabled={form.formState.isSubmitting}
      />
      <Button
        type="submit"
        label={form.formState.isSubmitting ? "Guardando..." : "Guardar"}
        icon={form.formState.isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-save"}
        onClick={form.handleSubmit(onSubmit)}
        disabled={form.formState.isSubmitting}
      />
    </div>
  );

  return (
    <Dialog
      header="Registrar Asistencia"
      visible={open}
      onHide={closeDialog}
      modal
      draggable={false}
      className="w-11 md:w-8 lg:w-6"
      contentStyle={{ padding: "0 1.5rem 1rem" }}
      footer={footer}
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AttendanceFormFields />
        </form>
      </FormProvider>
    </Dialog>
  );
};

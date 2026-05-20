import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { attendanceEditSchema } from "@/attendance/attendance.schemas";
import { attendanceAPI } from "@/attendance/attendance.api";
import { toast } from "@/components";
import type { Attendance, AttendancePayload } from "@/attendance/attendance.types";
import { AttendanceFormFields } from "./attendance-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type AttendanceEditFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  attendanceObj: Attendance | null;
  setRefresh: SetRefresh;
};

const getDefaultValues = (attendanceObj?: Attendance | null): AttendancePayload => ({
  beneficiary: attendanceObj?.beneficiary ?? 0,
  event: attendanceObj?.event ?? 0,
  attended: attendanceObj?.attended ?? false,
  notes: attendanceObj?.notes ?? "",
});

export const AttendanceEditForm = ({
  open,
  setOpen,
  attendanceObj,
  setRefresh,
}: AttendanceEditFormProps) => {
  const form = useForm<AttendancePayload>({
    resolver: yupResolver(attendanceEditSchema) as any,
    defaultValues: getDefaultValues(attendanceObj),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(attendanceObj));
    }
  }, [form, open, attendanceObj]);

  const closeDialog = () => {
    setOpen(false);
    form.reset(getDefaultValues(attendanceObj));
  };

  const onSubmit = async (data: AttendancePayload) => {
    if (!attendanceObj) return;

    try {
      const { status, data: responseData } = await attendanceAPI.update({
        id: attendanceObj.id,
        data,
      });

      if (status >= 200 && status < 300) {
        toast.success("Asistencia actualizada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo actualizar la asistencia.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar la asistencia.");
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
        disabled={form.formState.isSubmitting || !attendanceObj}
      />
    </div>
  );

  return (
    <Dialog
      header="Editar Asistencia"
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

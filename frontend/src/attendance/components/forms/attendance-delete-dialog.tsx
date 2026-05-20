import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { attendanceAPI } from "@/attendance/attendance.api";
import type { Attendance } from "@/attendance/attendance.types";
import { toast } from "@/components";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type AttendanceDeleteDialogProps = {
  attendanceObj: Attendance | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

export function AttendanceDeleteDialog({
  attendanceObj,
  open,
  setOpen,
  setRefresh,
}: AttendanceDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const closeDialog = () => setOpen(false);

  const onConfirm = async () => {
    if (!attendanceObj) return;

    try {
      setIsDeleting(true);
      const { status } = await attendanceAPI.softDelete({ id: attendanceObj.id });

      if (status >= 200 && status < 300) {
        toast.success("Registro de asistencia eliminado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error("No se pudo eliminar el registro de asistencia.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar el registro.");
    } finally {
      setIsDeleting(false);
    }
  };

  const footer = (
    <div className="flex justify-content-end gap-2">
      <Button
        type="button"
        label="Cancelar"
        icon="pi pi-times"
        severity="secondary"
        outlined
        onClick={closeDialog}
        disabled={isDeleting}
      />
      <Button
        type="button"
        label={isDeleting ? "Eliminando..." : "Eliminar"}
        icon={isDeleting ? "pi pi-spin pi-spinner" : "pi pi-trash"}
        severity="danger"
        onClick={onConfirm}
        disabled={isDeleting || !attendanceObj}
      />
    </div>
  );

  return (
    <Dialog
      header="Eliminar Registro de Asistencia"
      visible={open}
      onHide={closeDialog}
      modal
      draggable={false}
      className="w-11 sm:w-30rem"
      footer={footer}
    >
      <div className="flex align-items-start gap-3">
        <i className="pi pi-exclamation-triangle text-red-500 text-2xl mt-1" />
        <div>
          <p className="mt-0 mb-2">
            Esta acción no se puede deshacer.
          </p>
          <p className="m-0 text-700">
            El registro ID <strong>{attendanceObj?.id}</strong> será eliminado permanentemente.
          </p>
        </div>
      </div>
    </Dialog>
  );
}

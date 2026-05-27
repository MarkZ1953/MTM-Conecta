import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { guardiansAPI } from "@/guardians/guardians.api";
import { toast } from "@/components";

type GuardiansBulkDeleteDialogProps = {
  ids: number[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
};

export function GuardiansBulkDeleteDialog({
  ids,
  open,
  setOpen,
  onSuccess,
}: GuardiansBulkDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const closeDialog = () => setOpen(false);

  const onConfirm = async () => {
    if (ids.length === 0) return;

    try {
      setIsDeleting(true);
      
      const deletePromises = ids.map((id) => guardiansAPI.softDelete({ id }));
      const results = await Promise.allSettled(deletePromises);

      const failedCount = results.filter((r) => r.status === "rejected").length;

      if (failedCount === 0) {
        toast.success(`${ids.length} cuidadores eliminados correctamente.`);
      } else {
        toast.warn(
          `Se eliminaron ${ids.length - failedCount} cuidadores, pero fallaron ${failedCount}.`,
        );
      }

      onSuccess();
      closeDialog();
    } catch (error) {
      toast.error("Ocurrió un error al eliminar los cuidadores.");
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
        label={isDeleting ? "Eliminando..." : "Eliminar seleccionados"}
        icon={isDeleting ? "pi pi-spin pi-spinner" : "pi pi-trash"}
        severity="danger"
        onClick={onConfirm}
        disabled={isDeleting || ids.length === 0}
      />
    </div>
  );

  return (
    <Dialog
      header="Eliminar cuidadores seleccionados"
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
            ¿Estás seguro de que deseas eliminar permanentemente <strong>{ids.length}</strong> cuidador(es) seleccionado(s)?
          </p>
        </div>
      </div>
    </Dialog>
  );
}

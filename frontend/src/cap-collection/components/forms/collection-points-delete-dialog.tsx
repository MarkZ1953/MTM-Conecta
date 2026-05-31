import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { collectionPointsAPI } from "@/cap-collection/cap-collection.api";
import type { CollectionPoint } from "@/cap-collection/cap-collection.types";
import { toast } from "@/components";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type CollectionPointsDeleteDialogProps = {
  pointObj: CollectionPoint | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

export function CollectionPointsDeleteDialog({
  pointObj,
  open,
  setOpen,
  setRefresh,
}: CollectionPointsDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const closeDialog = () => setOpen(false);

  const onConfirm = async () => {
    if (!pointObj) return;

    try {
      setIsDeleting(true);
      const { status } = await collectionPointsAPI.softDelete({ id: pointObj.id });

      if (status >= 200 && status < 300) {
        toast.success("Punto de recolección eliminado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error("No se pudo eliminar el punto de recolección.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar el punto de recolección.");
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
        disabled={isDeleting || !pointObj}
      />
    </div>
  );

  return (
    <Dialog
      header="Eliminar punto de recolección"
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
            El punto de recolección <strong>{pointObj?.name}</strong> será eliminado permanentemente.
          </p>
        </div>
      </div>
    </Dialog>
  );
}

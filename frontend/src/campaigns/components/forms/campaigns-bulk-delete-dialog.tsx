import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { campaignsAPI } from "@/campaigns/campaigns.api";
import { toast } from "@/components";

type CampaignsBulkDeleteDialogProps = {
  ids: number[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
};

export function CampaignsBulkDeleteDialog({
  ids,
  open,
  setOpen,
  onSuccess,
}: CampaignsBulkDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const closeDialog = () => setOpen(false);

  const onConfirm = async () => {
    if (ids.length === 0) return;

    try {
      setIsDeleting(true);
      const { status } = await campaignsAPI.bulkSoftDelete({ ids });

      if (status >= 200 && status < 300) {
        toast.success(`${ids.length} campaña(s) eliminada(s) correctamente.`);
        onSuccess?.();
        closeDialog();
        return;
      }

      throw new Error("No se pudieron eliminar las campañas.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron eliminar las campañas.");
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
        label={isDeleting ? "Eliminando..." : `Eliminar (${ids.length})`}
        icon={isDeleting ? "pi pi-spin pi-spinner" : "pi pi-trash"}
        severity="danger"
        onClick={onConfirm}
        disabled={isDeleting || ids.length === 0}
      />
    </div>
  );

  return (
    <Dialog
      header="Eliminar campañas"
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
          <p className="mt-0 mb-2">Esta acción no se puede deshacer.</p>
          <p className="m-0 text-700">
            Se eliminarán <strong>{ids.length}</strong> campaña(s) seleccionada(s).
          </p>
        </div>
      </div>
    </Dialog>
  );
}

import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { campaignsAPI } from "@/campaigns/campaigns.api";
import type { Campaign } from "@/campaigns/campaigns.types";
import { toast } from "@/components";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type CampaignsDeleteDialogProps = {
  campaignObj: Campaign | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

export function CampaignsDeleteDialog({
  campaignObj,
  open,
  setOpen,
  setRefresh,
}: CampaignsDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const closeDialog = () => setOpen(false);

  const onConfirm = async () => {
    if (!campaignObj) return;

    try {
      setIsDeleting(true);
      const { status } = await campaignsAPI.softDelete({ id: campaignObj.id });

      if (status >= 200 && status < 300) {
        toast.success("Campaña eliminada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error("No se pudo eliminar la campaña.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar la campaña.");
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
        disabled={isDeleting || !campaignObj}
      />
    </div>
  );

  return (
    <Dialog
      header="Eliminar campaña"
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
            La campaña <strong>{campaignObj?.subject}</strong> será eliminada.
          </p>
        </div>
      </div>
    </Dialog>
  );
}

import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { donationsAPI } from "@/donations/donations.api";
import type { Donation } from "@/donations/donations.types";
import { toast } from "@/components";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type DonationsDeleteDialogProps = {
  donationObj: Donation | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

export function DonationsDeleteDialog({
  donationObj,
  open,
  setOpen,
  setRefresh,
}: DonationsDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const closeDialog = () => setOpen(false);

  const onConfirm = async () => {
    if (!donationObj) return;

    try {
      setIsDeleting(true);
      const { status } = await donationsAPI.softDelete({ id: donationObj.id });

      if (status >= 200 && status < 300) {
        toast.success("Donación eliminada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error("No se pudo eliminar la donación.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar la donación.");
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
        disabled={isDeleting || !donationObj}
      />
    </div>
  );

  return (
    <Dialog
      header="Eliminar donación"
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
            La donación ID <strong>{donationObj?.id}</strong> será eliminada permanentemente.
          </p>
        </div>
      </div>
    </Dialog>
  );
}

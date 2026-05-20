import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { beneficiariesAPI } from "@/beneficiaries/beneficiaries.api";
import type { Beneficiary } from "@/beneficiaries/beneficiaries.types";
import { toast } from "@/components";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type BeneficiariesDeleteDialogProps = {
  beneficiary: Beneficiary | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

export function BeneficiariesDeleteDialog({
  beneficiary,
  open,
  setOpen,
  setRefresh,
}: BeneficiariesDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const closeDialog = () => setOpen(false);

  const onConfirm = async () => {
    if (!beneficiary) return;

    try {
      setIsDeleting(true);
      const { status } = await beneficiariesAPI.softDelete({ id: beneficiary.id });

      if (status >= 200 && status < 300) {
        toast.success("Beneficiario eliminado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error("No se pudo eliminar el beneficiario.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar el beneficiario.");
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
        disabled={isDeleting || !beneficiary}
      />
    </div>
  );

  return (
    <Dialog
      header="Eliminar beneficiario"
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
            El beneficiario <strong>{beneficiary?.first_name} {beneficiary?.last_name}</strong> será eliminado permanentemente.
          </p>
        </div>
      </div>
    </Dialog>
  );
}

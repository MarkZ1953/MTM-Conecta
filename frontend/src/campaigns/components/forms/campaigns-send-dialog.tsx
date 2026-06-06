import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { campaignsAPI } from "@/campaigns/campaigns.api";
import type { Campaign } from "@/campaigns/campaigns.types";
import { toast } from "@/components";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type CampaignsSendDialogProps = {
  campaignObj: Campaign | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

const recipientLabel: Record<string, string> = {
  DONORS: "los donantes",
  GUARDIANS: "los cuidadores",
  USERS: "los usuarios del sistema",
  NEWSLETTER: "los suscriptores activos del boletín",
  ALL: "donantes y cuidadores",
};

export function CampaignsSendDialog({
  campaignObj,
  open,
  setOpen,
  setRefresh,
}: CampaignsSendDialogProps) {
  const [isSending, setIsSending] = useState(false);

  const closeDialog = () => setOpen(false);

  const onConfirm = async () => {
    if (!campaignObj) return;

    try {
      setIsSending(true);
      const { status, data } = await campaignsAPI.send({ id: campaignObj.id });

      if (status >= 200 && status < 300) {
        toast.success(data?.message ?? "Campaña enviada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(data?.detail ?? "No se pudo enviar la campaña.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo enviar la campaña.");
    } finally {
      setIsSending(false);
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
        disabled={isSending}
      />
      <Button
        type="button"
        label={isSending ? "Enviando..." : "Enviar ahora"}
        icon={isSending ? "pi pi-spin pi-spinner" : "pi pi-send"}
        onClick={onConfirm}
        disabled={isSending || !campaignObj}
      />
    </div>
  );

  return (
    <Dialog
      header="Enviar campaña"
      visible={open}
      onHide={closeDialog}
      modal
      draggable={false}
      className="w-11 sm:w-30rem"
      footer={footer}
    >
      <div className="flex align-items-start gap-3">
        <i className="pi pi-send text-primary text-2xl mt-1" />
        <div>
          <p className="mt-0 mb-2">
            Vas a enviar la campaña <strong>{campaignObj?.subject}</strong> a{" "}
            <strong>{recipientLabel[campaignObj?.recipient_group ?? "DONORS"]}</strong>.
          </p>
          <p className="m-0 text-700">
            El correo se enviará a todos los destinatarios del grupo. Esta acción no se puede deshacer.
          </p>
        </div>
      </div>
    </Dialog>
  );
}

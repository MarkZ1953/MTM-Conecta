import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { campaignSchema } from "@/campaigns/campaigns.schemas";
import { campaignsAPI } from "@/campaigns/campaigns.api";
import { toast } from "@/components";
import type { CampaignPayload } from "@/campaigns/campaigns.types";
import { CampaignsFormFields } from "./campaigns-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type CampaignsCreateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

const defaultValues: CampaignPayload = {
  subject: "",
  content_type: "IMAGE",
  recipient_group: "DONORS",
  html_content: "",
  cta_text: "",
  cta_url: "",
  image: null,
  document: null,
};

export const CampaignsCreateForm = ({
  open,
  setOpen,
  setRefresh,
}: CampaignsCreateFormProps) => {
  const form = useForm<CampaignPayload>({
    resolver: yupResolver(campaignSchema) as any,
    defaultValues,
  });

  const closeDialog = () => {
    setOpen(false);
    form.reset(defaultValues);
  };

  const onSubmit = async (data: CampaignPayload) => {
    // Validación de archivos según el tipo (yup no valida File)
    if (data.content_type === "IMAGE" && !data.image) {
      toast.error("Debes subir una imagen para este tipo de campaña.");
      return;
    }
    if (data.content_type === "PDF" && !data.document) {
      toast.error("Debes subir un PDF para este tipo de campaña.");
      return;
    }

    // Construye el payload solo con lo relevante al tipo elegido
    const payload: CampaignPayload = {
      subject: data.subject,
      content_type: data.content_type,
      recipient_group: data.recipient_group,
      cta_text: data.cta_text,
      cta_url: data.cta_url,
      html_content: data.content_type === "BUILDER" ? data.html_content : undefined,
      image: data.content_type === "IMAGE" ? data.image : undefined,
      document: data.content_type === "PDF" ? data.document : undefined,
    };

    try {
      const { status, data: responseData } = await campaignsAPI.create({ data: payload });

      if (status >= 200 && status < 300) {
        toast.success("Campaña creada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo crear la campaña.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo crear la campaña.");
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
      header="Crear campaña"
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
          <CampaignsFormFields />
        </form>
      </FormProvider>
    </Dialog>
  );
};

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { evidenceEditSchema } from "@/evidence/evidence.schemas";
import { evidenceAPI } from "@/evidence/evidence.api";
import { toast } from "@/components";
import type { Evidence, EvidencePayload } from "@/evidence/evidence.types";
import { EvidenceFormFields } from "./evidence-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type EvidenceEditFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  evidenceObj: Evidence | null;
  setRefresh: SetRefresh;
};

const getDefaultValues = (evidenceObj?: Evidence | null): EvidencePayload => ({
  event: evidenceObj?.event ?? 0,
  file: evidenceObj?.file ?? "",
  description: evidenceObj?.description ?? "",
});

export const EvidenceEditForm = ({
  open,
  setOpen,
  evidenceObj,
  setRefresh,
}: EvidenceEditFormProps) => {
  const form = useForm<EvidencePayload>({
    resolver: yupResolver(evidenceEditSchema) as any,
    defaultValues: getDefaultValues(evidenceObj),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(evidenceObj));
    }
  }, [form, open, evidenceObj]);

  const closeDialog = () => {
    setOpen(false);
    form.reset(getDefaultValues(evidenceObj));
  };

  const onSubmit = async (data: EvidencePayload) => {
    if (!evidenceObj) return;

    try {
      const { status, data: responseData } = await evidenceAPI.update({
        id: evidenceObj.id,
        data,
      });

      if (status >= 200 && status < 300) {
        toast.success("Evidencia actualizada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo actualizar la evidencia.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar la evidencia.");
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
        disabled={form.formState.isSubmitting || !evidenceObj}
      />
    </div>
  );

  return (
    <Dialog
      header="Editar Evidencia"
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
          <EvidenceFormFields />
        </form>
      </FormProvider>
    </Dialog>
  );
};

import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { evidenceCreateSchema } from "@/evidence/evidence.schemas";
import { evidenceAPI } from "@/evidence/evidence.api";
import { toast } from "@/components";
import type { EvidencePayload } from "@/evidence/evidence.types";
import { EvidenceFormFields } from "./evidence-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type EvidenceCreateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

const defaultValues: EvidencePayload = {
  event: 0,
  file: "",
  description: "",
};

export const EvidenceCreateForm = ({
  open,
  setOpen,
  setRefresh,
}: EvidenceCreateFormProps) => {
  const form = useForm<EvidencePayload>({
    resolver: yupResolver(evidenceCreateSchema) as any,
    defaultValues,
  });

  const closeDialog = () => {
    setOpen(false);
    form.reset(defaultValues);
  };

  const onSubmit = async (data: EvidencePayload) => {
    try {
      const { status, data: responseData } = await evidenceAPI.create({ data });

      if (status >= 200 && status < 300) {
        toast.success("Evidencia registrada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo registrar la evidencia.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo registrar la evidencia.");
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
      header="Registrar Evidencia"
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

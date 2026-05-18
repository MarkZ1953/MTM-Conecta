import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { eventActCreateSchema } from "@/event-act/event-act.schemas";
import { eventActAPI } from "@/event-act/event-act.api";
import { toast } from "@/components";
import type { EventActPayload } from "@/event-act/event-act.types";
import { EventActFormFields } from "./event-act-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type EventActCreateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

const defaultValues: EventActPayload = {
  event: 0,
  content: "",
  digital_signature_path: "",
};

export const EventActCreateForm = ({
  open,
  setOpen,
  setRefresh,
}: EventActCreateFormProps) => {
  const form = useForm<EventActPayload>({
    resolver: yupResolver(eventActCreateSchema) as any,
    defaultValues,
  });

  const closeDialog = () => {
    setOpen(false);
    form.reset(defaultValues);
  };

  const onSubmit = async (data: EventActPayload) => {
    try {
      const { status, data: responseData } = await eventActAPI.create({ data });

      if (status >= 200 && status < 300) {
        toast.success("Acta registrada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo registrar el acta.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo registrar el acta.");
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
      header="Registrar Acta"
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
          <EventActFormFields />
        </form>
      </FormProvider>
    </Dialog>
  );
};

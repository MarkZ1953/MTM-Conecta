import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { eventActEditSchema } from "@/event-act/event-act.schemas";
import { eventActAPI } from "@/event-act/event-act.api";
import { toast } from "@/components";
import type { EventAct, EventActPayload } from "@/event-act/event-act.types";
import { EventActFormFields } from "./event-act-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type EventActEditFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  eventActObj: EventAct | null;
  setRefresh: SetRefresh;
};

const getDefaultValues = (eventActObj?: EventAct | null): EventActPayload => ({
  event: eventActObj?.event ?? 0,
  content: eventActObj?.content ?? "",
  digital_signature_path: eventActObj?.digital_signature_path ?? "",
});

export const EventActEditForm = ({
  open,
  setOpen,
  eventActObj,
  setRefresh,
}: EventActEditFormProps) => {
  const form = useForm<EventActPayload>({
    resolver: yupResolver(eventActEditSchema) as any,
    defaultValues: getDefaultValues(eventActObj),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(eventActObj));
    }
  }, [form, open, eventActObj]);

  const closeDialog = () => {
    setOpen(false);
    form.reset(getDefaultValues(eventActObj));
  };

  const onSubmit = async (data: EventActPayload) => {
    if (!eventActObj) return;

    try {
      const { status, data: responseData } = await eventActAPI.update({
        id: eventActObj.id,
        data,
      });

      if (status >= 200 && status < 300) {
        toast.success("Acta actualizada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo actualizar el acta.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el acta.");
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
        disabled={form.formState.isSubmitting || !eventActObj}
      />
    </div>
  );

  return (
    <Dialog
      header="Editar Acta"
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

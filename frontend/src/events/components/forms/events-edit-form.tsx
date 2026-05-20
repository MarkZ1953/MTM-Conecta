import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { eventEditSchema } from "@/events/events.schemas";
import { eventsAPI } from "@/events/events.api";
import { toast } from "@/components";
import type { Event, EventPayload } from "@/events/events.types";
import { EventsFormFields } from "./events-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type EventsEditFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  eventObj: Event | null;
  setRefresh: SetRefresh;
};

// Función auxiliar para formatear la fecha a datetime-local sin sufijos Z si vienen del backend
const formatDateTimeLocal = (dateStr?: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().slice(0, 16);
};

const getDefaultValues = (eventObj?: Event | null): EventPayload => ({
  title: eventObj?.title ?? "",
  description: eventObj?.description ?? "",
  start_date: formatDateTimeLocal(eventObj?.start_date),
  end_date: formatDateTimeLocal(eventObj?.end_date),
  location: eventObj?.location ?? "",
});

export const EventsEditForm = ({
  open,
  setOpen,
  eventObj,
  setRefresh,
}: EventsEditFormProps) => {
  const form = useForm<EventPayload>({
    resolver: yupResolver(eventEditSchema),
    defaultValues: getDefaultValues(eventObj),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(eventObj));
    }
  }, [form, open, eventObj]);

  const closeDialog = () => {
    setOpen(false);
    form.reset(getDefaultValues(eventObj));
  };

  const onSubmit = async (data: EventPayload) => {
    if (!eventObj) return;

    try {
      const { status, data: responseData } = await eventsAPI.update({
        id: eventObj.id,
        data,
      });

      if (status >= 200 && status < 300) {
        toast.success("Evento actualizado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo actualizar el evento.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el evento.");
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
        disabled={form.formState.isSubmitting || !eventObj}
      />
    </div>
  );

  return (
    <Dialog
      header="Editar evento"
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
          <EventsFormFields />
        </form>
      </FormProvider>
    </Dialog>
  );
};

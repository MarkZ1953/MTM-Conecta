import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { eventCreateSchema } from "@/events/events.schemas";
import { eventsAPI } from "@/events/events.api";
import { toast } from "@/components";
import type { EventPayload } from "@/events/events.types";
import { EventsFormFields } from "./events-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type EventsCreateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

const defaultValues: EventPayload = {
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  location: "",
};

export const EventsCreateForm = ({
  open,
  setOpen,
  setRefresh,
}: EventsCreateFormProps) => {
  const form = useForm<EventPayload>({
    resolver: yupResolver(eventCreateSchema),
    defaultValues,
  });

  const closeDialog = () => {
    setOpen(false);
    form.reset(defaultValues);
  };

  const onSubmit = async (data: EventPayload) => {
    try {
      const { status, data: responseData } = await eventsAPI.create({ data });

      if (status >= 200 && status < 300) {
        toast.success("Evento creado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo crear el evento.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo crear el evento.");
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
      header="Crear evento"
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

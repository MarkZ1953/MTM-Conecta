import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { subscriberEditSchema } from "@/subscribers/subscribers.schemas";
import { subscribersAPI } from "@/subscribers/subscribers.api";
import { toast } from "@/components";
import type { NewsletterSubscriber, NewsletterSubscriberPayload } from "@/subscribers/subscribers.types";
import { SubscriberFormFields } from "./subscriber-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type SubscriberEditFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  subscriber: NewsletterSubscriber | null;
  setRefresh: SetRefresh;
};

const getDefaultValues = (subscriber?: NewsletterSubscriber | null): NewsletterSubscriberPayload => ({
  email: subscriber?.email ?? "",
  name: subscriber?.name ?? "",
  status: subscriber?.status ?? "ACTIVE",
  origin: subscriber?.origin ?? "ADMIN",
  consent: subscriber?.consent ?? true,
  notes: subscriber?.notes ?? "",
});

export const SubscriberEditForm = ({ open, setOpen, subscriber, setRefresh }: SubscriberEditFormProps) => {
  const form = useForm<NewsletterSubscriberPayload>({
    resolver: yupResolver(subscriberEditSchema),
    defaultValues: getDefaultValues(subscriber),
  });

  useEffect(() => {
    if (open) form.reset(getDefaultValues(subscriber));
  }, [form, open, subscriber]);

  const closeDialog = () => {
    setOpen(false);
    form.reset(getDefaultValues(subscriber));
  };

  const onSubmit = async (data: NewsletterSubscriberPayload) => {
    if (!subscriber) return;

    try {
      const { status, data: responseData } = await subscribersAPI.update({
        id: subscriber.id,
        data,
      });

      if (status >= 200 && status < 300) {
        toast.success("Suscriptor actualizado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo actualizar el suscriptor.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el suscriptor.");
    }
  };

  const footer = (
    <div className="flex justify-content-end gap-2 pt-2">
      <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" outlined onClick={closeDialog} disabled={form.formState.isSubmitting} />
      <Button type="submit" label={form.formState.isSubmitting ? "Guardando..." : "Guardar"} icon={form.formState.isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-save"} onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting || !subscriber} />
    </div>
  );

  return (
    <Dialog
      header="Editar suscriptor"
      visible={open}
      onHide={closeDialog}
      modal
      draggable={false}
      className="w-11 md:w-7 lg:w-5"
      contentStyle={{ padding: "0 1.5rem 1rem" }}
      footer={footer}
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <SubscriberFormFields />
        </form>
      </FormProvider>
    </Dialog>
  );
};

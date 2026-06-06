import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { subscriberCreateSchema } from "@/subscribers/subscribers.schemas";
import { subscribersAPI } from "@/subscribers/subscribers.api";
import { toast } from "@/components";
import type { NewsletterSubscriberPayload } from "@/subscribers/subscribers.types";
import { SubscriberFormFields } from "./subscriber-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type SubscriberCreateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
  onSuccess?: () => void;
};

const defaultValues: NewsletterSubscriberPayload = {
  email: "",
  name: "",
  status: "ACTIVE",
  origin: "ADMIN",
  consent: true,
  notes: "",
};

export const SubscriberCreateForm = ({ open, setOpen, setRefresh, onSuccess }: SubscriberCreateFormProps) => {
  const form = useForm<NewsletterSubscriberPayload>({
    resolver: yupResolver(subscriberCreateSchema),
    defaultValues,
  });

  const closeDialog = () => {
    setOpen(false);
    form.reset(defaultValues);
  };

  const onSubmit = async (data: NewsletterSubscriberPayload) => {
    try {
      const { status, data: responseData } = await subscribersAPI.create({ data });

      if (status >= 200 && status < 300) {
        toast.success("Suscriptor creado correctamente.");
        onSuccess?.();
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo crear el suscriptor.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo crear el suscriptor.");
    }
  };

  const footer = (
    <div className="flex justify-content-end gap-2 pt-2">
      <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" outlined onClick={closeDialog} disabled={form.formState.isSubmitting} />
      <Button type="submit" label={form.formState.isSubmitting ? "Guardando..." : "Guardar"} icon={form.formState.isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-save"} onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} />
    </div>
  );

  return (
    <Dialog
      header="Crear suscriptor"
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

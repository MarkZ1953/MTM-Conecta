import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { donationCreateSchema } from "@/donations/donations.schemas";
import { donationsAPI } from "@/donations/donations.api";
import { toast } from "@/components";
import type { DonationPayload } from "@/donations/donations.types";
import { DonationsFormFields } from "./donations-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type DonationsCreateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

const defaultValues: DonationPayload = {
  donor: 0,
  amount: 0,
  status: "PENDING",
};

export const DonationsCreateForm = ({
  open,
  setOpen,
  setRefresh,
}: DonationsCreateFormProps) => {
  const form = useForm<DonationPayload>({
    resolver: yupResolver(donationCreateSchema) as any,
    defaultValues,
  });

  const closeDialog = () => {
    setOpen(false);
    form.reset(defaultValues);
  };

  const onSubmit = async (data: DonationPayload) => {
    try {
      const { status, data: responseData } = await donationsAPI.create({ data });

      if (status >= 200 && status < 300) {
        toast.success("Donación registrada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo registrar la donación.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo registrar la donación.");
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
      header="Registrar donación"
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
          <DonationsFormFields />
        </form>
      </FormProvider>
    </Dialog>
  );
};

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { donationEditSchema } from "@/donations/donations.schemas";
import { donationsAPI } from "@/donations/donations.api";
import { toast } from "@/components";
import type { Donation, DonationPayload } from "@/donations/donations.types";
import { DonationsFormFields } from "./donations-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type DonationsEditFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  donationObj: Donation | null;
  setRefresh: SetRefresh;
};

const getDefaultValues = (donationObj?: Donation | null): DonationPayload => ({
  donor: donationObj?.donor ?? 0,
  amount: donationObj ? parseFloat(donationObj.amount) : 0,
  donation_type: donationObj?.donation_type ?? "ECOAPORTE",
  status: donationObj?.status ?? "PENDING",
});

export const DonationsEditForm = ({
  open,
  setOpen,
  donationObj,
  setRefresh,
}: DonationsEditFormProps) => {
  const form = useForm<DonationPayload>({
    resolver: yupResolver(donationEditSchema) as any,
    defaultValues: getDefaultValues(donationObj),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(donationObj));
    }
  }, [form, open, donationObj]);

  const closeDialog = () => {
    setOpen(false);
    form.reset(getDefaultValues(donationObj));
  };

  const onSubmit = async (data: DonationPayload) => {
    if (!donationObj) return;

    try {
      const { status, data: responseData } = await donationsAPI.update({
        id: donationObj.id,
        data,
      });

      if (status >= 200 && status < 300) {
        toast.success("Donación actualizada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo actualizar la donación.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar la donación.");
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
        disabled={form.formState.isSubmitting || !donationObj}
      />
    </div>
  );

  return (
    <Dialog
      header="Editar donación"
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

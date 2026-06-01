import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { donorEditSchema } from "@/donors/donors.schemas";
import { donorsAPI } from "@/donors/donors.api";
import { toast } from "@/components";
import type { Donor, DonorPayload } from "@/donors/donors.types";
import { DonorsFormFields } from "./donors-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type DonorsEditFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  donorObj: Donor | null;
  setRefresh: SetRefresh;
};

const getDefaultValues = (donorObj?: Donor | null): DonorPayload => ({
  user: donorObj?.user ?? 0,
  donor_type: donorObj?.donor_type ?? "PERSON",
  organization_name: donorObj?.organization_name ?? "",
  first_name: donorObj?.first_name ?? "",
  last_name: donorObj?.last_name ?? "",
  email: donorObj?.email ?? "",
  subscription_amount: donorObj?.subscription_amount ?? 0,
  payment_day: donorObj?.payment_day ?? 5,
  marketing_opt_in: donorObj?.marketing_opt_in ?? true,
});

export const DonorsEditForm = ({
  open,
  setOpen,
  donorObj,
  setRefresh,
}: DonorsEditFormProps) => {
  const form = useForm<DonorPayload>({
    resolver: yupResolver(donorEditSchema) as any,
    defaultValues: getDefaultValues(donorObj),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(donorObj));
    }
  }, [form, open, donorObj]);

  const closeDialog = () => {
    setOpen(false);
    form.reset(getDefaultValues(donorObj));
  };

  const onSubmit = async (data: DonorPayload) => {
    if (!donorObj) return;

    try {
      const { status, data: responseData } = await donorsAPI.update({
        id: donorObj.id,
        data,
      });

      if (status >= 200 && status < 300) {
        toast.success("Donante actualizado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo actualizar el donante.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el donante.");
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
        disabled={form.formState.isSubmitting || !donorObj}
      />
    </div>
  );

  return (
    <Dialog
      header="Editar Donante"
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
          <DonorsFormFields />
        </form>
      </FormProvider>
    </Dialog>
  );
};

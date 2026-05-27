import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { donorCreateSchema } from "@/donors/donors.schemas";
import { donorsAPI } from "@/donors/donors.api";
import { toast } from "@/components";
import type { DonorPayload } from "@/donors/donors.types";
import { DonorsFormFields } from "./donors-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type DonorsCreateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

const defaultValues: DonorPayload = {
  user: 0,
  donor_type: "PERSON",
  organization_name: "",
  first_name: "",
  last_name: "",
  email: "",
};

export const DonorsCreateForm = ({
  open,
  setOpen,
  setRefresh,
}: DonorsCreateFormProps) => {
  const form = useForm<DonorPayload>({
    resolver: yupResolver(donorCreateSchema) as any,
    defaultValues,
  });

  const closeDialog = () => {
    setOpen(false);
    form.reset(defaultValues);
  };

  const onSubmit = async (data: DonorPayload) => {
    try {
      const { status, data: responseData } = await donorsAPI.create({ data });

      if (status >= 200 && status < 300) {
        toast.success("Donante registrado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo registrar el donante.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo registrar el donante.");
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
      header="Registrar Donante"
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

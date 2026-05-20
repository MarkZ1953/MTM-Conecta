import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { beneficiaryCreateSchema } from "@/beneficiaries/beneficiaries.schemas";
import { beneficiariesAPI } from "@/beneficiaries/beneficiaries.api";
import { toast } from "@/components";
import type { BeneficiaryPayload } from "@/beneficiaries/beneficiaries.types";
import { BeneficiariesFormFields } from "./beneficiaries-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type BeneficiariesCreateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

const defaultValues: BeneficiaryPayload = {
  first_name: "",
  last_name: "",
  identification_number: "",
  birth_date: "",
  notes: "",
};

export const BeneficiariesCreateForm = ({
  open,
  setOpen,
  setRefresh,
}: BeneficiariesCreateFormProps) => {
  const form = useForm<BeneficiaryPayload>({
    resolver: yupResolver(beneficiaryCreateSchema),
    defaultValues,
  });

  const closeDialog = () => {
    setOpen(false);
    form.reset(defaultValues);
  };

  const onSubmit = async (data: BeneficiaryPayload) => {
    try {
      const { status, data: responseData } = await beneficiariesAPI.create({ data });

      if (status >= 200 && status < 300) {
        toast.success("Beneficiario creado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo crear el beneficiario.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo crear el beneficiario.");
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
      header="Crear beneficiario"
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
          <BeneficiariesFormFields />
        </form>
      </FormProvider>
    </Dialog>
  );
};

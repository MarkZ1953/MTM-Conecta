import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { beneficiaryEditSchema } from "@/beneficiaries/beneficiaries.schemas";
import { beneficiariesAPI } from "@/beneficiaries/beneficiaries.api";
import { toast } from "@/components";
import type { Beneficiary, BeneficiaryPayload } from "@/beneficiaries/beneficiaries.types";
import { BeneficiariesFormFields } from "./beneficiaries-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type BeneficiariesEditFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  beneficiary: Beneficiary | null;
  setRefresh: SetRefresh;
};

const getDefaultValues = (beneficiary?: Beneficiary | null): BeneficiaryPayload => ({
  first_name: beneficiary?.first_name ?? "",
  last_name: beneficiary?.last_name ?? "",
  identification_number: beneficiary?.identification_number ?? "",
  birth_date: beneficiary?.birth_date ?? "",
  notes: beneficiary?.notes ?? "",
});

export const BeneficiariesEditForm = ({
  open,
  setOpen,
  beneficiary,
  setRefresh,
}: BeneficiariesEditFormProps) => {
  const form = useForm<BeneficiaryPayload>({
    resolver: yupResolver(beneficiaryEditSchema),
    defaultValues: getDefaultValues(beneficiary),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(beneficiary));
    }
  }, [form, open, beneficiary]);

  const closeDialog = () => {
    setOpen(false);
    form.reset(getDefaultValues(beneficiary));
  };

  const onSubmit = async (data: BeneficiaryPayload) => {
    if (!beneficiary) return;

    try {
      const { status, data: responseData } = await beneficiariesAPI.update({
        id: beneficiary.id,
        data,
      });

      if (status >= 200 && status < 300) {
        toast.success("Beneficiario actualizado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo actualizar el beneficiario.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el beneficiario.");
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
        disabled={form.formState.isSubmitting || !beneficiary}
      />
    </div>
  );

  return (
    <Dialog
      header="Editar beneficiario"
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

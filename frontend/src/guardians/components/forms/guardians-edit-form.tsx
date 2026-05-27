import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { guardianEditSchema } from "@/guardians/guardians.schemas";
import { guardiansAPI } from "@/guardians/guardians.api";
import { toast } from "@/components";
import type { Guardian, GuardianPayload } from "@/guardians/guardians.types";
import { GuardiansFormFields } from "./guardians-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type GuardiansEditFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  guardianObj: Guardian | null;
  setRefresh: SetRefresh;
};

const getDefaultValues = (guardianObj?: Guardian | null): GuardianPayload => ({
  beneficiary: guardianObj?.beneficiary ?? 0,
  first_name: guardianObj?.first_name ?? "",
  last_name: guardianObj?.last_name ?? "",
  identification_number: guardianObj?.identification_number ?? "",
  phone_number: guardianObj?.phone_number ?? "",
  email: guardianObj?.email ?? "",
});

export const GuardiansEditForm = ({
  open,
  setOpen,
  guardianObj,
  setRefresh,
}: GuardiansEditFormProps) => {
  const form = useForm<GuardianPayload>({
    resolver: yupResolver(guardianEditSchema) as any,
    defaultValues: getDefaultValues(guardianObj),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(guardianObj));
    }
  }, [form, open, guardianObj]);

  const closeDialog = () => {
    setOpen(false);
    form.reset(getDefaultValues(guardianObj));
  };

  const onSubmit = async (data: GuardianPayload) => {
    if (!guardianObj) return;

    try {
      const { status, data: responseData } = await guardiansAPI.update({
        id: guardianObj.id,
        data,
      });

      if (status >= 200 && status < 300) {
        toast.success("Cuidador actualizado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo actualizar el cuidador.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el cuidador.");
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
        disabled={form.formState.isSubmitting || !guardianObj}
      />
    </div>
  );

  return (
    <Dialog
      header="Editar cuidador"
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
          <GuardiansFormFields />
        </form>
      </FormProvider>
    </Dialog>
  );
};

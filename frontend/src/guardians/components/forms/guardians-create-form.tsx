import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { guardianCreateSchema } from "@/guardians/guardians.schemas";
import { guardiansAPI } from "@/guardians/guardians.api";
import { toast } from "@/components";
import type { GuardianPayload } from "@/guardians/guardians.types";
import { GuardiansFormFields } from "./guardians-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type GuardiansCreateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

const defaultValues: GuardianPayload = {
  beneficiary: 0,
  first_name: "",
  last_name: "",
  identification_number: "",
  phone_number: "",
  email: "",
};

export const GuardiansCreateForm = ({
  open,
  setOpen,
  setRefresh,
}: GuardiansCreateFormProps) => {
  const form = useForm<GuardianPayload>({
    resolver: yupResolver(guardianCreateSchema) as any,
    defaultValues,
  });

  const closeDialog = () => {
    setOpen(false);
    form.reset(defaultValues);
  };

  const onSubmit = async (data: GuardianPayload) => {
    try {
      const { status, data: responseData } = await guardiansAPI.create({ data });

      if (status >= 200 && status < 300) {
        toast.success("Tutor registrado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo registrar el tutor.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo registrar el tutor.");
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
      header="Registrar Tutor"
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

import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { volunteerCreateSchema } from "../../volunteers.schemas";
import { volunteersAPI } from "../../volunteers.api";
import { toast } from "@/components";
import type { VolunteerPayload } from "../../volunteers.types";
import { VolunteersFormFields } from "./volunteers-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type VolunteersCreateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

const defaultValues: VolunteerPayload = {
  first_name: "",
  last_name: "",
  identification_number: "",
  email: "",
  phone: "",
  profession: "",
  support_area: "SOCIAL",
  status: "PENDING",
  notes: "",
  availabilities: [],
};

export const VolunteersCreateForm = ({
  open,
  setOpen,
  setRefresh,
}: VolunteersCreateFormProps) => {
  const form = useForm<VolunteerPayload>({
    resolver: yupResolver(volunteerCreateSchema) as any,
    defaultValues,
  });

  const closeDialog = () => {
    setOpen(false);
    form.reset(defaultValues);
  };

  const onSubmit = async (data: VolunteerPayload) => {
    try {
      const { status, data: responseData } = await volunteersAPI.create({ data });

      if (status >= 200 && status < 300) {
        toast.success("Voluntario registrado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo registrar el voluntario.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo registrar el voluntario.");
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
      header="Registrar Voluntario"
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
          <VolunteersFormFields isAdmin={true} />
        </form>
      </FormProvider>
    </Dialog>
  );
};

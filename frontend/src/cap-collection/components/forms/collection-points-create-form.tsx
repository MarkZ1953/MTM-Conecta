import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { collectionPointCreateSchema } from "@/cap-collection/cap-collection.schemas";
import { collectionPointsAPI } from "@/cap-collection/cap-collection.api";
import { toast } from "@/components";
import type { CollectionPointPayload } from "@/cap-collection/cap-collection.types";
import { CollectionPointsFormFields } from "./collection-points-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type CollectionPointsCreateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

const defaultValues: CollectionPointPayload = {
  company: 0,
  name: "",
  address: "",
  municipality: "",
  department: "",
  contact_name: "",
  contact_phone: "",
};

export const CollectionPointsCreateForm = ({
  open,
  setOpen,
  setRefresh,
}: CollectionPointsCreateFormProps) => {
  const form = useForm<CollectionPointPayload>({
    resolver: yupResolver(collectionPointCreateSchema) as any,
    defaultValues,
  });

  const closeDialog = () => {
    setOpen(false);
    form.reset(defaultValues);
  };

  const onSubmit = async (data: CollectionPointPayload) => {
    try {
      const { status, data: responseData } = await collectionPointsAPI.create({ data });

      if (status >= 200 && status < 300) {
        toast.success("Punto de recolección registrado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo registrar el punto de recolección.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo registrar el punto de recolección.");
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
      header="Registrar punto de recolección"
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
          <CollectionPointsFormFields />
        </form>
      </FormProvider>
    </Dialog>
  );
};

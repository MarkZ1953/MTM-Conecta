import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { collectionRequestCreateSchema } from "@/cap-collection/cap-collection.schemas";
import { collectionRequestsAPI } from "@/cap-collection/cap-collection.api";
import { toast } from "@/components";
import type { CollectionRequestPayload } from "@/cap-collection/cap-collection.types";
import { CollectionRequestsFormFields } from "./collection-requests-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type CollectionRequestsCreateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

const defaultValues: CollectionRequestPayload = {
  collection_point: 0,
  status: "PENDING",
  estimated_weight_kg: 0,
  scheduled_date: "",
  driver_name: "",
  notes: "",
};

export const CollectionRequestsCreateForm = ({
  open,
  setOpen,
  setRefresh,
}: CollectionRequestsCreateFormProps) => {
  const form = useForm<CollectionRequestPayload>({
    resolver: yupResolver(collectionRequestCreateSchema) as any,
    defaultValues,
  });

  const closeDialog = () => {
    setOpen(false);
    form.reset(defaultValues);
  };

  const onSubmit = async (data: CollectionRequestPayload) => {
    try {
      const { status, data: responseData } = await collectionRequestsAPI.create({ data });

      if (status >= 200 && status < 300) {
        toast.success("Solicitud de recolección creada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo crear la solicitud.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo crear la solicitud.");
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
      header="Nueva solicitud de recolección"
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
          <CollectionRequestsFormFields />
        </form>
      </FormProvider>
    </Dialog>
  );
};

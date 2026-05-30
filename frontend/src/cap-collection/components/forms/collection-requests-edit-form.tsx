import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { collectionRequestEditSchema } from "@/cap-collection/cap-collection.schemas";
import { collectionRequestsAPI } from "@/cap-collection/cap-collection.api";
import { toast } from "@/components";
import type { CollectionRequest, CollectionRequestPayload } from "@/cap-collection/cap-collection.types";
import { CollectionRequestsFormFields } from "./collection-requests-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type CollectionRequestsEditFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  requestObj: CollectionRequest | null;
  setRefresh: SetRefresh;
};

const getDefaultValues = (requestObj?: CollectionRequest | null): CollectionRequestPayload => ({
  collection_point: requestObj?.collection_point ?? 0,
  status: requestObj?.status ?? "PENDING",
  estimated_weight_kg: requestObj ? parseFloat(requestObj.estimated_weight_kg) : 0,
  scheduled_date: requestObj?.scheduled_date ?? "",
  driver_name: requestObj?.driver_name ?? "",
  notes: requestObj?.notes ?? "",
});

export const CollectionRequestsEditForm = ({
  open,
  setOpen,
  requestObj,
  setRefresh,
}: CollectionRequestsEditFormProps) => {
  const form = useForm<CollectionRequestPayload>({
    resolver: yupResolver(collectionRequestEditSchema) as any,
    defaultValues: getDefaultValues(requestObj),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(requestObj));
    }
  }, [form, open, requestObj]);

  const closeDialog = () => {
    setOpen(false);
    form.reset(getDefaultValues(requestObj));
  };

  const onSubmit = async (data: CollectionRequestPayload) => {
    if (!requestObj) return;

    try {
      const { status, data: responseData } = await collectionRequestsAPI.update({
        id: requestObj.id,
        data,
      });

      if (status >= 200 && status < 300) {
        toast.success("Solicitud actualizada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo actualizar la solicitud.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar la solicitud.");
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
        disabled={form.formState.isSubmitting || !requestObj}
      />
    </div>
  );

  return (
    <Dialog
      header="Editar solicitud de recolección"
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

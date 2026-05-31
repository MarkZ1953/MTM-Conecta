import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { collectionPointEditSchema } from "@/cap-collection/cap-collection.schemas";
import { collectionPointsAPI } from "@/cap-collection/cap-collection.api";
import { toast } from "@/components";
import type { CollectionPoint, CollectionPointPayload } from "@/cap-collection/cap-collection.types";
import { CollectionPointsFormFields } from "./collection-points-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type CollectionPointsEditFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  pointObj: CollectionPoint | null;
  setRefresh: SetRefresh;
};

const getDefaultValues = (pointObj?: CollectionPoint | null): CollectionPointPayload => ({
  company: pointObj?.company ?? 0,
  name: pointObj?.name ?? "",
  address: pointObj?.address ?? "",
  municipality: pointObj?.municipality ?? "",
  department: pointObj?.department ?? "",
  contact_name: pointObj?.contact_name ?? "",
  contact_phone: pointObj?.contact_phone ?? "",
  latitude: pointObj?.latitude ?? "",
  longitude: pointObj?.longitude ?? "",
});

export const CollectionPointsEditForm = ({
  open,
  setOpen,
  pointObj,
  setRefresh,
}: CollectionPointsEditFormProps) => {
  const form = useForm<CollectionPointPayload>({
    resolver: yupResolver(collectionPointEditSchema) as any,
    defaultValues: getDefaultValues(pointObj),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(pointObj));
    }
  }, [form, open, pointObj]);

  const closeDialog = () => {
    setOpen(false);
    form.reset(getDefaultValues(pointObj));
  };

  const onSubmit = async (data: CollectionPointPayload) => {
    if (!pointObj) return;

    try {
      const { status, data: responseData } = await collectionPointsAPI.update({
        id: pointObj.id,
        data,
      });

      if (status >= 200 && status < 300) {
        toast.success("Punto de recolección actualizado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo actualizar el punto de recolección.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el punto de recolección.");
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
        disabled={form.formState.isSubmitting || !pointObj}
      />
    </div>
  );

  return (
    <Dialog
      header="Editar punto de recolección"
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

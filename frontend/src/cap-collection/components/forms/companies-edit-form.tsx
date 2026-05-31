import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { companyEditSchema } from "@/cap-collection/cap-collection.schemas";
import { companiesAPI } from "@/cap-collection/cap-collection.api";
import { toast } from "@/components";
import type { Company, CompanyPayload } from "@/cap-collection/cap-collection.types";
import { CompaniesFormFields } from "./companies-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type CompaniesEditFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  companyObj: Company | null;
  setRefresh: SetRefresh;
};

const getDefaultValues = (companyObj?: Company | null): CompanyPayload => ({
  nit: companyObj?.nit ?? "",
  business_name: companyObj?.business_name ?? "",
  contact_name: companyObj?.contact_name ?? "",
  contact_email: companyObj?.contact_email ?? "",
  contact_phone: companyObj?.contact_phone ?? "",
  economic_sector: companyObj?.economic_sector ?? "OTRO",
  company_size: companyObj?.company_size ?? "MICRO",
});

export const CompaniesEditForm = ({
  open,
  setOpen,
  companyObj,
  setRefresh,
}: CompaniesEditFormProps) => {
  const form = useForm<CompanyPayload>({
    resolver: yupResolver(companyEditSchema) as any,
    defaultValues: getDefaultValues(companyObj),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(companyObj));
    }
  }, [form, open, companyObj]);

  const closeDialog = () => {
    setOpen(false);
    form.reset(getDefaultValues(companyObj));
  };

  const onSubmit = async (data: CompanyPayload) => {
    if (!companyObj) return;

    try {
      const { status, data: responseData } = await companiesAPI.update({
        id: companyObj.id,
        data,
      });

      if (status >= 200 && status < 300) {
        toast.success("Empresa actualizada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo actualizar la empresa.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar la empresa.");
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
        disabled={form.formState.isSubmitting || !companyObj}
      />
    </div>
  );

  return (
    <Dialog
      header="Editar empresa"
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
          <CompaniesFormFields />
        </form>
      </FormProvider>
    </Dialog>
  );
};

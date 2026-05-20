import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { userCreateSchema } from "@/users/users.schemas";
import { usersAPI } from "@/users/users.api";
import { toast } from "@/components";
import type { UserPayload } from "@/users/users.types";
import { UsersFormFields } from "./users-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type UsersCreateFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: SetRefresh;
};

const defaultValues: UserPayload = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  role_ids: null,
};

export const UsersCreateForm = ({
  open,
  setOpen,
  setRefresh,
}: UsersCreateFormProps) => {
  const form = useForm<UserPayload>({
    resolver: yupResolver(userCreateSchema),
    defaultValues,
  });

  const closeDialog = () => {
    setOpen(false);
    form.reset(defaultValues);
  };

  const onSubmit = async (data: UserPayload) => {
    try {
      const { status, data: responseData } = await usersAPI.create({ data });

      if (status >= 200 && status < 300) {
        toast.success("Usuario creado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo crear el usuario.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo crear el usuario.");
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
      header="Crear usuario"
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
          <UsersFormFields />
        </form>
      </FormProvider>
    </Dialog>
  );
};

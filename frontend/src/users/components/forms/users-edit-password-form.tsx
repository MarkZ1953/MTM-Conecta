import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { userPasswordEditSchema } from "@/users/users.schemas";
import { usersAPI } from "@/users/users.api";
import { toast } from "@/components";
import type { User, UserPasswordPayload } from "@/users/users.types";
import { UsersEditPasswordFormFields } from "./users-edit-password-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type UsersEditPasswordFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User | null;
  setRefresh: SetRefresh;
};

const defaultValues: UserPasswordPayload = {
  current_password: null,
  new_password: "",
  confirm_password: "",
};

export const UsersEditPasswordForm = ({
  open,
  setOpen,
  user,
  setRefresh,
}: UsersEditPasswordFormProps) => {
  const form = useForm<UserPasswordPayload>({
    resolver: yupResolver(userPasswordEditSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [form, open]);

  const closeDialog = () => {
    setOpen(false);
    form.reset(defaultValues);
  };

  const onSubmit = async (data: UserPasswordPayload) => {
    if (!user) return;

    try {
      const { status, data: responseData } = await usersAPI.changePassword(user.id, data);

      if (status >= 200 && status < 300) {
        toast.success("Contrasena actualizada correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo actualizar la contrasena.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar la contrasena.");
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
        disabled={form.formState.isSubmitting || !user}
      />
    </div>
  );

  return (
    <Dialog
      header="Cambiar contrasena"
      visible={open}
      onHide={closeDialog}
      modal
      draggable={false}
      className="w-11 md:w-8 lg:w-6"
      contentStyle={{ padding: "0 1.5rem 1rem" }}
      footer={footer}
    >
      <p className="mt-3 mb-0 text-600">
        {user ? `Define una nueva contrasena para ${user.username}.` : "Selecciona un usuario."}
      </p>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <UsersEditPasswordFormFields />
        </form>
      </FormProvider>
    </Dialog>
  );
};

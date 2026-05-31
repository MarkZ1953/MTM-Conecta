import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { userEditSchema } from "@/users/users.schemas";
import { usersAPI } from "@/users/users.api";
import { toast } from "@/components";
import type { User, UserGroup, UserPayload } from "@/users/users.types";
import { UsersFormFields } from "./users-form-fields";

type SetRefresh = (value: boolean | ((prev: boolean) => boolean)) => void;

type UsersEditFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User | null;
  setRefresh: SetRefresh;
};

const getDefaultValues = (user?: User | null): UserPayload => ({
  username: user?.username ?? "",
  first_name: user?.first_name ?? "",
  last_name: user?.last_name ?? "",
  email: user?.email ?? "",
  role_ids:
    user?.groups
      ?.filter((group): group is UserGroup => typeof group === "object" && "id" in group)
      .map((group) => group.id) ?? [],
});

export const UsersEditForm = ({
  open,
  setOpen,
  user,
  setRefresh,
}: UsersEditFormProps) => {
  const form = useForm<UserPayload>({
    resolver: yupResolver(userEditSchema),
    defaultValues: getDefaultValues(user),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(user));
    }
  }, [form, open, user]);

  const closeDialog = () => {
    setOpen(false);
    form.reset(getDefaultValues(user));
  };

  const onSubmit = async (data: UserPayload) => {
    if (!user) return;

    try {
      const { status, data: responseData } = await usersAPI.update({
        id: user.id,
        data,
      });

      if (status >= 200 && status < 300) {
        toast.success("Usuario actualizado correctamente.");
        setRefresh((prev) => !prev);
        closeDialog();
        return;
      }

      throw new Error(responseData ? JSON.stringify(responseData) : "No se pudo actualizar el usuario.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el usuario.");
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
      header="Editar usuario"
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

import { useFormContext, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usersAPI } from "@/users";
import { ComboboxObject } from "@/components";
import API_BASE_URL from "@/config/api.config";

const getUserName = (u: any) => {
  const full = `${u.first_name || ""} ${u.last_name || ""}`.trim();
  return full ? `${full} (${u.username})` : u.username;
};

export const DonorsFormFields = () => {
  const { control, watch, formState: { errors } } = useFormContext();

  const [searchUser, setSearchUser] = useState<string>("");
  const userId = watch("user");

  // Query to fetch selected user
  const { data: selectedUser, isFetching: isLoadingSelected } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId || typeof userId !== "number") return null;
      const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data;
    },
    enabled: !!userId && typeof userId === "number",
    staleTime: 5 * 60 * 1000,
  });

  // Query to search users
  const { data: users = [] } = useQuery({
    queryKey: ["users", searchUser],
    queryFn: async () => {
      const response = await usersAPI.getAll({
        params: { search: searchUser },
      });
      return (response.data.results ?? []).map((u) => ({
        id: u.id,
        name: getUserName(u),
      }));
    },
    enabled: !!searchUser,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      <div className="field col-12 mb-2">
        <label htmlFor="user" className="block mb-2 font-medium text-700">
          <i className="pi pi-user mr-2 text-primary" />
          Usuario Vinculado
        </label>
        <Controller
          name="user"
          control={control}
          render={({ field }) => {
            const comboboxValue = selectedUser
              ? {
                  id: selectedUser.id,
                  name: getUserName(selectedUser),
                }
              : null;

            const comboboxItems = [...users];
            if (comboboxValue) {
              const exists = comboboxItems.some((item) => String(item.id) === String(comboboxValue.id));
              if (!exists) {
                comboboxItems.push(comboboxValue);
              }
            }

            return (
              <ComboboxObject
                items={comboboxItems}
                value={comboboxValue}
                onValueChange={(val) => {
                  field.onChange(val ? val.id : null);
                }}
                onSearch={setSearchUser}
                onHide={() => setSearchUser("")}
                placeholder="Busca y selecciona un usuario..."
                emptyMessage="No se encontraron usuarios"
                className={errors.user?.message ? "p-invalid w-full" : "w-full"}
                loading={isLoadingSelected}
              />
            );
          }}
        />
        {errors.user?.message && <small className="p-error">{errors.user.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="first_name" className="block mb-2 font-medium text-700">
          <i className="pi pi-id-card mr-2 text-primary" />
          Nombres
        </label>
        <Controller
          name="first_name"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={errors.first_name?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Nombres del donante"
            />
          )}
        />
        {errors.first_name?.message && <small className="p-error">{errors.first_name.message.toString()}</small>}
      </div>

      <div className="field col-12 md:col-6 mb-2">
        <label htmlFor="last_name" className="block mb-2 font-medium text-700">
          <i className="pi pi-id-card mr-2 text-primary" />
          Apellidos
        </label>
        <Controller
          name="last_name"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={errors.last_name?.message ? "p-invalid w-full" : "w-full"}
              placeholder="Apellidos del donante"
            />
          )}
        />
        {errors.last_name?.message && <small className="p-error">{errors.last_name.message.toString()}</small>}
      </div>

      <div className="field col-12 mb-2 mt-2">
        <label htmlFor="email" className="block mb-2 font-medium text-700">
          <i className="pi pi-envelope mr-2 text-primary" />
          Correo Electrónico
        </label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <InputText
              id={field.name}
              type="email"
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={errors.email?.message ? "p-invalid w-full" : "w-full"}
              placeholder="ejemplo@correo.com"
            />
          )}
        />
        {errors.email?.message && <small className="p-error">{errors.email.message.toString()}</small>}
      </div>
    </div>
  );
};

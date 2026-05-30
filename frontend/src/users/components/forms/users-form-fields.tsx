import { useQuery } from "@tanstack/react-query";
import { Controller, useFormContext, useFormState } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import API_BASE_URL from "@/config/api.config";

type RoleOption = {
  id: number;
  name: string;
};

type RolesResponse = {
  results?: RoleOption[];
};

async function fetchRoles(): Promise<RoleOption[]> {
  const response = await fetch(`${API_BASE_URL}/roles/?page_size=100&ordering=name`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar los roles.");
  }

  const data = (await response.json()) as RolesResponse | RoleOption[];
  return Array.isArray(data) ? data : data.results ?? [];
}

const fields = [
  {
    name: "username",
    label: "Usuario",
    icon: "pi pi-user",
    placeholder: "Ej: usuario123",
  },
  {
    name: "first_name",
    label: "Nombre",
    icon: "pi pi-id-card",
    placeholder: "Ej: Juan",
  },
  {
    name: "last_name",
    label: "Apellido",
    icon: "pi pi-id-card",
    placeholder: "Ej: Perez",
  },
  {
    name: "email",
    label: "Correo electronico",
    icon: "pi pi-envelope",
    placeholder: "Ej: usuario@ejemplo.com",
  },
];

export const UsersFormFields = () => {
  const { control, register } = useFormContext();
  const { errors } = useFormState();
  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ["roles", "user-form"],
    queryFn: fetchRoles,
  });

  return (
    <div className="grid formgrid p-fluid pt-3 row-gap-3">
      {fields.map((field) => {
        const error = errors[field.name]?.message?.toString();

        return (
          <div key={field.name} className="field col-12 md:col-6 mb-2">
            <label htmlFor={field.name} className="block mb-2 font-medium text-700">
              <i className={`${field.icon} mr-2 text-primary`} />
              {field.label}
            </label>
            <InputText
              id={field.name}
              className={error ? "p-invalid w-full" : "w-full"}
              placeholder={field.placeholder}
              {...register(field.name)}
            />
            {error && <small className="p-error">{error}</small>}
          </div>
        );
      })}

      <div className="field col-12 mb-2">
        <label htmlFor="role_ids" className="block mb-2 font-medium text-700">
          <i className="pi pi-shield mr-2 text-primary" />
          Roles
        </label>
        <Controller
          name="role_ids"
          control={control}
          render={({ field }) => (
            <MultiSelect
              inputId="role_ids"
              value={field.value ?? []}
              options={roles}
              optionLabel="name"
              optionValue="id"
              display="chip"
              filter
              placeholder="Selecciona uno o varios roles"
              emptyMessage="No hay roles disponibles"
              emptyFilterMessage="No se encontraron roles"
              loading={rolesLoading}
              className={errors.role_ids ? "p-invalid w-full" : "w-full"}
              onChange={(event) => field.onChange(event.value ?? [])}
              onBlur={field.onBlur}
            />
          )}
        />
        {errors.role_ids && <small className="p-error">{errors.role_ids.message?.toString()}</small>}
      </div>
    </div>
  );
};

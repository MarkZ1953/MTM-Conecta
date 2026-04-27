import { Controller, useFormContext, useFormState } from "react-hook-form";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const UsersFormFields = ({
  isCreated = false,
}: {
  isCreated?: boolean;
}) => {
  const { control, register, setValue, getValues } = useFormContext();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 400);
  const anchor = useComboboxAnchor();
  const { errors } = useFormState();

  const { data: roles = [] } = useQuery({
    queryKey: ["roles", debouncedSearchValue],
    queryFn: () => rolesGetAll({ name: debouncedSearchValue }),
    select: (res): Rol[] => res.data.results,
    enabled: !!debouncedSearchValue,
    staleTime: 5 * 60 * 1000,
  });

  const fields = [
    {
      name: "username",
      icon: <UserCircleIcon className="h-4 w-4 text-muted-foreground" />,
      label: "Usuario",
      error: errors.username?.message?.toString(),
      field: (
        <>
          <Input
            id="username"
            {...register("username")}
            placeholder="Ej: usuario123"
          />
        </>
      ),
    },
    {
      name: "first_name",
      icon: <UserIcon className="h-4 w-4 text-muted-foreground" />,
      label: "Nombre",
      error: errors.first_name?.message?.toString(),
      field: (
        <>
          <Input
            id="first_name"
            {...register("first_name")}
            placeholder="Ej: Juan"
          />
        </>
      ),
    },
    {
      name: "last_name",
      icon: <UserIcon className="h-4 w-4 text-muted-foreground" />,
      label: "Apellido",
      error: errors.last_name?.message?.toString(),
      field: (
        <>
          <Input
            id="last_name"
            {...register("last_name")}
            placeholder="Ej: Pérez"
          />
        </>
      ),
    },
    {
      name: "email",
      icon: <EnvelopeIcon className="h-4 w-4 text-muted-foreground" />,
      label: "Correo Electrónico",
      error: errors.email?.message?.toString(),
      field: (
        <>
          <Input
            id="email"
            {...register("email")}
            placeholder="Ej: usuario@ejemplo.com"
          />
        </>
      ),
    },
    ...(isCreated
      ? [
          {
            name: "roles",
            icon: <LockKeyIcon className="h-4 w-4 text-muted-foreground" />,
            label: "Roles",
            error: errors.roles?.message?.toString(),
            className: "col-span-1 md:col-span-2",
            field: (
              <>
                <Controller
                  name="roles"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Combobox
                      multiple
                      items={roles}
                      value={field.value ?? []}
                      onValueChange={(values) => {
                        field.onChange(values);

                        const selectedRoleIds = roles
                          .filter((role) => values.includes(role.name))
                          .map((role) => role.id);

                        const defaultRoleIds = getValues("role_ids") || [];

                        const allRoleIds = Array.from(
                          new Set([...defaultRoleIds, ...selectedRoleIds]),
                        );

                        setValue("role_ids", allRoleIds);
                      }}
                    >
                      <ComboboxChips ref={anchor}>
                        <ComboboxValue>
                          {(values) => (
                            <>
                              {values.map((value: string) => (
                                <ComboboxChip key={value}>{value}</ComboboxChip>
                              ))}

                              <ComboboxChipsInput
                                id="roles"
                                placeholder="Ej: Administrador"
                                onChange={(e) => setSearchValue(e.target.value)}
                              />
                            </>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>

                      <ComboboxContent anchor={anchor}>
                        <ComboboxEmpty className={"bg-gray-50 py-4"}>
                          <div className="flex flex-col items-center gap-2">
                            <TrayIcon
                              size={32}
                              className="text-muted-foreground"
                            />
                            <span>No se encontraron roles</span>
                          </div>
                        </ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.id} value={item.name}>
                              {item.name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  )}
                />
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
        {fields.map((field) => (
          <Field key={field.name} className={field.className}>
            <FieldLabel htmlFor={field.name} className="flex items-center">
              {field.icon}
              <span>{field.label}</span>
            </FieldLabel>

            {field.field}

            <FieldDescription className="text-red-500">
              {field.error}
            </FieldDescription>
          </Field>
        ))}
      </FieldGroup>
    </>
  );
};

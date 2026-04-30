import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { FloatLabel } from 'primereact/floatlabel'
import { MultiSelect } from 'primereact/multiselect'
import { Dropdown } from 'primereact/dropdown'

export interface UsersFormValues {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
  groups: string[]
}

interface UsersFormFieldsProps {
  values: UsersFormValues
  onChange: (field: keyof UsersFormValues, value: string | string[]) => void
  errors: Partial<Record<keyof UsersFormValues, string>>
  loading?: boolean
  /** Grupos disponibles de Django auth.Group */
  availableGroups?: { label: string; value: string }[]
  /** Roles disponibles (Administrador, Coordinador, etc.) */
  availableRoles?: { label: string; value: string }[]
  /** Si true, muestra campo de contraseña (creación). Oculto en edición. */
  showPassword?: boolean
}

const DEFAULT_ROLES = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Coordinador', value: 'coordinador' },
  { label: 'Operador', value: 'operador' },
  { label: 'Consultor', value: 'consultor' },
]

export function UsersFormFields({
  values,
  onChange,
  errors,
  loading = false,
  availableGroups = [],
  availableRoles = DEFAULT_ROLES,
  showPassword = true,
}: UsersFormFieldsProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Primer nombre */}
      <div className="flex flex-col gap-1">
        <FloatLabel>
          <InputText
            id="user-firstname"
            value={values.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className={`w-full${errors.firstName ? ' p-invalid' : ''}`}
            disabled={loading}
            autoComplete="given-name"
          />
          <label htmlFor="user-firstname">Primer nombre</label>
        </FloatLabel>
        {errors.firstName && (
          <small className="p-error">{errors.firstName}</small>
        )}
      </div>

      {/* Apellido */}
      <div className="flex flex-col gap-1">
        <FloatLabel>
          <InputText
            id="user-lastname"
            value={values.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            className={`w-full${errors.lastName ? ' p-invalid' : ''}`}
            disabled={loading}
            autoComplete="family-name"
          />
          <label htmlFor="user-lastname">Primer apellido</label>
        </FloatLabel>
        {errors.lastName && (
          <small className="p-error">{errors.lastName}</small>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <FloatLabel>
          <InputText
            id="user-email"
            type="email"
            value={values.email}
            onChange={(e) => onChange('email', e.target.value)}
            className={`w-full${errors.email ? ' p-invalid' : ''}`}
            disabled={loading}
            autoComplete="email"
          />
          <label htmlFor="user-email">Correo electrónico</label>
        </FloatLabel>
        {errors.email && (
          <small className="p-error">{errors.email}</small>
        )}
      </div>

      {/* Contraseña (solo en creación) */}
      {showPassword && (
        <div className="flex flex-col gap-1">
          <FloatLabel>
            <Password
              inputId="user-password"
              value={values.password}
              onChange={(e) => onChange('password', e.target.value)}
              className={`w-full${errors.password ? ' p-invalid' : ''}`}
              toggleMask
              disabled={loading}
              autoComplete="new-password"
              pt={{ input: { style: { width: '100%' } } }}
            />
            <label htmlFor="user-password">Contraseña</label>
          </FloatLabel>
          {errors.password && (
            <small className="p-error">{errors.password}</small>
          )}
        </div>
      )}

      {/* Rol */}
      <div className="flex flex-col gap-1">
        <FloatLabel>
          <Dropdown
            inputId="user-role"
            value={values.role}
            options={availableRoles}
            onChange={(e) => onChange('role', e.value as string)}
            className={`w-full${errors.role ? ' p-invalid' : ''}`}
            disabled={loading}
            placeholder="Selecciona un rol"
          />
          <label htmlFor="user-role">Rol en la fundación</label>
        </FloatLabel>
        {errors.role && (
          <small className="p-error">{errors.role}</small>
        )}
      </div>

      {/* Grupos (Django auth.Group) — permisos granulares */}
      {availableGroups.length > 0 && (
        <div className="flex flex-col gap-1">
          <FloatLabel>
            <MultiSelect
              inputId="user-groups"
              value={values.groups}
              options={availableGroups}
              onChange={(e) => onChange('groups', e.value as string[])}
              className={`w-full${errors.groups ? ' p-invalid' : ''}`}
              disabled={loading}
              display="chip"
              placeholder="Grupos de permisos"
            />
            <label htmlFor="user-groups">Grupos de acceso</label>
          </FloatLabel>
          {errors.groups && (
            <small className="p-error">{errors.groups}</small>
          )}
        </div>
      )}
    </div>
  )
}

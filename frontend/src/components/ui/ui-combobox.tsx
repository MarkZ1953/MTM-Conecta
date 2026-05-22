import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";

import {
  MultiSelect,
  type MultiSelectChangeEvent,
} from "primereact/multiselect";

export type ComboboxOption = {
  id: number | string;
  name: string;
};

// ─── Multiple con chips ───────────────────────────────────────────────────────

type ComboboxObjectMultipleProps = {
  items: ComboboxOption[];
  value: ComboboxOption[];
  onValueChange: (value: ComboboxOption[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  onSearch?: (search: string) => void;
  className?: string;
  loading?: boolean;
  appendTo?: any;
  onHide?: () => void;
};

export function ComboboxObjectMultiple({
  items,
  value,
  onValueChange,
  placeholder = "Seleccionar...",
  emptyMessage = "No se encontraron resultados",
  disabled = false,
  onSearch,
  className,
  loading,
  appendTo = "self",
  onHide,
}: ComboboxObjectMultipleProps) {
  const handleChange = (e: MultiSelectChangeEvent) => {
    onValueChange(e.value ?? []);
  };

  return (
    <MultiSelect
      value={value}
      options={items}
      onChange={handleChange}
      optionLabel="name"
      dataKey="id"
      display="chip"
      placeholder={placeholder}
      emptyMessage={emptyMessage}
      emptyFilterMessage={emptyMessage}
      disabled={disabled}
      filter
      onFilter={(e) => onSearch?.(e.filter)}
      className={className}
      style={{ width: "100%" }}
      loading={loading}
      appendTo={appendTo}
      onHide={onHide}
    />
  );
}

// ─── Single ───────────────────────────────────────────────────────────────────

type ComboboxObjectProps = {
  items: ComboboxOption[];
  value: ComboboxOption | null;
  onValueChange: (value: ComboboxOption | null) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  onSearch?: (search: string) => void;
  className?: string;
  loading?: boolean;
  appendTo?: any;
  onHide?: () => void;
};

export function ComboboxObject({
  items,
  value,
  onValueChange,
  placeholder = "Seleccionar...",
  emptyMessage = "No se encontraron resultados",
  disabled = false,
  onSearch,
  className,
  loading,
  appendTo = "self",
  onHide,
}: ComboboxObjectProps) {
  const handleChange = (e: DropdownChangeEvent) => {
    onValueChange(e.value ?? null);
  };

  return (
    <Dropdown
      value={value}
      options={items}
      onChange={handleChange}
      optionLabel="name"
      dataKey="id"
      placeholder={placeholder}
      emptyMessage={emptyMessage}
      emptyFilterMessage={emptyMessage}
      disabled={disabled}
      filter
      showClear
      onFilter={(e) => onSearch?.(e.filter)}
      className={className}
      style={{ width: "100%" }}
      loading={loading}
      appendTo={appendTo}
      onHide={onHide}
    />
  );
}

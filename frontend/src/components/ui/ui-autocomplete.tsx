import React, { useState, forwardRef } from "react";

import {
  AutoComplete,
  type AutoCompleteCompleteEvent,
  type AutoCompleteProps,
} from "primereact/autocomplete";

export interface UIAutocompleteProps extends Omit<
  AutoCompleteProps,
  "suggestions" | "completeMethod"
> {
  /** Label for the component */
  label?: string;
  /** Error message to display, also sets input to invalid */
  error?: string;
  /** Help/description text below the input */
  helpText?: string;
  /** Optional array of suggestions/options to search through locally */
  options?: any[];
  /** Key of option to display as label (defaults to "label" or "name") */
  optionLabel?: string;
  /** Custom filter function for local suggestions */
  filterFunc?: (query: string, option: any) => boolean;
  /** Full control of suggestions (overrides local suggestions) */
  suggestions?: any[];
  /** Full control of search/completeMethod (overrides local search method) */
  completeMethod?: (e: AutoCompleteCompleteEvent) => void;
  /** Container class */
  containerClassName?: string;
  /** Container style */
  containerStyle?: React.CSSProperties;
}

export const UIAutocomplete = forwardRef<AutoComplete, UIAutocompleteProps>(
  (
    {
      label,
      error,
      helpText,
      options,
      optionLabel,
      filterFunc,
      suggestions,
      completeMethod,
      containerClassName,
      containerStyle,
      ...props
    },
    ref,
  ) => {
    const [localSuggestions, setLocalSuggestions] = useState<any[]>([]);

    const handleSearch = (event: AutoCompleteCompleteEvent) => {
      if (completeMethod) {
        completeMethod(event);
        return;
      }

      if (!options) {
        return;
      }

      const query = event.query.toLowerCase().trim();

      if (!query) {
        setLocalSuggestions([...options]);
        return;
      }

      const labelKey = optionLabel || props.field || "label";

      const filtered = options.filter((opt) => {
        if (filterFunc) {
          return filterFunc(query, opt);
        }

        if (typeof opt === "string") {
          return opt.toLowerCase().includes(query);
        }

        if (typeof opt === "object" && opt !== null) {
          const val = opt[labelKey];
          if (typeof val === "string") {
            return val.toLowerCase().includes(query);
          }
        }
        return false;
      });

      setLocalSuggestions(filtered);
    };

    return (
      <div
        className={`flex flex-column gap-2 ${containerClassName ?? ""}`}
        style={containerStyle}
      >
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-semibold"
            style={{ color: "var(--mtm-dark)", opacity: 0.85 }}
          >
            {label}
          </label>
        )}
        <AutoComplete
          ref={ref}
          suggestions={completeMethod ? suggestions : localSuggestions}
          completeMethod={handleSearch}
          invalid={!!error || props.invalid}
          field={optionLabel || props.field}
          {...props}
        />
        {error && (
          <small
            className="p-error text-xs flex align-items-center gap-1"
            style={{ color: "var(--mtm-rose)" }}
          >
            <i
              className="pi pi-exclamation-triangle"
              style={{ fontSize: "0.75rem" }}
            />
            {error}
          </small>
        )}
        {!error && helpText && (
          <small
            className="text-xs text-color-secondary"
            style={{ opacity: 0.75 }}
          >
            {helpText}
          </small>
        )}
      </div>
    );
  },
);

export const UIAutoComplete = UIAutocomplete;

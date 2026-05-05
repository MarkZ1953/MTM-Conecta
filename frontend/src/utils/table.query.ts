import {
  type DataTableFilterMeta,
  type SortingState,
} from "@/components/ui/ui-datatable";

// Mapeo de FilterMatchMode de PrimeReact → lookup de Django ORM
const MATCH_MODE_TO_DJANGO: Record<string, string> = {
  contains:    "icontains",
  notContains: "not_icontains", // backend will negate this
  startsWith:  "istartswith",
  endsWith:    "iendswith",
  equals:      "exact",
  notEquals:   "not_exact",     // backend will negate this
  lt:          "lt",
  lte:         "lte",
  gt:          "gt",
  gte:         "gte",
  dateIs:      "date",
  dateIsNot:   "not_date",
  dateBefore:  "date__lt",
  dateAfter:   "date__gt",
  in:          "in",
  between:     "range",
};

type BuildQueryParamsProps = {
  pageIndex: number;
  pageSize: number;
  sorting: SortingState;
  columnFilters: DataTableFilterMeta;
};

export const buildQueryParams = ({
  pageIndex,
  pageSize,
  sorting,
  columnFilters,
}: BuildQueryParamsProps) => {
  const params: Record<string, any> = {
    page: pageIndex + 1,
    page_size: pageSize,
  };

  // Ordenamiento
  if (sorting && sorting.length > 0) {
    const { id, desc } = sorting[0];
    params.ordering = desc ? `-${id}` : id;
  }

  // Si no hay filtros, retornamos solo la paginación y el orden
  if (!columnFilters) return params;

  // Procesar los filtros avanzados
  Object.entries(columnFilters).forEach(([field, filterMeta]: [string, any]) => {
    // 1. Filtro global (search param normal de Django)
    if (field === "global") {
      if (filterMeta && filterMeta.value) {
        params["search"] = filterMeta.value;
      }
      return;
    }

    // Array de restricciones a procesar
    let constraints: any[] = [];
    
    // Si tiene constraints multiples (operator AND / OR)
    if (filterMeta && Array.isArray(filterMeta.constraints)) {
      // Nota: Django via URL por defecto procesa múltiples parámetros del mismo campo como un AND 
      // (a menos que el backend se personalice para aceptar un JSON). 
      // Si el operador es OR, y se requiere en el backend, deberás pasarlo como JSON o un parámetro especial.
      // Por ahora pasaremos las restricciones múltiples serializadas como un JSON string si el backend lo requiere,
      // o mapearemos cada constraint si es simple.
      
      // Si el backend nativo no soporta listas de diccionarios en GET, 
      // es mejor pasar el filtro complejo como un JSON en un query param
      // params[`${field}__complex`] = JSON.stringify({ operator: filterMeta.operator, constraints: filterMeta.constraints });
      
      // Pero por defecto, vamos a intentar mapear las constraints directamente a sufijos
      constraints = filterMeta.constraints;
    } else if (filterMeta && filterMeta.value !== null) {
      // Filtro simple
      constraints = [filterMeta];
    }

    // Iteramos cada restricción para este campo
    constraints.forEach((constraint, index) => {
      const val = constraint.value;
      if (val === null || val === undefined || val === "") return;

      const matchMode = constraint.matchMode ?? "contains";
      let djangoSuffix = MATCH_MODE_TO_DJANGO[matchMode] || "exact";

      // Si es un operador OR y hay múltiples constraints, 
      // en un query param normal de Django sobreescribirá el anterior.
      // Aquí agregamos un sub-índice a la llave para que no se sobreescriba en el objeto params,
      // ej: params["name__icontains__0"] = ... (OJO: Tu backend debe saber procesarlo).
      // Si tu backend usa djangorestframework, lo estándar es solo un parámetro.
      let paramKey = `${field}__${djangoSuffix}`;
      
      // Manejo de casos especiales:
      if (matchMode === "between" && Array.isArray(val)) {
        params[`${field}__gte`] = val[0];
        params[`${field}__lte`] = val[1];
        return;
      }
      if (matchMode === "in" && Array.isArray(val)) {
        params[`${field}__in`] = val.join(",");
        return;
      }
      if (matchMode === "dateIs") {
        const d = val instanceof Date ? val : new Date(val);
        params[`${field}__date`] = d.toISOString().split("T")[0];
        return;
      }
      if (matchMode === "dateIsNot") {
        const d = val instanceof Date ? val : new Date(val);
        params[`${field}__not_date`] = d.toISOString().split("T")[0];
        return;
      }
      if (matchMode === "dateBefore") {
        const d = val instanceof Date ? val : new Date(val);
        params[`${field}__date__lt`] = d.toISOString().split("T")[0];
        return;
      }
      if (matchMode === "dateAfter") {
        const d = val instanceof Date ? val : new Date(val);
        params[`${field}__date__gt`] = d.toISOString().split("T")[0];
        return;
      }

      // Evitamos sobreescribir si hay múltiples reglas (AND/OR) en la misma columna
      // Pasamos un identificador o usamos MultiValueDict notation si se requiere.
      if (params[paramKey]) {
        if (!Array.isArray(params[paramKey])) {
          params[paramKey] = [params[paramKey]];
        }
        params[paramKey].push(val);
      } else {
        params[paramKey] = val;
      }
    });
  });

  return params;
};

import API_BASE_URL from "@/config/api.config";

export interface APIHooks {
  onSuccess?: (methodName: string, result: any) => void;
  onError?: (methodName: string, error: unknown) => void;
  afterBulkSoftDelete?: (result: any) => void;
  afterSoftDelete?: (result: any) => void;
  afterCreate?: (result: any) => void;
  afterUpdate?: (result: any) => void;
}

export class ResourceAPI<T = any> {
  public hooks: APIHooks = {};
  private baseUrl: string;
  private resource: string;

  constructor({ resource }: { resource: string }) {
    this.baseUrl = API_BASE_URL;
    this.resource = resource;
  }

  configure(hooks: APIHooks) {
    const prev = this.hooks;

    this.hooks = {
      ...hooks,
      onSuccess: (method, result) => {
        prev.onSuccess?.(method, result);
        hooks.onSuccess?.(method, result);
      },
      onError: (method, error) => {
        prev.onError?.(method, error);
        hooks.onError?.(method, error);
      },
      afterCreate: (result) => {
        prev.afterCreate?.(result);
        hooks.afterCreate?.(result);
      },
      afterUpdate: (result) => {
        prev.afterUpdate?.(result);
        hooks.afterUpdate?.(result);
      },
      afterSoftDelete: (result) => {
        prev.afterSoftDelete?.(result);
        hooks.afterSoftDelete?.(result);
      },
      afterBulkSoftDelete: (result) => {
        prev.afterBulkSoftDelete?.(result);
        hooks.afterBulkSoftDelete?.(result);
      },
    };

    return this;
  }

  clearHooks() {
    this.hooks = {};
  }

  /**
   * Retrieves all resources with optional pagination and filtering parameters.
   *
   * @param {Object} options - The options object.
   * @param {Object} options.params - Query parameters for the request.
   * @param {number} [options.params.page] - The page number for pagination.
   * @param {number} [options.params.page_size] - The number of items per page.
   * @param {string} [options.params.ordering] - The field to order results by.
   * @param {any} [options.params.[key: string]] - Additional custom query parameters.
   *
   * @returns {Promise<{status: number, data: {count: number, next: string | null, previous: string | null, results: T[]}}>}
   * A promise that resolves to an object containing the HTTP status code and the response data with pagination info and results.
   *
   * @throws {Error} Throws an error if the fetch request fails.
   */
  async getAll({
    params,
  }: {
    params: {
      page?: number;
      page_size?: number;
      ordering?: string;
      [key: string]: any;
    };
  }): Promise<{
    status: number;
    data: {
      count: number;
      next: string | null;
      previous: string | null;
      results: T[];
    };
  }> {
    try {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(
        `${this.baseUrl}/${this.resource}/?${searchParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return { status: response.status, data: await response.json() };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new resource with the provided data.
   * @template T - The type of the resource being created
   * @param {Partial<T>} data - The partial data object for the resource to create
   * @returns {Promise<{ status: number; data: T }>} A promise that resolves to an object containing the HTTP status code and the created resource data
   * @throws {Error} Throws an error if the request fails
   */
  async create({
    data,
  }: {
    data: Partial<T>;
  }): Promise<{ status: number; data: T }> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.resource}/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = { status: response.status, data: await response.json() };
      this.hooks.afterCreate?.(result);
      this.hooks.onSuccess?.("create", result);

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates a resource with the specified ID.
   *
   * @template T - The type of the resource data.
   * @param {Object} params - The update parameters.
   * @param {number} params.id - The ID of the resource to update.
   * @param {Partial<T>} params.data - The partial data to update the resource with.
   * @returns {Promise<{ status: number; data: T }>} A promise that resolves to an object containing the HTTP status code and the updated resource data.
   * @throws {Error} Throws an error if the fetch request fails.
   */
  async update({
    id,
    data,
  }: {
    id: number;
    data: Partial<T>;
  }): Promise<{ status: number; data: T }> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.resource}/${id}/`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = { status: response.status, data: await response.json() };
      this.hooks.afterUpdate?.(result);
      this.hooks.onSuccess?.("update", result);

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Soft deletes a resource by ID.
   *
   * Sends a POST request to the soft-delete endpoint to mark a resource as deleted
   * without permanently removing it from the database.
   *
   * @param {Object} params - The parameters object.
   * @param {number} params.id - The ID of the resource to soft delete.
   *
   * @returns {Promise<{ status: number; data: T }>} A promise that resolves to an object containing:
   *   - `status`: The HTTP response status code.
   *   - `data`: The response body parsed as JSON, typed as T.
   *
   * @throws {Error} Throws an error if the fetch request fails.
   */
  async softDelete({
    id,
  }: {
    id: number;
  }): Promise<{ status: number; data: T }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.resource}/${id}/soft-delete/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = { status: response.status, data: await response.json() };
      this.hooks.afterSoftDelete?.(result);
      this.hooks.onSuccess?.("softDelete", result);

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Performs a bulk soft delete operation on multiple resources.
   * @param {Object} params - The parameters object
   * @param {number[]} params.ids - Array of resource IDs to soft delete
   * @returns {Promise<{ status: number; data: T }>} Promise resolving to an object containing the HTTP status code and response data
   * @throws {Error} Throws an error if the request fails
   */
  async bulkSoftDelete({
    ids,
  }: {
    ids: number[];
  }): Promise<{ status: number; data: T }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.resource}/bulk-soft-delete/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids }),
        },
      );

      const result = { status: response.status, data: await response.json() };
      this.hooks.afterBulkSoftDelete?.(result);
      this.hooks.onSuccess?.("bulkSoftDelete", result);

      return result;
    } catch (error) {
      throw error;
    }
  }

  async exportExcel({
    mode,
    ids,
    format,
  }: {
    mode: string;
    ids: number[];
    format: "csv" | "xlsx";
  }) {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.resource}/export-excel/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mode, ids, format }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to export ${this.resource} as ${format}`);
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "";

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      try {
        link.href = url;
        link.download = `${filename}` || `${this.resource}.${format}`;
        document.body.appendChild(link);
        link.click();
      } finally {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }

      return { status: response.status, data: blob };
    } catch (error) {
      throw error;
    }
  }
}

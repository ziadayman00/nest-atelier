import { api, buildQuery } from "./client";
import { getToken } from "../auth/token";
import type { DesignRequest, DesignRequestListResponse } from "../types/design-request";

export const designApi = {
  create: (formData: FormData) =>
    api<{ designRequest: DesignRequest }>(
      "/design-requests",
      { method: "POST", body: formData },
      getToken(),
    ),

  listMine: () =>
    api<{ designRequests: DesignRequest[] }>("/design-requests/me", {}, getToken()),

  listAll: (query: { page?: number; limit?: number; status?: string } = {}) =>
    api<DesignRequestListResponse>(`/design-requests${buildQuery(query)}`, {}, getToken()),

  updateStatus: (id: string, status: string) =>
    api<{ designRequest: DesignRequest }>(
      `/design-requests/${id}/status`,
      { method: "PATCH", body: JSON.stringify({ status }) },
      getToken(),
    ),

  addNote: (id: string, body: string) =>
    api<{ note: { id: string; body: string } }>(
      `/design-requests/${id}/notes`,
      { method: "POST", body: JSON.stringify({ body }) },
      getToken(),
    ),
};

import { api, publicFetch } from "./client";
import { getToken } from "../auth/token";
import type { DeliveryZone, DeliveryZonePayload, DeliveryZoneListResponse } from "../types/delivery-zone";

export const deliveryZoneApi = {
  listPublic: () =>
    publicFetch<DeliveryZoneListResponse>("/delivery-zones"),

  listAdmin: () =>
    api<DeliveryZoneListResponse>("/admin/delivery-zones", {}, getToken()),

  create: (data: DeliveryZonePayload) =>
    api<{ deliveryZone: DeliveryZone }>("/admin/delivery-zones", { method: "POST", body: JSON.stringify(data) }, getToken()),

  update: (id: string, data: Partial<DeliveryZonePayload>) =>
    api<{ deliveryZone: DeliveryZone }>(`/admin/delivery-zones/${id}`, { method: "PATCH", body: JSON.stringify(data) }, getToken()),

  delete: (id: string) =>
    api<void>(`/admin/delivery-zones/${id}`, { method: "DELETE" }, getToken()),
};

export interface DeliveryZone {
  id: string;
  name: string;
  cities: string[];
  shippingFee: number;
  estimatedDeliveryMinDays: number;
  estimatedDeliveryMaxDays: number;
  isActive?: boolean;
}

export interface DeliveryZonePayload {
  name: string;
  cities: string[];
  shippingFee: number;
  estimatedDeliveryMinDays: number;
  estimatedDeliveryMaxDays: number;
  isActive?: boolean;
}

export interface DeliveryZoneListResponse {
  deliveryZones: DeliveryZone[];
}

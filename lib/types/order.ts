export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string | null;
  variantId?: string | null;
  productName: string;
  variantName?: string | null;
  sku?: string | null;
  unitPrice: string | number;
  quantity: number;
  lineTotal: string | number;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: "cash_on_delivery";
  paymentStatus: string;
  subtotal: number;
  discountAmount?: number;
  shippingFee: number;
  totalAmount: number;
  couponCode?: string | null;
  deliveryZoneName?: string | null;
  estimatedDeliveryMinDays?: number | null;
  estimatedDeliveryMaxDays?: number | null;
  shippingAddress: ShippingAddress;
  items?: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CheckoutPayload {
  shippingAddress: ShippingAddress;
  couponCode?: string;
}

export interface OrderListResponse {
  orders: Order[];
  pagination: import("./api").Pagination;
}

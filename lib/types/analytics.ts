export interface AnalyticsOverview {
  summary: {
    deliveredRevenue: number;
    deliveredOrderCount: number;
    averageOrderValue: number;
    newCustomerCount: number;
  };
  ordersByStatus: Record<string, number>;
  topProducts: Array<{
    id: string;
    name: string;
    slug: string;
    totalQuantitySold: number;
    totalRevenue: number;
  }>;
  couponImpact: {
    totalDiscountGiven: number;
    ordersWithCouponsCount: number;
  };
  revenueByDay: Array<{
    date: string;
    revenue: number;
    orderCount: number;
  }>;
}

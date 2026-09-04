"use client";

import { Suspense } from "react";
import OrderDetailContent from "./order-detail-content";
import { Spinner } from "@/components/ui/spinner";

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<Spinner className="h-8 w-8" />}>
      <OrderDetailContent />
    </Suspense>
  );
}

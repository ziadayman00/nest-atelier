"use client";

import { Suspense } from "react";
import AdminOrdersContent from "./orders-content";
import { Spinner } from "@/components/ui/spinner";

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<Spinner className="h-8 w-8" />}>
      <AdminOrdersContent />
    </Suspense>
  );
}

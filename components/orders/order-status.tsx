import type { OrderStatus } from "@/lib/types/order";
import { Badge } from "@/components/ui/badge";

const statusVariant: Record<OrderStatus, "default" | "success" | "warning" | "muted"> = {
  pending: "warning",
  confirmed: "default",
  preparing: "default",
  out_for_delivery: "default",
  delivered: "success",
  cancelled: "muted",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={statusVariant[status]}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

const steps: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return <p className="text-sm font-medium text-red-600 bg-red-50 rounded-2xl p-4 border border-red-200">This order was cancelled.</p>;
  }

  const currentIndex = steps.indexOf(status);

  return (
    <ol className="space-y-4">
      {steps.map((step, i) => {
        const isCompleted = i <= currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <li key={step} className="flex items-center gap-4 text-sm font-medium">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-mono transition-colors ${
                isCompleted
                  ? "bg-nest-sage text-white shadow-xs"
                  : "bg-nest-sand text-nest-warm-gray"
              }`}
            >
              {i + 1}
            </span>
            <div className="flex flex-col">
              <span className={`capitalize tracking-wide ${isCompleted ? "text-nest-charcoal font-semibold" : "text-nest-warm-gray"}`}>
                {step.replace(/_/g, " ")}
              </span>
              {isCurrent && (
                <span className="text-[10px] text-nest-sage font-medium uppercase tracking-widest">
                  Current Status
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

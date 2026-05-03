import { Badge } from "@/shared/ui/badge";
import { ORDER_STATUS_LABELS } from "@/entities/order/model/constants";
import type { OrderStatus } from "@/entities/order/model/types";
import { cn } from "@/shared/lib/cn";

const statusClassName: Record<OrderStatus, string> = {
  pending: "bg-slate-100 text-slate-700",
  in_transit: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

type StatusBadgeProps = {
  status: OrderStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge className={cn(statusClassName[status], className)}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}

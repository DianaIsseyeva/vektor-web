import { ChevronDown } from "lucide-react";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  StatusBadge,
  canChangeOrderStatus,
  type OrderStatus,
} from "@/entities/order";
import { useChangeOrderStatus } from "@/features/change-order-status/model/use-change-order-status";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

type ChangeStatusDropdownProps = {
  orderId: string;
  status: OrderStatus;
};

export function ChangeStatusDropdown({ orderId, status }: ChangeStatusDropdownProps) {
  const changeStatus = useChangeOrderStatus();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
        <StatusBadge status={status} />
        <ChevronDown className="size-3 text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {ORDER_STATUSES.map((nextStatus) => (
          <DropdownMenuItem
            key={nextStatus}
            disabled={!canChangeOrderStatus(status, nextStatus) || changeStatus.isPending}
            onClick={() => {
              changeStatus.mutate({ orderId, currentStatus: status, nextStatus });
            }}
          >
            <StatusBadge status={nextStatus} />
            <span>{ORDER_STATUS_LABELS[nextStatus]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Search } from "lucide-react";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUSES,
  type OrdersFilters,
} from "@/entities/order";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

type OrdersFiltersProps = {
  filters: OrdersFilters;
  onChange: (filters: OrdersFilters) => void;
};

export function OrdersFilters({ filters, onChange }: OrdersFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
          placeholder="Search..."
          className="pl-9"
        />
      </div>
      <Select
        value={filters.status}
        onValueChange={(status) =>
          onChange({ ...filters, status: status as OrdersFilters["status"] })
        }
      >
        <SelectTrigger className="md:w-48">
          <SelectValue placeholder="All Orders" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Orders</SelectItem>
          {ORDER_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {ORDER_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

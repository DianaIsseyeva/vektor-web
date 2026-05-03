import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUSES,
  type OrderStatus,
  type OrdersFilters,
} from "@/entities/order";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";

type OrdersFiltersProps = {
  filters: OrdersFilters;
  onChange: (filters: OrdersFilters) => void;
};

export function OrdersFilters({ filters, onChange }: OrdersFiltersProps) {
  const [search, setSearch] = useState(filters.search);

  useEffect(() => {
    setSearch(filters.search);
  }, [filters.search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (search !== filters.search) {
        onChange({ ...filters, search });
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [filters, onChange, search]);

  const statusLabel = useMemo(() => {
    if (filters.statuses.length === 0) {
      return "All Statuses";
    }

    return filters.statuses
      .map((status) => ORDER_STATUS_LABELS[status])
      .join(", ");
  }, [filters.statuses]);

  const toggleStatus = (status: OrderStatus) => {
    const statuses = filters.statuses.includes(status)
      ? filters.statuses.filter((item) => item !== status)
      : [...filters.statuses, status];

    onChange({ ...filters, statuses });
  };

  const clearFilters = () => {
    setSearch("");
    onChange({ search: "", statuses: [] });
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search..."
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="min-w-44 justify-between"
            >
              <span className="truncate">{statusLabel}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {ORDER_STATUSES.map((status) => (
              <DropdownMenuItem
                key={status}
                onSelect={(event) => {
                  event.preventDefault();
                  toggleStatus(status);
                }}
              >
                <span className="flex size-4 items-center justify-center rounded border border-slate-300 text-xs">
                  {filters.statuses.includes(status) ? "✓" : ""}
                </span>
                {ORDER_STATUS_LABELS[status]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button type="button" variant="ghost" onClick={clearFilters}>
          <X className="size-4" />
          Clear filters
        </Button>
      </div>
    </div>
  );
}

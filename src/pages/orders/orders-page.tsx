import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LocalDraftsList } from "@/features/manage-drafts";
import {
  orderApi,
  type OrderSortBy,
  type OrdersFilters as OrdersFiltersState,
  type SortOrder,
} from "@/entities/order";
import {
  OrdersFilters as OrdersFiltersWidget,
  OrdersTable,
} from "@/widgets/orders-table";

export function OrdersPage() {
  const [filters, setFilters] = useState<OrdersFiltersState>({
    search: "",
    status: "all",
  });
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<OrderSortBy>("pickupDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const pageSize = 10;

  const ordersQuery = useQuery({
    queryKey: ["orders", filters, page, pageSize, sortBy, sortOrder],
    queryFn: () =>
      orderApi.getOrders({ ...filters, page, pageSize, sortBy, sortOrder }),
  });
  const total = ordersQuery.data?.total ?? 0;
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  useEffect(() => {
    if (!ordersQuery.isLoading && page > totalPages) {
      setPage(totalPages);
    }
  }, [ordersQuery.isLoading, page, totalPages]);

  return (
    <div className="space-y-6">
      <LocalDraftsList />
      <OrdersFiltersWidget
        filters={filters}
        onChange={(nextFilters) => {
          setFilters(nextFilters);
          setPage(1);
        }}
      />
      <OrdersTable
        orders={ordersQuery.data?.data ?? []}
        total={total}
        isLoading={ordersQuery.isLoading}
        error={ordersQuery.error}
        page={page}
        pageSize={pageSize}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onPageChange={(nextPage) => {
          setPage(Math.min(Math.max(nextPage, 1), totalPages));
        }}
        onRetry={() => void ordersQuery.refetch()}
        onSortChange={(nextSortBy) => {
          if (nextSortBy === sortBy) {
            setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
          } else {
            setSortBy(nextSortBy);
            setSortOrder("asc");
          }
        }}
      />
    </div>
  );
}

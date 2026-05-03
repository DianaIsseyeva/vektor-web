import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LocalDraftsList, useDraftStore } from "@/features/manage-drafts";
import {
  type Order,
  orderApi,
  type OrderDraftInput,
  type OrderSortBy,
  type OrdersFilters as OrdersFiltersState,
  type SortOrder,
} from "@/entities/order";
import {
  OrdersFilters as OrdersFiltersWidget,
  OrdersTable,
} from "@/widgets/orders-table";
import { DraftWorkspace } from "@/widgets/order-form";

export function OrdersPage() {
  const [filters, setFilters] = useState<OrdersFiltersState>({
    search: "",
    statuses: [],
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<OrderSortBy>("pickupDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isDraftWorkspaceOpen, setIsDraftWorkspaceOpen] = useState(false);
  const [initialDraftId, setInitialDraftId] = useState<string | null>(null);
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
      <LocalDraftsList
        onResume={(draftId) => {
          setInitialDraftId(draftId);
          setIsDraftWorkspaceOpen(true);
        }}
      />
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
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize);
          setPage(1);
        }}
        onCreateOrder={() => {
          setInitialDraftId(null);
          setIsDraftWorkspaceOpen(true);
        }}
        onDuplicateOrder={(order) => {
          const draft = useDraftStore
            .getState()
            .createDraft(orderToDraftInput(order));
          setInitialDraftId(draft.id);
          setIsDraftWorkspaceOpen(true);
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
      <DraftWorkspace
        open={isDraftWorkspaceOpen}
        initialDraftId={initialDraftId}
        onOpenChange={setIsDraftWorkspaceOpen}
        onCreated={() => void ordersQuery.refetch()}
      />
    </div>
  );
}

function orderToDraftInput(order: Order): OrderDraftInput {
  return {
    referenceNumber: `${order.referenceNumber}-COPY`,
    clientName: order.clientName,
    carrierId: order.carrier.id,
    equipmentType: order.equipmentType,
    loadType: order.loadType,
    rate: order.rate,
    weight: order.weight,
    notes: order.notes,
    stops: order.stops.map((stop) => ({ ...stop, id: crypto.randomUUID() })),
  };
}

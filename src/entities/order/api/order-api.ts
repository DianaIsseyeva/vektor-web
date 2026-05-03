import { carriers, orders, setOrders } from "@/shared/api/mock-db";
import { mockRequest } from "@/shared/api/mock-client";
import type { Order, OrderDraftInput, OrdersFilters, OrderStatus } from "@/entities/order/model/types";

function matchesFilters(order: Order, filters: OrdersFilters) {
  const normalizedSearch = filters.search.trim().toLowerCase();
  const matchesStatus = filters.status === "all" || order.status === filters.status;
  const matchesSearch =
    normalizedSearch.length === 0 ||
    order.referenceNumber.toLowerCase().includes(normalizedSearch) ||
    order.clientName.toLowerCase().includes(normalizedSearch) ||
    order.carrierName.toLowerCase().includes(normalizedSearch);

  return matchesStatus && matchesSearch;
}

function buildOrder(input: OrderDraftInput): Order {
  const carrier = carriers.find((item) => item.id === input.carrierId);
  const now = new Date().toISOString();

  return {
    ...input,
    id: `ord-${crypto.randomUUID()}`,
    status: "pending",
    carrierName: carrier?.name ?? "Unknown Carrier",
    createdAt: now,
    updatedAt: now,
  };
}

export const orderApi = {
  list: async (filters: OrdersFilters) =>
    mockRequest(() => orders.filter((order) => matchesFilters(order, filters))),

  getById: async (orderId: string) =>
    mockRequest(() => orders.find((order) => order.id === orderId) ?? null),

  create: async (input: OrderDraftInput) =>
    mockRequest(() => {
      const order = buildOrder(input);
      setOrders([order, ...orders]);
      return order;
    }),

  update: async (orderId: string, input: OrderDraftInput) =>
    mockRequest(() => {
      const carrier = carriers.find((item) => item.id === input.carrierId);
      const nextOrders = orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              ...input,
              carrierName: carrier?.name ?? order.carrierName,
              updatedAt: new Date().toISOString(),
            }
          : order,
      );
      setOrders(nextOrders);
      return nextOrders.find((order) => order.id === orderId) ?? null;
    }),

  delete: async (orderId: string) =>
    mockRequest(() => {
      setOrders(orders.filter((order) => order.id !== orderId));
    }),

  changeStatus: async (orderId: string, status: OrderStatus) =>
    mockRequest(() => {
      const nextOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order,
      );
      setOrders(nextOrders);
      return nextOrders.find((order) => order.id === orderId) ?? null;
    }),
};

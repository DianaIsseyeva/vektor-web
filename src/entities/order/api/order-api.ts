import { carriers, createSeedOrders } from "@/shared/api/mock-db";
import { mockRequest } from "@/shared/api/mock-client";
import {
  canChangeOrderStatus,
  getAllowedOrderStatusTransitions,
} from "@/entities/order/model/status-machine";
import { orderFormSchema } from "@/entities/order/model/schema";
import type {
  Order,
  OrderDraftInput,
  OrdersQuery,
  OrdersResponse,
  OrderStatus,
} from "@/entities/order/model/types";

const ORDERS_STORAGE_KEY = "vektor:orders:v2";

function readOrders() {
  const rawValue = window.localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!rawValue) {
    const seed = createSeedOrders();
    writeOrders(seed);
    return seed;
  }

  return JSON.parse(rawValue) as Order[];
}

function writeOrders(orders: Order[]) {
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

function getPickupTime(order: Order) {
  return new Date(order.stops[0]?.appointmentDate ?? order.createdAt).getTime();
}

function sortOrders(orders: Order[], query: OrdersQuery) {
  const direction = query.sortOrder === "asc" ? 1 : -1;

  return [...orders].sort((left, right) => {
    const result = compareOrders(left, right, query.sortBy);
    return result * direction;
  });
}

function compareOrders(
  left: Order,
  right: Order,
  sortBy: OrdersQuery["sortBy"],
) {
  if (sortBy === "pickupDate") {
    return getPickupTime(left) - getPickupTime(right);
  }
  if (sortBy === "rate") {
    return left.rate - right.rate;
  }
  if (sortBy === "status") {
    return left.status.localeCompare(right.status);
  }
  return left.referenceNumber.localeCompare(right.referenceNumber);
}

function filterOrders(orders: Order[], query: OrdersQuery) {
  const search = query.search.trim().toLowerCase();

  return orders.filter((order) => {
    const matchesStatus =
      query.statuses.length === 0 || query.statuses.includes(order.status);
    const matchesSearch =
      search.length === 0 ||
      order.referenceNumber.toLowerCase().includes(search) ||
      order.clientName.toLowerCase().includes(search) ||
      order.carrier.name.toLowerCase().includes(search);

    return matchesStatus && matchesSearch;
  });
}

function toOrder(input: OrderDraftInput): Order {
  const carrier =
    carriers.find((item) => item.id === input.carrierId) ?? carriers[0];
  const now = new Date().toISOString();

  return {
    id: `ord-${crypto.randomUUID()}`,
    referenceNumber: input.referenceNumber,
    status: "pending",
    clientName: input.clientName,
    carrier,
    equipmentType: input.equipmentType,
    loadType: input.loadType,
    rate: input.rate,
    weight: input.weight,
    notes: input.notes,
    stops: input.stops.map((stop, index) => ({ ...stop, order: index + 1 })),
    statusHistory: [{ from: null, to: "pending", changedAt: now }],
    createdAt: now,
    updatedAt: now,
  };
}

export const orderApi = {
  getOrders: async (query: OrdersQuery): Promise<OrdersResponse> =>
    mockRequest(() => {
      const filtered = filterOrders(readOrders(), query);
      const sorted = sortOrders(filtered, query);
      const start = (query.page - 1) * query.pageSize;

      return {
        data: sorted.slice(start, start + query.pageSize),
        total: sorted.length,
      };
    }),

  getOrder: async (id: string): Promise<Order> =>
    mockRequest(() => {
      const order = readOrders().find((item) => item.id === id);
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    }),

  createOrder: async (input: OrderDraftInput): Promise<Order> =>
    mockRequest(() => {
      const validatedInput = orderFormSchema.parse(input);
      const order = toOrder(validatedInput);
      writeOrders([order, ...readOrders()]);
      return order;
    }),

  updateOrder: async (id: string, input: OrderDraftInput): Promise<Order> =>
    mockRequest(() => {
      const validatedInput = orderFormSchema.parse(input);
      const orders = readOrders();
      const existing = orders.find((order) => order.id === id);
      if (!existing) {
        throw new Error("Order not found");
      }
      const carrier =
        carriers.find((item) => item.id === validatedInput.carrierId) ??
        existing.carrier;
      const updated: Order = {
        ...existing,
        ...validatedInput,
        carrier,
        stops: validatedInput.stops.map((stop, index) => ({
          ...stop,
          order: index + 1,
        })),
        updatedAt: new Date().toISOString(),
      };
      writeOrders(orders.map((order) => (order.id === id ? updated : order)));
      return updated;
    }),

  deleteOrder: async (id: string): Promise<void> =>
    mockRequest(() => {
      const order = readOrders().find((item) => item.id === id);
      if (order?.status !== "pending") {
        throw new Error("Only pending orders can be deleted");
      }
      writeOrders(readOrders().filter((item) => item.id !== id));
    }),

  updateOrderStatus: async (
    id: string,
    status: OrderStatus,
    note?: string,
  ): Promise<Order> =>
    mockRequest(() => {
      const orders = readOrders();
      const existing = orders.find((order) => order.id === id);
      if (!existing) {
        throw new Error("Order not found");
      }
      if (!canChangeOrderStatus(existing.status, status)) {
        throw new Error("Status transition is not allowed");
      }
      const now = new Date().toISOString();
      const updated: Order = {
        ...existing,
        status,
        statusHistory: [
          ...existing.statusHistory,
          { from: existing.status, to: status, changedAt: now, note },
        ],
        updatedAt: now,
      };
      writeOrders(orders.map((order) => (order.id === id ? updated : order)));
      return updated;
    }),

  getAllowedTransitions: getAllowedOrderStatusTransitions,
};

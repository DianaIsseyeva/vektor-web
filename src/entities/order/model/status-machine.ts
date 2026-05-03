import type { OrderStatus } from "@/entities/order/model/types";

const transitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ["in_transit", "cancelled"],
  in_transit: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export function canChangeOrderStatus(from: OrderStatus, to: OrderStatus) {
  return transitions[from].includes(to);
}

export function getAllowedOrderStatusTransitions(status: OrderStatus) {
  return transitions[status];
}

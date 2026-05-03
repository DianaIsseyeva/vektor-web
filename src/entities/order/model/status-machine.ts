import type { OrderStatus } from "@/entities/order/model/types";

const transitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ["in_transit", "cancelled"],
  in_transit: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export function canChangeOrderStatus(from: OrderStatus, to: OrderStatus) {
  return from === to || transitions[from].includes(to);
}

import type { AppointmentType, OrderStatus, StopKind } from "@/entities/order/model/types";

export const ORDER_STATUSES: OrderStatus[] = ["pending", "in_transit", "delivered", "cancelled"];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STOP_KIND_LABELS: Record<StopKind, string> = {
  pickup: "Pick Up",
  stop: "Stop",
  dropoff: "Drop Off",
};

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  fixed: "Fixed",
  window: "Window",
  fcfs: "FCFS",
};

export const EQUIPMENT_TYPES = ["Dry Van", "Reefer", "Flatbed", "Step Deck", "Power Only"] as const;
export const LOAD_TYPES = ["FTL", "LTL", "Partial"] as const;

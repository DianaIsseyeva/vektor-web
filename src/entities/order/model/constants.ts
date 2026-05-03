import type {
  AppointmentType,
  EquipmentType,
  LoadType,
  OrderStatus,
  StopType,
} from "@/entities/order/model/types";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "in_transit",
  "delivered",
  "cancelled",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STOP_TYPE_LABELS: Record<StopType, string> = {
  pick_up: "Pick Up",
  stop: "Stop",
  drop_off: "Drop Off",
};

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  fixed: "Fixed",
  window: "Window",
  fcfs: "FCFS",
};

export const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
  dry_van: "Dry Van",
  reefer: "Reefer",
  flatbed: "Flatbed",
  step_deck: "Step Deck",
};

export const LOAD_TYPE_LABELS: Record<LoadType, string> = {
  ftl: "FTL",
  ltl: "LTL",
};

export const EQUIPMENT_TYPES: EquipmentType[] = [
  "dry_van",
  "reefer",
  "flatbed",
  "step_deck",
];
export const LOAD_TYPES: LoadType[] = ["ftl", "ltl"];

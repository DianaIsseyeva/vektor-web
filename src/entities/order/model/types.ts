export type OrderStatus = "pending" | "in_transit" | "delivered" | "cancelled";

export type AppointmentType = "fixed" | "window" | "fcfs";

export type StopKind = "pickup" | "stop" | "dropoff";

export type OrderStop = {
  id: string;
  kind: StopKind;
  city: string;
  state: string;
  zip: string;
  locationName: string;
  appointmentType: AppointmentType;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
};

export type Order = {
  id: string;
  referenceNumber: string;
  status: OrderStatus;
  clientName: string;
  carrierId: string;
  carrierName: string;
  equipmentType: string;
  loadType: string;
  rate: number;
  weight: number;
  notes: string;
  stops: OrderStop[];
  createdAt: string;
  updatedAt: string;
};

export type OrderDraftInput = {
  referenceNumber: string;
  clientName: string;
  carrierId: string;
  equipmentType: string;
  loadType: string;
  rate: number;
  weight: number;
  notes: string;
  stops: OrderStop[];
};

export type OrdersFilters = {
  search: string;
  status: OrderStatus | "all";
};

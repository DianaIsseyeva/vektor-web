export type OrderStatus = "pending" | "in_transit" | "delivered" | "cancelled";

export type EquipmentType = "dry_van" | "reefer" | "flatbed" | "step_deck";

export type LoadType = "ftl" | "ltl";

export type AppointmentType = "fixed" | "window" | "fcfs";

export type StopType = "pick_up" | "drop_off" | "stop";

export type SortOrder = "asc" | "desc";

export type OrderSortBy = "pickupDate" | "rate" | "status" | "referenceNumber";

export type Address = {
  city: string;
  state: string;
  zip: string;
};

export type Carrier = {
  id: string;
  name: string;
  mcNumber: string;
  phone: string;
  rating: number;
};

export type Stop = {
  id: string;
  type: StopType;
  order: number;
  address: Address;
  locationName?: string;
  refNumber?: string;
  appointmentType: AppointmentType;
  appointmentDate: string | null;
  notes?: string;
};

export type StatusChange = {
  from: OrderStatus | null;
  to: OrderStatus;
  changedAt: string;
  note?: string;
};

export type Order = {
  id: string;
  referenceNumber: string;
  status: OrderStatus;
  clientName: string;
  carrier: Carrier;
  equipmentType: EquipmentType;
  loadType: LoadType;
  rate: number;
  weight: number;
  notes: string;
  stops: Stop[];
  statusHistory: StatusChange[];
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderInput = {
  referenceNumber: string;
  clientName: string;
  carrierId: string;
  equipmentType: EquipmentType;
  loadType: LoadType;
  rate: number;
  weight: number;
  notes: string;
  stops: Stop[];
};

export type OrderDraftInput = CreateOrderInput;

export type OrdersFilters = {
  search: string;
  statuses: OrderStatus[];
};

export type OrdersQuery = OrdersFilters & {
  page: number;
  pageSize: number;
  sortBy: OrderSortBy;
  sortOrder: SortOrder;
};

export type OrdersResponse = {
  data: Order[];
  total: number;
};

export type LocalDraft = {
  id: string;
  title: string;
  formData: Partial<CreateOrderInput>;
  savedAt: string;
};

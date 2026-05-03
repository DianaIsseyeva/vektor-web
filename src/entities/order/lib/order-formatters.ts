import type { Order, OrderStop } from "@/entities/order/model/types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatRate(rate: number) {
  return currencyFormatter.format(rate);
}

export function formatDate(date: string) {
  return dateFormatter.format(new Date(date));
}

export function formatStopLocation(stop: OrderStop) {
  return `${stop.city}, ${stop.state}`;
}

export function formatRoute(order: Order) {
  const firstStop = order.stops[0];
  const lastStop = order.stops[order.stops.length - 1];
  const extraStops = Math.max(order.stops.length - 2, 0);
  const suffix = extraStops > 0 ? ` +${extraStops}` : "";

  return `${formatStopLocation(firstStop)} → ${formatStopLocation(lastStop)}${suffix}`;
}

export function getPickupDate(order: Order) {
  return order.stops[0]?.appointmentDate ?? order.createdAt;
}

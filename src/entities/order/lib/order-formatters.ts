import type { Order, Stop } from "@/entities/order/model/types";

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

export function formatDate(date: string | null | undefined) {
  if (!date) {
    return "No date";
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return "No date";
  }

  return dateFormatter.format(parsedDate);
}

export function formatStopLocation(stop: Stop) {
  return `${stop.address.city}, ${stop.address.state}`;
}

export function formatRoute(order: Order) {
  const firstStop = order.stops[0];
  const lastStop = order.stops[order.stops.length - 1];
  if (!firstStop || !lastStop) {
    return "Route not set";
  }

  const extraStops = Math.max(order.stops.length - 2, 0);
  const suffix = extraStops > 0 ? ` +${extraStops}` : "";

  return `${formatStopLocation(firstStop)} → ${formatStopLocation(lastStop)}${suffix}`;
}

export function getPickupDate(order: Order) {
  return order.stops[0]?.appointmentDate ?? order.createdAt;
}

import { formatRoute } from "@/entities/order/lib/order-formatters";
import type { Order } from "@/entities/order/model/types";

type RouteLabelProps = {
  order: Order;
};

export function RouteLabel({ order }: RouteLabelProps) {
  return <span className="font-medium text-slate-900">{formatRoute(order)}</span>;
}

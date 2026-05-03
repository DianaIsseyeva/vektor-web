import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ChangeStatusDropdown } from "@/features/change-order-status";
import { DeleteOrderButton } from "@/features/delete-order";
import {
  EQUIPMENT_TYPE_LABELS,
  LOAD_TYPE_LABELS,
  STOP_TYPE_LABELS,
  formatDate,
  formatRate,
  formatRoute,
  orderApi,
} from "@/entities/order";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";

export function OrderDetailPage() {
  const { orderId } = useParams();
  const orderQuery = useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => orderApi.getOrder(orderId ?? ""),
    enabled: Boolean(orderId),
  });

  if (orderQuery.isLoading) {
    return <p className="text-slate-500">Loading...</p>;
  }

  if (orderQuery.error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="mb-3 font-medium text-red-700">
          {orderQuery.error.message}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => void orderQuery.refetch()}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!orderQuery.data) {
    return <p className="text-red-500">Order not found</p>;
  }

  const order = orderQuery.data;

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button asChild variant="ghost" className="mb-2 px-0">
            <Link to={routes.orders}>Back to Orders</Link>
          </Button>
          <h2 className="text-xl font-semibold text-slate-950">
            {order.referenceNumber}
          </h2>
          <p className="text-slate-500">{formatRoute(order)}</p>
        </div>
        <div className="flex items-center gap-2">
          <ChangeStatusDropdown orderId={order.id} status={order.status} />
          <Button asChild variant="outline">
            <Link to={routes.editOrder(order.id)}>Edit</Link>
          </Button>
          <DeleteOrderButton orderId={order.id} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Info label="Client" value={order.clientName} />
        <Info
          label="Carrier"
          value={`${order.carrier.name} (${order.carrier.mcNumber})`}
        />
        <Info
          label="Equipment"
          value={EQUIPMENT_TYPE_LABELS[order.equipmentType]}
        />
        <Info label="Type" value={LOAD_TYPE_LABELS[order.loadType]} />
        <Info label="Rate" value={formatRate(order.rate)} />
        <Info label="Weight" value={`${order.weight.toLocaleString()} lbs`} />
      </div>
      <section>
        <h3 className="mb-3 font-semibold">Stops ({order.stops.length})</h3>
        <div className="space-y-3">
          {order.stops.map((stop) => (
            <div key={stop.id} className="rounded-2xl bg-slate-50 p-3 text-sm">
              <p className="font-medium">
                {stop.order}. {STOP_TYPE_LABELS[stop.type]}
              </p>
              <p className="text-slate-600">
                {stop.address.city}, {stop.address.state} {stop.address.zip}
              </p>
              <p className="text-slate-500">
                {stop.appointmentDate
                  ? formatDate(stop.appointmentDate)
                  : "No appointment"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-medium text-slate-950">{value}</p>
    </div>
  );
}

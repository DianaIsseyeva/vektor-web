import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChangeStatusDropdown } from "@/features/change-order-status";
import { DeleteOrderButton } from "@/features/delete-order";
import {
  APPOINTMENT_TYPE_LABELS,
  EQUIPMENT_TYPE_LABELS,
  LOAD_TYPE_LABELS,
  ORDER_STATUS_LABELS,
  STOP_TYPE_LABELS,
  StatusBadge,
  formatDate,
  formatRate,
  formatRoute,
  orderApi,
  type OrderStatus,
} from "@/entities/order";
import { routes } from "@/shared/config/routes";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";

const statusDotClassName: Record<OrderStatus, string> = {
  pending: "bg-slate-400",
  in_transit: "bg-blue-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

export function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
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
  const latestHistoryIndex = order.statusHistory.length - 1;

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Button asChild variant="ghost" className="mb-2 px-0">
            <Link to={routes.orders}>Back to Orders</Link>
          </Button>
          <h2 className="text-xl font-semibold text-slate-950">
            {order.referenceNumber}
          </h2>
          <p className="text-slate-500">{formatRoute(order)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ChangeStatusDropdown orderId={order.id} status={order.status} />
          <Button
            type="button"
            variant="outline"
            disabled={order.status !== "pending"}
            onClick={() => navigate(routes.editOrder(order.id))}
          >
            Edit
          </Button>
          <DeleteOrderButton
            orderId={order.id}
            disabled={order.status !== "pending"}
          />
        </div>
      </div>

      <div className="grid gap-4 border-b border-slate-200 pb-4 md:grid-cols-3">
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

      <section className="border-b border-slate-200 pb-4">
        <h3 className="mb-4 font-semibold text-slate-950">
          Stops ({order.stops.length})
        </h3>
        <div className="space-y-0">
          {order.stops.map((stop, index) => {
            const isLast = index === order.stops.length - 1;

            return (
              <div key={stop.id} className="grid grid-cols-[32px_1fr] gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                    {stop.order}
                  </div>
                  {!isLast ? (
                    <div className="h-full min-h-10 w-px bg-slate-200" />
                  ) : null}
                </div>
                <div className="pb-4">
                  <div className="rounded-2xl bg-slate-50 p-3 text-sm">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-950">
                        {STOP_TYPE_LABELS[stop.type]}
                      </p>
                      <span className="text-slate-400">•</span>
                      <p className="text-slate-600">
                        {stop.address.city}, {stop.address.state}{" "}
                        {stop.address.zip}
                      </p>
                    </div>
                    <p className="text-slate-500">
                      {stop.locationName || "Location not set"}
                    </p>
                    <p className="text-slate-500">
                      {formatDate(stop.appointmentDate)} ·{" "}
                      {APPOINTMENT_TYPE_LABELS[stop.appointmentType]}
                    </p>
                    {stop.notes ? (
                      <p className="mt-2 text-slate-600">{stop.notes}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="font-semibold text-slate-950">Status History</h3>
          <StatusBadge status={order.status} />
        </div>
        <div className="space-y-0">
          {order.statusHistory.map((change, index) => {
            const isLast = index === order.statusHistory.length - 1;
            const isLatest = index === latestHistoryIndex;

            return (
              <div
                key={`${change.changedAt}-${index}`}
                className="grid grid-cols-[24px_1fr] gap-3"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "mt-1 size-3 rounded-full ring-4 ring-white",
                      statusDotClassName[change.to],
                      isLatest && "size-4",
                    )}
                  />
                  {!isLast ? (
                    <div className="h-full min-h-10 w-px bg-slate-200" />
                  ) : null}
                </div>
                <div
                  className={cn(
                    "mb-3 rounded-2xl p-3 text-sm",
                    isLatest ? "bg-blue-50" : "bg-slate-50",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-slate-950">
                      {change.from
                        ? `${ORDER_STATUS_LABELS[change.from]} → `
                        : ""}
                      {ORDER_STATUS_LABELS[change.to]}
                    </p>
                    <p className="text-slate-500">
                      {formatDate(change.changedAt)}
                    </p>
                  </div>
                  {change.note ? (
                    <p className="mt-1 text-slate-600">{change.note}</p>
                  ) : null}
                </div>
              </div>
            );
          })}
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

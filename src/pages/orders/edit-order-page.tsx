import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useEditOrder } from "@/features/edit-order";
import { StatusBadge, orderApi, type OrderFormValues } from "@/entities/order";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { OrderForm } from "@/widgets/order-form";

export function EditOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const editOrder = useEditOrder();
  const orderQuery = useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => orderApi.getOrder(orderId ?? ""),
    enabled: Boolean(orderId),
  });

  if (orderQuery.isLoading) {
    return <p className="text-slate-500">Loading...</p>;
  }

  if (!orderQuery.data || !orderId) {
    return <p className="text-red-500">Order not found</p>;
  }

  if (orderQuery.data.status !== "pending") {
    return (
      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <p className="font-medium text-yellow-900">
            Only pending orders can be edited.
          </p>
          <StatusBadge status={orderQuery.data.status} />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(routes.orderDetail(orderQuery.data.id))}
        >
          Back to Order
        </Button>
      </div>
    );
  }

  const defaultValues: OrderFormValues = {
    referenceNumber: orderQuery.data.referenceNumber,
    clientName: orderQuery.data.clientName,
    carrierId: orderQuery.data.carrier.id,
    equipmentType: orderQuery.data.equipmentType,
    loadType: orderQuery.data.loadType,
    rate: orderQuery.data.rate,
    weight: orderQuery.data.weight,
    notes: orderQuery.data.notes,
    stops: orderQuery.data.stops,
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-950">
          Edit {orderQuery.data.referenceNumber}
        </h2>
        <p className="text-sm text-slate-500">
          Only pending orders can be changed.
        </p>
      </div>
      <OrderForm
        defaultValues={defaultValues}
        submitLabel="Save"
        isSubmitting={editOrder.isPending}
        submitError={editOrder.error?.message}
        onSubmit={async (values) => {
          await editOrder.mutateAsync({ orderId, input: values });
          navigate(routes.orderDetail(orderId));
        }}
      />
    </div>
  );
}

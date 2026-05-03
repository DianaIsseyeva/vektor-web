import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useEditOrder } from "@/features/edit-order";
import { orderApi, type OrderFormValues } from "@/entities/order";
import { routes } from "@/shared/config/routes";
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
  );
}

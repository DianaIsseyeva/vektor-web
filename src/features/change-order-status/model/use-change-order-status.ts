import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  canChangeOrderStatus,
  orderApi,
  type OrderStatus,
} from "@/entities/order";

type ChangeOrderStatusPayload = {
  orderId: string;
  currentStatus: OrderStatus;
  nextStatus: OrderStatus;
};

export function useChangeOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      currentStatus,
      nextStatus,
    }: ChangeOrderStatusPayload) => {
      if (!canChangeOrderStatus(currentStatus, nextStatus)) {
        throw new Error("Status transition is not allowed");
      }

      return orderApi.updateOrderStatus(orderId, nextStatus);
    },
    onSuccess: (order) => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      if (order) {
        void queryClient.invalidateQueries({ queryKey: ["orders", order.id] });
      }
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi, type OrderDraftInput } from "@/entities/order";

type EditOrderPayload = {
  orderId: string;
  input: OrderDraftInput;
};

export function useEditOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, input }: EditOrderPayload) =>
      orderApi.updateOrder(orderId, input),
    onSuccess: (order) => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      if (order) {
        void queryClient.invalidateQueries({ queryKey: ["orders", order.id] });
      }
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/entities/order";

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderApi.deleteOrder(orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
